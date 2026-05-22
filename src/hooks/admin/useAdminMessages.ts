import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminMessagesAPI, summarizeMessages } from '@/services/admin/adminMessagesAPI'
import type { AdminMessage, AdminMessageFilterOptions, AdminMessageFilters } from '@/types/adminMessage'

export const defaultAdminMessageFilters: AdminMessageFilters = {
  search: '',
  status: 'all',
  assignedAdmin: 'all',
  donorMatch: 'all',
  dateFrom: '',
  dateTo: '',
  severity: 'all',
  sort: 'newest',
}

export function useAdminMessages(initialFilters: Partial<AdminMessageFilters> = {}) {
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [filters, setFilters] = useState<AdminMessageFilters>({
    ...defaultAdminMessageFilters,
    ...initialFilters,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminMessagesAPI.getMessages()
      setMessages(response.messages)
    } catch (requestError) {
      console.error('Failed to load admin messages:', requestError)
      setError('Contact messages could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const filteredMessages = useMemo(() => {
    return sortMessages(messages.filter((message) => messageMatchesFilters(message, filters)), filters.sort)
  }, [messages, filters])

  const summary = useMemo(() => summarizeMessages(filteredMessages), [filteredMessages])

  const filterOptions = useMemo<AdminMessageFilterOptions>(
    () => ({
      assignedAdmins: uniqueSorted(messages.map((message) => message.assignedAdmin)),
      statuses: uniqueSorted(messages.map((message) => message.status)),
    }),
    [messages],
  )

  const updateFilter = useCallback(
    <Key extends keyof AdminMessageFilters>(key: Key, value: AdminMessageFilters[Key]) => {
      setFilters((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultAdminMessageFilters)
  }, [])

  const replaceMessage = useCallback((updatedMessage: AdminMessage) => {
    setMessages((current) => current.map((message) => (message.id === updatedMessage.id ? updatedMessage : message)))
  }, [])

  return {
    messages,
    filteredMessages,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch: fetchMessages,
    updateFilter,
    clearFilters,
    replaceMessage,
  }
}

function messageMatchesFilters(message: AdminMessage, filters: AdminMessageFilters) {
  const search = filters.search.trim().toLowerCase()
  const searchable = [
    message.id,
    message.senderName,
    message.senderEmail,
    message.subject,
    message.body,
    message.status,
  ]
    .join(' ')
    .toLowerCase()

  if (search && !searchable.includes(search)) {
    return false
  }

  if (filters.status !== 'all' && message.status !== filters.status) {
    return false
  }

  if (filters.assignedAdmin !== 'all' && message.assignedAdmin !== filters.assignedAdmin) {
    return false
  }

  if (filters.donorMatch === 'matched' && !message.donorMatch) {
    return false
  }

  if (filters.donorMatch === 'unmatched' && message.donorMatch) {
    return false
  }

  if (filters.severity !== 'all' && message.severity !== filters.severity) {
    return false
  }

  if (filters.dateFrom && new Date(message.receivedAt) < new Date(filters.dateFrom)) {
    return false
  }

  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo)
    dateTo.setHours(23, 59, 59, 999)
    if (new Date(message.receivedAt) > dateTo) {
      return false
    }
  }

  return true
}

function sortMessages(messages: AdminMessage[], sort: AdminMessageFilters['sort']) {
  return [...messages].sort((first, second) => {
    switch (sort) {
      case 'oldest':
        return new Date(first.receivedAt).getTime() - new Date(second.receivedAt).getTime()
      case 'status':
        return first.status.localeCompare(second.status)
      case 'sender':
        return first.senderName.localeCompare(second.senderName)
      case 'assigned':
        return first.assignedAdmin.localeCompare(second.assignedAdmin)
      case 'newest':
      default:
        return new Date(second.receivedAt).getTime() - new Date(first.receivedAt).getTime()
    }
  })
}

function uniqueSorted<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second))
}
