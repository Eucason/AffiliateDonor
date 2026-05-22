export type AdminCauseStatus = 'active' | 'draft' | 'pending' | 'archived'

export type AdminCauseSort = 'newest' | 'oldest' | 'name' | 'raised' | 'progress' | 'status'

export interface AdminCauseDonation {
  id: string
  donorName: string
  donorEmail: string
  amount: number
  currency: string
  status: 'successful' | 'pending' | 'failed' | 'refunded'
  createdAt: string
}

export interface AdminCauseActivityEvent {
  id: string
  label: string
  description: string
  occurredAt: string
  actor: string
}

export interface AdminCause {
  id: string
  name: string
  slug: string
  category: string
  description: string
  goal: number
  raised: number
  currency: string
  supporters: number
  location: string
  startDate: string
  endDate?: string
  mainImage: string
  galleryImages: string[]
  featured: boolean
  verified: boolean
  status: AdminCauseStatus
  impactMetric: string
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
  linkedDonations: AdminCauseDonation[]
  activity: AdminCauseActivityEvent[]
}

export interface AdminCauseFormData {
  name: string
  slug: string
  category: string
  description: string
  goal: string
  location: string
  startDate: string
  endDate: string
  mainImage: string
  galleryImages: string
  featured: boolean
  verified: boolean
  status: AdminCauseStatus
  impactMetric: string
  seoTitle: string
  seoDescription: string
}

export interface AdminCauseFilters {
  search: string
  status: 'all' | AdminCauseStatus
  category: string
  featured: 'all' | 'featured' | 'not-featured'
  verified: 'all' | 'verified' | 'unverified'
  dateFrom: string
  dateTo: string
  progressMin: string
  progressMax: string
  sort: AdminCauseSort
}

export interface AdminCauseSummary {
  activeCount: number
  draftCount: number
  archivedCount: number
  totalRaised: number
  totalGoal: number
}

export interface AdminCauseListResponse {
  causes: AdminCause[]
  summary: AdminCauseSummary
}

export interface AdminCauseFilterOptions {
  categories: string[]
  statuses: AdminCauseStatus[]
}
