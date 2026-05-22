import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminApprovalsAPI, summarizeApprovals } from '@/services/admin/adminApprovalsAPI'
import type {
  AdminApprovalFilterOptions,
  AdminApprovalFilters,
  AdminApprovalPriority,
  AdminApprovalRequest,
  AdminApprovalStatus,
  AdminApprovalType,
} from '@/types/adminApproval'

export const defaultAdminApprovalFilters: AdminApprovalFilters = {
  search: '',
  status: 'all',
  type: 'all',
  priority: 'all',
  dateFrom: '',
  dateTo: '',
  sort: 'newest',
}

export function useAdminApprovals(initialFilters: Partial<AdminApprovalFilters> = {}) {
  const [approvals, setApprovals] = useState<AdminApprovalRequest[]>([])
  const [filters, setFilters] = useState<AdminApprovalFilters>({
    ...defaultAdminApprovalFilters,
    ...initialFilters,
  })
  const [selectedApproval, setSelectedApproval] = useState<AdminApprovalRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminApprovalsAPI.getApprovals()
      setApprovals(response.approvals)
    } catch (requestError) {
      console.error('Failed to load admin approvals:', requestError)
      setError('Approvals could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApprovals()
  }, [fetchApprovals])

  const filteredApprovals = useMemo(
    () => sortApprovals(approvals.filter((approval) => approvalMatchesFilters(approval, filters)), filters.sort),
    [approvals, filters],
  )
  const summary = useMemo(() => summarizeApprovals(filteredApprovals), [filteredApprovals])

  const filterOptions = useMemo<AdminApprovalFilterOptions>(
    () => ({
      types: uniqueSorted(approvals.map((approval) => approval.type)),
      statuses: uniqueSorted(approvals.map((approval) => approval.status)),
      priorities: uniqueSorted(approvals.map((approval) => approval.priority)),
      requesters: uniqueSorted(approvals.map((approval) => approval.requestedBy)),
    }),
    [approvals],
  )

  const updateFilter = useCallback(
    <Key extends keyof AdminApprovalFilters>(key: Key, value: AdminApprovalFilters[Key]) => {
      setFilters((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultAdminApprovalFilters)
  }, [])

  const reviewApproval = useCallback(
    async (id: string, status: Extract<AdminApprovalStatus, 'approved' | 'rejected'>, comment: string) => {
      try {
        setSaving(true)
        const updated = await adminApprovalsAPI.reviewApproval(id, status, comment)
        setApprovals((current) => current.map((approval) => (approval.id === id ? updated : approval)))
        setSelectedApproval(updated)
      } catch (requestError) {
        console.error('Failed to review admin approval:', requestError)
        setError('Approval review could not be saved. Please try again.')
      } finally {
        setSaving(false)
      }
    },
    [],
  )

  return {
    approvals,
    filteredApprovals,
    filterOptions,
    filters,
    summary,
    selectedApproval,
    loading,
    saving,
    error,
    refetch: fetchApprovals,
    updateFilter,
    clearFilters,
    setSelectedApproval,
    reviewApproval,
  }
}

function approvalMatchesFilters(approval: AdminApprovalRequest, filters: AdminApprovalFilters) {
  const search = filters.search.trim().toLowerCase()
  const searchable = [
    approval.title,
    approval.summary,
    approval.requestedBy,
    approval.relatedEntityLabel,
    approval.type,
    approval.status,
  ].join(' ').toLowerCase()

  if (search && !searchable.includes(search)) {
    return false
  }

  if (filters.status !== 'all' && approval.status !== filters.status) {
    return false
  }

  if (filters.type !== 'all' && approval.type !== filters.type) {
    return false
  }

  if (filters.priority !== 'all' && approval.priority !== filters.priority) {
    return false
  }

  if (filters.dateFrom && new Date(approval.submittedAt) < new Date(filters.dateFrom)) {
    return false
  }

  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo)
    dateTo.setHours(23, 59, 59, 999)
    if (new Date(approval.submittedAt) > dateTo) {
      return false
    }
  }

  return true
}

function sortApprovals(approvals: AdminApprovalRequest[], sort: AdminApprovalFilters['sort']) {
  return [...approvals].sort((first, second) => {
    switch (sort) {
      case 'oldest':
        return new Date(first.submittedAt).getTime() - new Date(second.submittedAt).getTime()
      case 'priority':
        return priorityWeight(second.priority) - priorityWeight(first.priority)
      case 'status':
        return first.status.localeCompare(second.status)
      case 'requester':
        return first.requestedBy.localeCompare(second.requestedBy)
      case 'newest':
      default:
        return new Date(second.submittedAt).getTime() - new Date(first.submittedAt).getTime()
    }
  })
}

function priorityWeight(priority: AdminApprovalPriority) {
  const weights: Record<AdminApprovalPriority, number> = {
    urgent: 3,
    high: 2,
    normal: 1,
  }
  return weights[priority]
}

function uniqueSorted<T extends AdminApprovalType | AdminApprovalStatus | AdminApprovalPriority | string>(values: T[]) {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second))
}
