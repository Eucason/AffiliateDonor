export type AdminDonationStatus = 'successful' | 'pending' | 'failed' | 'refunded'

export type AdminDonationMethod = 'Card' | 'PayPal' | 'Crypto' | 'Bank Transfer'

export type AdminDonationSort =
  | 'newest'
  | 'oldest'
  | 'highest'
  | 'lowest'
  | 'status'
  | 'campaign'

export interface AdminDonationTimelineEvent {
  id: string
  label: string
  description: string
  status: AdminDonationStatus | 'reviewed'
  occurredAt: string
}

export interface AdminDonation {
  id: string
  donorId: string
  donorName: string
  donorEmail: string
  campaignId: string
  campaignName: string
  amount: number
  currency: string
  method: AdminDonationMethod
  status: AdminDonationStatus
  transactionId: string
  createdAt: string
  updatedAt: string
  reviewedAt?: string
  reviewedBy?: string
  adminNotes?: string
  timeline: AdminDonationTimelineEvent[]
}

export interface AdminDonationFilters {
  search: string
  status: 'all' | AdminDonationStatus
  campaign: string
  method: 'all' | AdminDonationMethod
  currency: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
  sort: AdminDonationSort
}

export interface AdminDonationSummary {
  totalContributed: number
  successfulCount: number
  pendingCount: number
  failedOrRefundedCount: number
  visibleTotal: number
}

export interface AdminDonationListResponse {
  donations: AdminDonation[]
  summary: AdminDonationSummary
}

export interface AdminDonationFilterOptions {
  campaigns: string[]
  methods: AdminDonationMethod[]
  currencies: string[]
}
