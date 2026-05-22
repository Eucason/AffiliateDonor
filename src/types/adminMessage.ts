export type AdminMessageStatus = 'unread' | 'read' | 'pending' | 'replied' | 'resolved' | 'archived' | 'spam'

export type AdminMessageSeverity = 'normal' | 'priority' | 'urgent'

export type AdminMessageSort = 'newest' | 'oldest' | 'status' | 'sender' | 'assigned'

export interface AdminMessageNote {
  id: string
  author: string
  body: string
  createdAt: string
}

export interface AdminMessageDonorMatch {
  id: string
  name: string
  email: string
  totalDonations: number
  causesSupported: number
}

export interface AdminMessageDonation {
  id: string
  campaignName: string
  amount: number
  currency: string
  status: 'successful' | 'pending' | 'failed' | 'refunded'
  createdAt: string
}

export interface AdminMessage {
  id: string
  senderName: string
  senderEmail: string
  subject: string
  body: string
  status: AdminMessageStatus
  severity: AdminMessageSeverity
  assignedAdmin: string
  receivedAt: string
  updatedAt: string
  source: 'contact_form' | 'support_email' | 'partner_form'
  donorMatch?: AdminMessageDonorMatch
  relatedDonations: AdminMessageDonation[]
  notes: AdminMessageNote[]
}

export interface AdminMessageFilters {
  search: string
  status: 'all' | AdminMessageStatus
  assignedAdmin: string
  donorMatch: 'all' | 'matched' | 'unmatched'
  dateFrom: string
  dateTo: string
  severity: 'all' | AdminMessageSeverity
  sort: AdminMessageSort
}

export interface AdminMessageSummary {
  unreadCount: number
  pendingCount: number
  repliedCount: number
  resolvedCount: number
  totalCount: number
}

export interface AdminMessagesListResponse {
  messages: AdminMessage[]
  summary: AdminMessageSummary
}

export interface AdminMessageFilterOptions {
  assignedAdmins: string[]
  statuses: AdminMessageStatus[]
}

export interface PublicContactMessageRequest {
  name: string
  email: string
  subject: string
  message: string
}
