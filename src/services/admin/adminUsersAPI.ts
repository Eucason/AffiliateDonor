import apiClient from '@/lib/apiClient'
import type {
  AdminUser,
  AdminUserActivity,
  AdminUserDonation,
  AdminUserNote,
  AdminUserProductActivity,
  AdminUserRole,
  AdminUserSummary,
  AdminUsersListResponse,
} from '@/types/adminUser'

const fallbackStorageKey = 'affiliateDonor.adminUsers'
const now = Date.now()

const mockUsers: AdminUser[] = [
  createMockUser({
    id: 'usr-201',
    name: 'Maya Thompson',
    email: 'maya@example.com',
    location: 'Austin, TX',
    phone: '+1 512 555 0188',
    role: 'donor',
    status: 'active',
    joinedDaysAgo: 420,
    lastActiveHoursAgo: 3,
    totalPurchases: 3,
    supportedCauses: ['Clean Water Initiative', 'Education for All'],
    donations: [
      donation('don-1048', 'clean-water', 'Clean Water Initiative', 250, 'Card', 'successful', 'txn_card_9F41AZ', 18),
      donation('don-1032', 'education-for-all', 'Education for All', 125, 'PayPal', 'successful', 'txn_paypal_73QAZ', 2600),
    ],
    products: [
      productActivity('prd-maya-1', 'Eco-Friendly Water Bottle', 'affiliate', 24, 52),
      productActivity('prd-maya-2', 'AffiliateDonor T-Shirt', 'merch', 35, 160),
    ],
  }),
  createMockUser({
    id: 'usr-202',
    name: 'Daniel Cooper',
    email: 'daniel@example.com',
    location: 'Denver, CO',
    role: 'support',
    status: 'active',
    joinedDaysAgo: 280,
    lastActiveHoursAgo: 11,
    totalPurchases: 1,
    supportedCauses: ['Education for All'],
    donations: [
      donation('don-1047', 'education-for-all', 'Education for All', 75, 'PayPal', 'successful', 'txn_paypal_2ND8QP', 54),
    ],
  }),
  createMockUser({
    id: 'usr-203',
    name: 'Aisha Khan',
    email: 'aisha@example.com',
    location: 'Brooklyn, NY',
    role: 'donor',
    status: 'active',
    joinedDaysAgo: 190,
    lastActiveHoursAgo: 20,
    totalPurchases: 0,
    supportedCauses: ['Healthcare Access', 'Clean Water Initiative'],
    donations: [
      donation('don-1046', 'healthcare-access', 'Healthcare Access', 120, 'Crypto', 'pending', '0x8f31c4d9bd72', 92),
      donation('don-1020', 'clean-water', 'Clean Water Initiative', 60, 'Card', 'successful', 'txn_card_82MNZ', 6200),
    ],
  }),
  createMockUser({
    id: 'usr-204',
    name: 'Noah Rivera',
    email: 'noah@example.com',
    location: 'Phoenix, AZ',
    role: 'donor',
    status: 'inactive',
    joinedDaysAgo: 510,
    lastActiveHoursAgo: 980,
    totalPurchases: 2,
    supportedCauses: ['Hunger Relief'],
    donations: [
      donation('don-1045', 'hunger-relief', 'Hunger Relief', 50, 'Card', 'failed', 'txn_card_3KQ2PL', 140),
    ],
  }),
  createMockUser({
    id: 'usr-205',
    name: 'Olivia Grant',
    email: 'olivia@example.com',
    location: 'Seattle, WA',
    role: 'admin',
    status: 'active',
    joinedDaysAgo: 650,
    lastActiveHoursAgo: 1,
    totalPurchases: 7,
    supportedCauses: ['Clean Water Initiative', 'Wildlife Conservation', 'Healthcare Access'],
    donations: [
      donation('don-1044', 'clean-water', 'Clean Water Initiative', 500, 'Bank Transfer', 'successful', 'txn_bank_7QZ44L', 320),
      donation('don-1011', 'wildlife-conservation', 'Wildlife Conservation', 220, 'Card', 'successful', 'txn_card_91KQW', 12600),
      donation('don-1009', 'healthcare-access', 'Healthcare Access', 180, 'PayPal', 'successful', 'txn_paypal_11HDQ', 14000),
    ],
  }),
  createMockUser({
    id: 'usr-206',
    name: 'Liam Brooks',
    email: 'liam@example.com',
    location: 'Chicago, IL',
    role: 'analyst',
    status: 'active',
    joinedDaysAgo: 330,
    lastActiveHoursAgo: 32,
    totalPurchases: 1,
    supportedCauses: ['Wildlife Conservation'],
    donations: [
      donation('don-1043', 'wildlife-conservation', 'Wildlife Conservation', 35, 'Card', 'refunded', 'txn_card_1BB8KS', 980),
    ],
  }),
  createMockUser({
    id: 'usr-207',
    name: 'Priya Shah',
    email: 'priya@example.com',
    location: 'San Jose, CA',
    role: 'donor',
    status: 'active',
    joinedDaysAgo: 95,
    lastActiveHoursAgo: 8,
    totalPurchases: 0,
    supportedCauses: ['Education for All'],
    donations: [
      donation('don-1042', 'education-for-all', 'Education for All', 180, 'Card', 'successful', 'txn_card_5MKA91', 1260),
    ],
  }),
  createMockUser({
    id: 'usr-208',
    name: 'Marcus Lee',
    email: 'marcus@example.com',
    location: 'Atlanta, GA',
    role: 'donor',
    status: 'active',
    joinedDaysAgo: 30,
    lastActiveHoursAgo: 15,
    totalPurchases: 0,
    supportedCauses: ['Healthcare Access'],
    donations: [
      donation('don-1041', 'healthcare-access', 'Healthcare Access', 95, 'PayPal', 'pending', 'txn_paypal_61TQ8R', 1680),
    ],
  }),
  createMockUser({
    id: 'usr-209',
    name: 'Grace Miller',
    email: 'grace@example.com',
    location: 'Boston, MA',
    role: 'editor',
    status: 'inactive',
    joinedDaysAgo: 760,
    lastActiveHoursAgo: 1600,
    totalPurchases: 0,
    supportedCauses: [],
    donations: [],
  }),
]

export const adminUsersAPI = {
  async getUsers(): Promise<AdminUsersListResponse> {
    try {
      const response = await apiClient.get<AdminUsersListResponse>('/api/admin/users')
      return response.data
    } catch (error) {
      console.warn('Using admin users fallback data because the API could not be reached.', error)
      const users = getFallbackUsers()
      return {
        users,
        summary: summarizeUsers(users),
      }
    }
  },

  async getUser(id: string): Promise<AdminUser> {
    try {
      const response = await apiClient.get<AdminUser>(`/api/admin/users/${id}`)
      return response.data
    } catch (error) {
      console.warn('Using admin user fallback detail because the API could not be reached.', error)
      const user = getFallbackUsers().find((item) => item.id === id)

      if (!user) {
        throw new Error('User not found.')
      }

      return user
    }
  },

  async updateRole(id: string, role: AdminUserRole): Promise<AdminUser> {
    const user = await this.getUser(id)
    const roleActivity: AdminUserActivity = {
      id: `${id}-role-${Date.now()}`,
      type: 'role',
      label: 'Role updated',
      description: `Role changed to ${role}.`,
      createdAt: new Date().toISOString(),
    }
    const updated: AdminUser = {
      ...user,
      role,
      activity: [roleActivity, ...user.activity],
    }

    try {
      const response = await apiClient.patch<AdminUser>(`/api/admin/users/${id}/role`, { role })
      saveFallbackUser(response.data)
      return response.data
    } catch (error) {
      console.warn('Updating role in fallback admin storage because the API could not be reached.', error)
      saveFallbackUser(updated)
      return updated
    }
  },

  async addNote(id: string, body: string): Promise<AdminUser> {
    const user = await this.getUser(id)
    const note: AdminUserNote = {
      id: `${id}-note-${Date.now()}`,
      author: 'Admin Team',
      body,
      createdAt: new Date().toISOString(),
    }
    const updated: AdminUser = {
      ...user,
      notes: [note, ...user.notes],
    }

    try {
      const response = await apiClient.post<AdminUser>(`/api/admin/users/${id}/notes`, { body })
      saveFallbackUser(response.data)
      return response.data
    } catch (error) {
      console.warn('Saving note in fallback admin storage because the API could not be reached.', error)
      saveFallbackUser(updated)
      return updated
    }
  },
}

export function summarizeUsers(users: AdminUser[]): AdminUserSummary {
  return users.reduce<AdminUserSummary>(
    (summary, user) => {
      summary.totalUsers += 1

      if (user.totalDonations > 0) {
        summary.donorCount += 1
      }

      if (user.role !== 'donor') {
        summary.adminCount += 1
      }

      if (user.status === 'inactive') {
        summary.inactiveCount += 1
      }

      summary.totalDonations += user.totalDonations
      return summary
    },
    {
      totalUsers: 0,
      donorCount: 0,
      adminCount: 0,
      inactiveCount: 0,
      totalDonations: 0,
    },
  )
}

function donation(
  id: string,
  campaignId: string,
  campaignName: string,
  amount: number,
  method: string,
  status: AdminUserDonation['status'],
  transactionId: string,
  hoursAgo: number,
): AdminUserDonation {
  return {
    id,
    campaignId,
    campaignName,
    amount,
    currency: 'USD',
    method,
    status,
    transactionId,
    createdAt: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString(),
  }
}

function productActivity(
  id: string,
  label: string,
  type: AdminUserProductActivity['type'],
  value: number,
  hoursAgo: number,
): AdminUserProductActivity {
  return {
    id,
    label,
    type,
    value,
    createdAt: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString(),
  }
}

function createMockUser(user: {
  id: string
  name: string
  email: string
  avatarUrl?: string
  phone?: string
  location?: string
  role: AdminUserRole
  status: AdminUser['status']
  joinedDaysAgo: number
  lastActiveHoursAgo: number
  totalPurchases: number
  supportedCauses: string[]
  donations: AdminUserDonation[]
  products?: AdminUserProductActivity[]
}): AdminUser {
  const totalDonations = user.donations
    .filter((item) => item.status === 'successful')
    .reduce((total, item) => total + item.amount, 0)
  const joinedAt = new Date(now - user.joinedDaysAgo * 24 * 60 * 60 * 1000).toISOString()
  const lastActiveAt = new Date(now - user.lastActiveHoursAgo * 60 * 60 * 1000).toISOString()
  const activity = buildActivity(user.donations, user.products ?? [], lastActiveAt)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    location: user.location,
    role: user.role,
    status: user.status,
    joinedAt,
    lastActiveAt,
    totalDonations,
    totalPurchases: user.totalPurchases,
    causesSupported: user.supportedCauses.length,
    impactScore: Math.round(totalDonations / 5 + user.supportedCauses.length * 80 + user.totalPurchases * 20),
    supportedCauses: user.supportedCauses,
    contactMessageIds: user.email.includes('olivia') ? ['msg-308'] : [],
    donationHistory: user.donations,
    productActivity: user.products ?? [],
    activity,
    notes: [
      {
        id: `${user.id}-note-1`,
        author: 'Admin Team',
        body: user.role === 'donor' ? 'Responsive donor; prioritize clear campaign impact updates.' : 'Internal admin account.',
        createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  }
}

function buildActivity(
  donations: AdminUserDonation[],
  products: AdminUserProductActivity[],
  lastActiveAt: string,
): AdminUserActivity[] {
  const donationActivity = donations.map<AdminUserActivity>((item) => ({
    id: `${item.id}-activity`,
    type: 'donation',
    label: `${item.status === 'successful' ? 'Donation completed' : 'Donation updated'}`,
    description: `${item.campaignName} - ${item.status}`,
    createdAt: item.createdAt,
    sourcePath: `/admin/donations/${item.id}`,
  }))
  const productActivityItems = products.map<AdminUserActivity>((item) => ({
    id: `${item.id}-activity`,
    type: 'purchase',
    label: item.type === 'merch' ? 'Merch activity' : 'Affiliate activity',
    description: `${item.label} generated ${item.value.toLocaleString()} in tracked value.`,
    createdAt: item.createdAt,
  }))
  const profileActivity: AdminUserActivity = {
    id: `profile-${lastActiveAt}`,
    type: 'profile',
    label: 'Profile activity',
    description: 'User was recently active on the platform.',
    createdAt: lastActiveAt,
  }

  return [
    profileActivity,
    ...donationActivity,
    ...productActivityItems,
  ].sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
}

function getFallbackUsers() {
  return mergeUsers(mockUsers, readStoredUsers())
}

function saveFallbackUser(user: AdminUser) {
  if (typeof window === 'undefined') {
    return
  }

  const stored = readStoredUsers()
  window.localStorage.setItem(fallbackStorageKey, JSON.stringify(mergeUsers(stored, [user])))
}

function readStoredUsers(): AdminUser[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(fallbackStorageKey)
    return value ? (JSON.parse(value) as AdminUser[]) : []
  } catch (error) {
    console.warn('Stored admin users could not be parsed.', error)
    return []
  }
}

function mergeUsers(base: AdminUser[], overrides: AdminUser[]) {
  const usersById = new Map<string, AdminUser>()
  base.forEach((user) => usersById.set(user.id, user))
  overrides.forEach((user) => usersById.set(user.id, user))
  return Array.from(usersById.values())
}
