import type { AdminRole } from '@/types/admin'

export type AdminUserRole = AdminRole | 'donor'

export type AdminUserStatus = 'active' | 'inactive'

export type AdminUserSort = 'newest' | 'oldest' | 'name' | 'total-donations' | 'impact' | 'last-active' | 'role'

export interface AdminUserDonation {
  id: string
  campaignId: string
  campaignName: string
  amount: number
  currency: string
  method: string
  status: 'successful' | 'pending' | 'failed' | 'refunded'
  transactionId: string
  createdAt: string
}

export interface AdminUserActivity {
  id: string
  type: 'donation' | 'purchase' | 'message' | 'profile' | 'role'
  label: string
  description: string
  createdAt: string
  sourcePath?: string
}

export interface AdminUserNote {
  id: string
  author: string
  body: string
  createdAt: string
}

export interface AdminUserProductActivity {
  id: string
  label: string
  type: 'affiliate' | 'merch'
  value: number
  createdAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  avatarUrl?: string
  phone?: string
  location?: string
  role: AdminUserRole
  status: AdminUserStatus
  joinedAt: string
  lastActiveAt: string
  totalDonations: number
  totalPurchases: number
  causesSupported: number
  impactScore: number
  supportedCauses: string[]
  contactMessageIds: string[]
  donationHistory: AdminUserDonation[]
  productActivity: AdminUserProductActivity[]
  activity: AdminUserActivity[]
  notes: AdminUserNote[]
}

export interface AdminUserFilters {
  search: string
  role: 'all' | AdminUserRole
  donorState: 'all' | 'donors' | 'non-donors'
  signupFrom: string
  signupTo: string
  donationMin: string
  donationMax: string
  activityStatus: 'all' | AdminUserStatus
  cause: string
  sort: AdminUserSort
}

export interface AdminUserSummary {
  totalUsers: number
  donorCount: number
  adminCount: number
  inactiveCount: number
  totalDonations: number
}

export interface AdminUsersListResponse {
  users: AdminUser[]
  summary: AdminUserSummary
}

export interface AdminUserFilterOptions {
  roles: AdminUserRole[]
  causes: string[]
}
