import apiClient from '@/lib/apiClient'
import type {
  AdminDonation,
  AdminDonationListResponse,
  AdminDonationStatus,
  AdminDonationSummary,
  AdminDonationTimelineEvent,
} from '@/types/adminDonation'

const now = Date.now()

const mockDonations: AdminDonation[] = [
  createMockDonation({
    id: 'don-1048',
    donorId: 'usr-201',
    donorName: 'Maya Thompson',
    donorEmail: 'maya@example.com',
    campaignId: 'clean-water',
    campaignName: 'Clean Water Initiative',
    amount: 250,
    method: 'Card',
    status: 'successful',
    transactionId: 'txn_card_9F41AZ',
    minutesAgo: 18,
    reviewedBy: 'Admin Team',
  }),
  createMockDonation({
    id: 'don-1047',
    donorId: 'usr-202',
    donorName: 'Daniel Cooper',
    donorEmail: 'daniel@example.com',
    campaignId: 'education-for-all',
    campaignName: 'Education for All',
    amount: 75,
    method: 'PayPal',
    status: 'successful',
    transactionId: 'txn_paypal_2ND8QP',
    minutesAgo: 54,
  }),
  createMockDonation({
    id: 'don-1046',
    donorId: 'usr-203',
    donorName: 'Aisha Khan',
    donorEmail: 'aisha@example.com',
    campaignId: 'healthcare-access',
    campaignName: 'Healthcare Access',
    amount: 120,
    method: 'Crypto',
    status: 'pending',
    transactionId: '0x8f31c4d9bd72',
    minutesAgo: 92,
    adminNotes: 'Waiting for final network confirmation.',
  }),
  createMockDonation({
    id: 'don-1045',
    donorId: 'usr-204',
    donorName: 'Noah Rivera',
    donorEmail: 'noah@example.com',
    campaignId: 'hunger-relief',
    campaignName: 'Hunger Relief',
    amount: 50,
    method: 'Card',
    status: 'failed',
    transactionId: 'txn_card_3KQ2PL',
    minutesAgo: 140,
    adminNotes: 'Card declined by issuer. Donor can retry from receipt link.',
  }),
  createMockDonation({
    id: 'don-1044',
    donorId: 'usr-205',
    donorName: 'Olivia Grant',
    donorEmail: 'olivia@example.com',
    campaignId: 'clean-water',
    campaignName: 'Clean Water Initiative',
    amount: 500,
    method: 'Bank Transfer',
    status: 'successful',
    transactionId: 'txn_bank_7QZ44L',
    minutesAgo: 320,
    reviewedBy: 'Finance',
  }),
  createMockDonation({
    id: 'don-1043',
    donorId: 'usr-206',
    donorName: 'Liam Brooks',
    donorEmail: 'liam@example.com',
    campaignId: 'wildlife-conservation',
    campaignName: 'Wildlife Conservation',
    amount: 35,
    method: 'Card',
    status: 'refunded',
    transactionId: 'txn_card_1BB8KS',
    minutesAgo: 980,
    reviewedBy: 'Admin Team',
    adminNotes: 'Refund placeholder mirrors provider support once connected.',
  }),
  createMockDonation({
    id: 'don-1042',
    donorId: 'usr-207',
    donorName: 'Priya Shah',
    donorEmail: 'priya@example.com',
    campaignId: 'education-for-all',
    campaignName: 'Education for All',
    amount: 180,
    method: 'Card',
    status: 'successful',
    transactionId: 'txn_card_5MKA91',
    minutesAgo: 1260,
  }),
  createMockDonation({
    id: 'don-1041',
    donorId: 'usr-208',
    donorName: 'Marcus Lee',
    donorEmail: 'marcus@example.com',
    campaignId: 'healthcare-access',
    campaignName: 'Healthcare Access',
    amount: 95,
    method: 'PayPal',
    status: 'pending',
    transactionId: 'txn_paypal_61TQ8R',
    minutesAgo: 1680,
  }),
]

export const adminDonationsAPI = {
  async getDonations(): Promise<AdminDonationListResponse> {
    try {
      const response = await apiClient.get<AdminDonationListResponse>('/api/admin/donations')
      return response.data
    } catch (error) {
      console.warn('Using admin donation fallback data because the API could not be reached.', error)
      return {
        donations: mockDonations,
        summary: summarizeDonations(mockDonations),
      }
    }
  },

  async getDonation(id: string): Promise<AdminDonation> {
    try {
      const response = await apiClient.get<AdminDonation>(`/api/admin/donations/${id}`)
      return response.data
    } catch (error) {
      console.warn('Using admin donation fallback detail because the API could not be reached.', error)
      const donation = mockDonations.find((item) => item.id === id)

      if (!donation) {
        throw new Error('Donation not found.')
      }

      return donation
    }
  },

  async markReviewed(id: string): Promise<AdminDonation> {
    const donation = await this.getDonation(id)
    const reviewedAt = new Date().toISOString()

    return {
      ...donation,
      reviewedAt,
      reviewedBy: donation.reviewedBy ?? 'Admin Team',
      updatedAt: reviewedAt,
      timeline: [
        ...donation.timeline,
        {
          id: `${id}-reviewed`,
          label: 'Admin review',
          description: 'Donation marked reviewed in admin.',
          status: 'reviewed',
          occurredAt: reviewedAt,
        },
      ],
    }
  },
}

export function summarizeDonations(donations: AdminDonation[]): AdminDonationSummary {
  return donations.reduce<AdminDonationSummary>(
    (summary, donation) => {
      if (donation.status === 'successful') {
        summary.totalContributed += donation.amount
        summary.successfulCount += 1
      }

      if (donation.status === 'pending') {
        summary.pendingCount += 1
      }

      if (donation.status === 'failed' || donation.status === 'refunded') {
        summary.failedOrRefundedCount += 1
      }

      summary.visibleTotal += donation.amount
      return summary
    },
    {
      totalContributed: 0,
      successfulCount: 0,
      pendingCount: 0,
      failedOrRefundedCount: 0,
      visibleTotal: 0,
    },
  )
}

function createMockDonation(
  donation: Omit<AdminDonation, 'currency' | 'createdAt' | 'updatedAt' | 'timeline'> & {
    minutesAgo: number
  },
): AdminDonation {
  const createdAt = new Date(now - donation.minutesAgo * 60 * 1000).toISOString()
  const updatedAt = new Date(now - Math.max(4, donation.minutesAgo - 12) * 60 * 1000).toISOString()
  const reviewedAt = donation.reviewedBy ? updatedAt : undefined

  return {
    ...donation,
    currency: 'USD',
    createdAt,
    updatedAt,
    reviewedAt,
    timeline: buildTimeline(donation.id, donation.status, createdAt, updatedAt, reviewedAt),
  }
}

function buildTimeline(
  id: string,
  status: AdminDonationStatus,
  createdAt: string,
  updatedAt: string,
  reviewedAt?: string,
) {
  const timeline: AdminDonationTimelineEvent[] = [
    {
      id: `${id}-created`,
      label: 'Donation created',
      description: 'Contribution record was created from checkout.',
      status: 'pending' as const,
      occurredAt: createdAt,
    },
  ]

  if (status !== 'pending') {
    timeline.push({
      id: `${id}-${status}`,
      label: status === 'successful' ? 'Payment successful' : status === 'failed' ? 'Payment failed' : 'Refund recorded',
      description:
        status === 'successful'
          ? 'Payment provider confirmed the transaction.'
          : status === 'failed'
            ? 'Payment provider returned a failed status.'
            : 'Refund has been logged for review.',
      status,
      occurredAt: updatedAt,
    })
  }

  if (reviewedAt) {
    timeline.push({
      id: `${id}-reviewed`,
      label: 'Admin review',
      description: 'Donation was checked by an admin.',
      status: 'reviewed' as const,
      occurredAt: reviewedAt,
    })
  }

  return timeline
}
