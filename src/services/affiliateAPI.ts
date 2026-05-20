import apiClient from '@/lib/apiClient'

export interface TrackClickRequest {
  user_id?: string
  product_id: string
}

export interface TrackConversionRequest {
  click_id: string
  order_value: number
  commission: number
}

export const affiliateAPI = {
  // Track affiliate link click
  async trackClick(data: TrackClickRequest): Promise<{ click_id: string; tracked: boolean }> {
    const response = await apiClient.post('/api/affiliates/click', data)
    return response.data
  },

  // Track conversion
  async trackConversion(data: TrackConversionRequest): Promise<{
    converted: boolean
    donation_amount: number
    commission: number
  }> {
    const response = await apiClient.post('/api/affiliates/conversion', data)
    return response.data
  },

  // Get affiliate stats
  async getStats(userId?: string): Promise<any> {
    const response = await apiClient.get('/api/affiliates/stats', {
      params: { user_id: userId },
    })
    return response.data
  },
}
