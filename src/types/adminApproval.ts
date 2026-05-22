export type AdminApprovalType = 'campaign' | 'content' | 'product' | 'refund'

export type AdminApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested'

export type AdminApprovalPriority = 'normal' | 'high' | 'urgent'

export interface AdminApprovalComment {
  id: string
  author: string
  body: string
  createdAt: string
}

export interface AdminApprovalRequest {
  id: string
  type: AdminApprovalType
  status: AdminApprovalStatus
  priority: AdminApprovalPriority
  title: string
  summary: string
  requestedBy: string
  submittedAt: string
  relatedEntityId: string
  relatedEntityLabel: string
  relatedEntityPath: string
  impact: string
  reviewer?: string
  reviewedAt?: string
  comments: AdminApprovalComment[]
}

export interface AdminApprovalFilters {
  search: string
  status: 'all' | AdminApprovalStatus
  type: 'all' | AdminApprovalType
  priority: 'all' | AdminApprovalPriority
  dateFrom: string
  dateTo: string
  sort: 'newest' | 'oldest' | 'priority' | 'status' | 'requester'
}

export interface AdminApprovalFilterOptions {
  types: AdminApprovalType[]
  statuses: AdminApprovalStatus[]
  priorities: AdminApprovalPriority[]
  requesters: string[]
}

export interface AdminApprovalSummary {
  totalCount: number
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  urgentCount: number
}

export interface AdminApprovalsResponse {
  approvals: AdminApprovalRequest[]
  summary: AdminApprovalSummary
}
