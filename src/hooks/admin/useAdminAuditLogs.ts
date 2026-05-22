import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminAuditAPI, summarizeAuditLogs } from '@/services/admin/adminAuditAPI'
import type {
  AdminAuditFilterOptions,
  AdminAuditLog,
  AdminAuditLogFilters,
} from '@/types/adminAudit'

export const defaultAdminAuditLogFilters: AdminAuditLogFilters = {
  search: '',
  actor: 'all',
  action: 'all',
  entityType: 'all',
  dateFrom: '',
  dateTo: '',
  sort: 'newest',
}

export function useAdminAuditLogs(initialFilters: Partial<AdminAuditLogFilters> = {}) {
  const [logs, setLogs] = useState<AdminAuditLog[]>([])
  const [filters, setFilters] = useState<AdminAuditLogFilters>({
    ...defaultAdminAuditLogFilters,
    ...initialFilters,
  })
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminAuditAPI.getAuditLogs()
      setLogs(response.logs)
    } catch (requestError) {
      console.error('Failed to load admin audit logs:', requestError)
      setError('Audit logs could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const filteredLogs = useMemo(
    () => sortLogs(logs.filter((log) => logMatchesFilters(log, filters)), filters.sort),
    [logs, filters],
  )
  const summary = useMemo(() => summarizeAuditLogs(filteredLogs), [filteredLogs])

  const filterOptions = useMemo<AdminAuditFilterOptions>(
    () => ({
      actors: uniqueSorted(logs.map((log) => log.actor)),
      actions: uniqueSorted(logs.map((log) => log.action)),
      entityTypes: uniqueSorted(logs.map((log) => log.entityType)),
    }),
    [logs],
  )

  const updateFilter = useCallback(
    <Key extends keyof AdminAuditLogFilters>(key: Key, value: AdminAuditLogFilters[Key]) => {
      setFilters((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultAdminAuditLogFilters)
  }, [])

  return {
    logs,
    filteredLogs,
    filterOptions,
    filters,
    summary,
    selectedLog,
    loading,
    error,
    refetch: fetchLogs,
    updateFilter,
    clearFilters,
    setSelectedLog,
  }
}

function logMatchesFilters(log: AdminAuditLog, filters: AdminAuditLogFilters) {
  const search = filters.search.trim().toLowerCase()
  const searchable = [log.actor, log.action, log.entityType, log.entityLabel, log.entityId].join(' ').toLowerCase()

  if (search && !searchable.includes(search)) {
    return false
  }

  if (filters.actor !== 'all' && log.actor !== filters.actor) {
    return false
  }

  if (filters.action !== 'all' && log.action !== filters.action) {
    return false
  }

  if (filters.entityType !== 'all' && log.entityType !== filters.entityType) {
    return false
  }

  if (filters.dateFrom && new Date(log.timestamp) < new Date(filters.dateFrom)) {
    return false
  }

  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo)
    dateTo.setHours(23, 59, 59, 999)
    if (new Date(log.timestamp) > dateTo) {
      return false
    }
  }

  return true
}

function sortLogs(logs: AdminAuditLog[], sort: AdminAuditLogFilters['sort']) {
  return [...logs].sort((first, second) => {
    switch (sort) {
      case 'oldest':
        return new Date(first.timestamp).getTime() - new Date(second.timestamp).getTime()
      case 'actor':
        return first.actor.localeCompare(second.actor)
      case 'action':
        return first.action.localeCompare(second.action)
      case 'entity':
        return first.entityType.localeCompare(second.entityType)
      case 'newest':
      default:
        return new Date(second.timestamp).getTime() - new Date(first.timestamp).getTime()
    }
  })
}

function uniqueSorted<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second))
}
