export type AdminDashboardStatus = 'successful' | 'pending' | 'failed' | 'published' | 'draft'

export interface AdminDashboardMetric {
  id: string
  label: string
  value: string
  helperText: string
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
}

export interface AdminDashboardDonation {
  id: string
  donorName: string
  email: string
  campaign: string
  amount: number
  currency: string
  method: string
  status: AdminDashboardStatus
  createdAt: string
}

export interface AdminDashboardMessage {
  id: string
  name: string
  email: string
  subject: string
  status: 'unread' | 'pending' | 'resolved'
  receivedAt: string
}

export interface AdminDashboardCampaign {
  id: string
  name: string
  category: string
  raised: number
  goal: number
  status: 'active' | 'pending' | 'draft'
  supporters: number
}

export interface AdminDashboardContentItem {
  id: string
  title: string
  type: 'blog' | 'homepage' | 'announcement'
  status: 'published' | 'draft'
  updatedAt: string
}

export interface AdminDashboardProductActivity {
  id: string
  name: string
  type: 'affiliate' | 'merch'
  clicks: number
  conversions: number
  estimatedContribution: number
}

export interface AdminDashboardPendingAction {
  id: string
  label: string
  count: number
  path: string
}

export interface AdminDashboardSnapshot {
  metrics: AdminDashboardMetric[]
  recentDonations: AdminDashboardDonation[]
  recentMessages: AdminDashboardMessage[]
  campaigns: AdminDashboardCampaign[]
  contentActivity: AdminDashboardContentItem[]
  productActivity: AdminDashboardProductActivity[]
  pendingActions: AdminDashboardPendingAction[]
}
