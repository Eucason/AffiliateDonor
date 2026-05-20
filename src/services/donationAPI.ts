import apiClient from '@/lib/apiClient'

export interface CreateDonationRequest {
  cause_id: string
  amount: number
  method: string
  user_id?: string
}

export interface Donation {
  id: string
  user_id: string
  cause_id: string
  amount: number
  currency: string
  method: string
  status: string
  created_at: string
}

export const donationAPI = {
  // Create a new donation
  async createDonation(data: CreateDonationRequest): Promise<Donation> {
    const response = await apiClient.post('/api/donations', data)
    return response.data
  },

  // Get user donations
  async getUserDonations(userId?: string): Promise<Donation[]> {
    const response = await apiClient.get('/api/donations', {
      params: { user_id: userId },
    })
    return response.data.donations
  },

  // Get donation by ID
  async getDonation(id: string): Promise<Donation> {
    const response = await apiClient.get(`/api/donations/${id}`)
    return response.data
  },

  // Track donation event
  async trackDonation(donationId: string, event: string): Promise<void> {
    await apiClient.post('/api/donations/track', {
      donation_id: donationId,
      event,
    })
  },
}
