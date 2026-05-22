import { adminMessagesAPI } from '@/services/admin/adminMessagesAPI'
import type { PublicContactMessageRequest } from '@/types/adminMessage'

export const contactAPI = {
  async submitMessage(request: PublicContactMessageRequest) {
    return adminMessagesAPI.submitContactMessage(request)
  },
}
