import apiClient from '@/lib/apiClient'
import type {
  AdminMessage,
  AdminMessageNote,
  AdminMessageStatus,
  AdminMessageSummary,
  AdminMessagesListResponse,
  PublicContactMessageRequest,
} from '@/types/adminMessage'

const fallbackStorageKey = 'affiliateDonor.adminMessages'
const now = Date.now()

const mockMessages: AdminMessage[] = [
  createMockMessage({
    id: 'msg-308',
    senderName: 'Olivia Grant',
    senderEmail: 'olivia@example.com',
    subject: 'Question about monthly donations',
    body: 'I would like to switch my donation to a monthly cadence and understand whether I can split it across Clean Water and Healthcare Access.',
    status: 'unread',
    severity: 'priority',
    assignedAdmin: 'Support',
    receivedMinutesAgo: 24,
    donorMatch: {
      id: 'usr-205',
      name: 'Olivia Grant',
      email: 'olivia@example.com',
      totalDonations: 900,
      causesSupported: 3,
    },
  }),
  createMockMessage({
    id: 'msg-307',
    senderName: 'Impact Partners Co.',
    senderEmail: 'partners@example.com',
    subject: 'Partnership proposal',
    body: 'Our CSR team would like to sponsor a matching campaign and feature three verified causes during our annual giving week.',
    status: 'pending',
    severity: 'urgent',
    assignedAdmin: 'Partnerships',
    receivedMinutesAgo: 180,
  }),
  createMockMessage({
    id: 'msg-306',
    senderName: 'Liam Brooks',
    senderEmail: 'liam@example.com',
    subject: 'Merch order support',
    body: 'I ordered a shirt and want to confirm whether the contribution still goes to Wildlife Conservation after a refund request.',
    status: 'resolved',
    severity: 'normal',
    assignedAdmin: 'Support',
    receivedMinutesAgo: 540,
    donorMatch: {
      id: 'usr-206',
      name: 'Liam Brooks',
      email: 'liam@example.com',
      totalDonations: 35,
      causesSupported: 1,
    },
  }),
  createMockMessage({
    id: 'msg-305',
    senderName: 'Priya Shah',
    senderEmail: 'priya@example.com',
    subject: 'Receipt request',
    body: 'Could you resend the receipt for my Education for All contribution? I need it for company matching.',
    status: 'replied',
    severity: 'normal',
    assignedAdmin: 'Finance',
    receivedMinutesAgo: 870,
    donorMatch: {
      id: 'usr-207',
      name: 'Priya Shah',
      email: 'priya@example.com',
      totalDonations: 180,
      causesSupported: 1,
    },
  }),
  createMockMessage({
    id: 'msg-304',
    senderName: 'Noah Rivera',
    senderEmail: 'noah@example.com',
    subject: 'Failed payment retry',
    body: 'My card donation failed. Can you confirm whether I should retry or wait for a new checkout link?',
    status: 'unread',
    severity: 'priority',
    assignedAdmin: 'Payments',
    receivedMinutesAgo: 1120,
    donorMatch: {
      id: 'usr-204',
      name: 'Noah Rivera',
      email: 'noah@example.com',
      totalDonations: 0,
      causesSupported: 1,
    },
  }),
  createMockMessage({
    id: 'msg-303',
    senderName: 'Community Volunteer Group',
    senderEmail: 'hello@volunteers.example',
    subject: 'Campaign volunteer support',
    body: 'We can help create updates for Hunger Relief and coordinate local distribution photos if your team needs content support.',
    status: 'read',
    severity: 'normal',
    assignedAdmin: 'Unassigned',
    receivedMinutesAgo: 1860,
  }),
]

export const adminMessagesAPI = {
  async getMessages(): Promise<AdminMessagesListResponse> {
    try {
      const response = await apiClient.get<AdminMessagesListResponse>('/api/admin/messages')
      return response.data
    } catch (error) {
      console.warn('Using admin messages fallback data because the API could not be reached.', error)
      const messages = getFallbackMessages()
      return {
        messages,
        summary: summarizeMessages(messages),
      }
    }
  },

  async getMessage(id: string): Promise<AdminMessage> {
    try {
      const response = await apiClient.get<AdminMessage>(`/api/admin/messages/${id}`)
      return response.data
    } catch (error) {
      console.warn('Using admin message fallback detail because the API could not be reached.', error)
      const message = getFallbackMessages().find((item) => item.id === id)

      if (!message) {
        throw new Error('Message not found.')
      }

      return message
    }
  },

  async updateStatus(id: string, status: AdminMessageStatus): Promise<AdminMessage> {
    const current = await this.getMessage(id)
    const updated: AdminMessage = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
    }

    try {
      const response = await apiClient.patch<AdminMessage>(`/api/admin/messages/${id}/status`, { status })
      saveFallbackMessage(response.data)
      return response.data
    } catch (error) {
      console.warn('Updating message status in fallback admin storage because the API could not be reached.', error)
      saveFallbackMessage(updated)
      return updated
    }
  },

  async assignMessage(id: string, assignedAdmin: string): Promise<AdminMessage> {
    const current = await this.getMessage(id)
    const updated: AdminMessage = {
      ...current,
      assignedAdmin,
      updatedAt: new Date().toISOString(),
    }

    try {
      const response = await apiClient.patch<AdminMessage>(`/api/admin/messages/${id}/assignment`, { assignedAdmin })
      saveFallbackMessage(response.data)
      return response.data
    } catch (error) {
      console.warn('Updating message assignment in fallback admin storage because the API could not be reached.', error)
      saveFallbackMessage(updated)
      return updated
    }
  },

  async addNote(id: string, body: string): Promise<AdminMessage> {
    const current = await this.getMessage(id)
    const note: AdminMessageNote = {
      id: `${id}-note-${Date.now()}`,
      author: 'Admin Team',
      body,
      createdAt: new Date().toISOString(),
    }
    const updated: AdminMessage = {
      ...current,
      notes: [note, ...current.notes],
      updatedAt: note.createdAt,
    }

    try {
      const response = await apiClient.post<AdminMessage>(`/api/admin/messages/${id}/notes`, { body })
      saveFallbackMessage(response.data)
      return response.data
    } catch (error) {
      console.warn('Saving message note in fallback admin storage because the API could not be reached.', error)
      saveFallbackMessage(updated)
      return updated
    }
  },

  async submitContactMessage(request: PublicContactMessageRequest): Promise<AdminMessage> {
    const message = contactRequestToMessage(request)

    try {
      const response = await apiClient.post<AdminMessage>('/api/contact/messages', request)
      saveFallbackMessage(response.data)
      return response.data
    } catch (error) {
      console.warn('Saving contact message in fallback admin storage because the API could not be reached.', error)
      saveFallbackMessage(message)
      return message
    }
  },
}

export function summarizeMessages(messages: AdminMessage[]): AdminMessageSummary {
  return messages.reduce<AdminMessageSummary>(
    (summary, message) => {
      summary.totalCount += 1
      if (message.status === 'unread') {
        summary.unreadCount += 1
      }
      if (message.status === 'pending') {
        summary.pendingCount += 1
      }
      if (message.status === 'replied') {
        summary.repliedCount += 1
      }
      if (message.status === 'resolved') {
        summary.resolvedCount += 1
      }
      return summary
    },
    {
      unreadCount: 0,
      pendingCount: 0,
      repliedCount: 0,
      resolvedCount: 0,
      totalCount: 0,
    },
  )
}

function createMockMessage(
  message: Omit<AdminMessage, 'receivedAt' | 'updatedAt' | 'source' | 'relatedDonations' | 'notes'> & {
    receivedMinutesAgo: number
  },
): AdminMessage {
  const receivedAt = new Date(now - message.receivedMinutesAgo * 60 * 1000).toISOString()
  const updatedAt = new Date(now - Math.max(4, message.receivedMinutesAgo - 30) * 60 * 1000).toISOString()

  return {
    ...message,
    receivedAt,
    updatedAt,
    source: message.senderEmail.includes('partners') ? 'partner_form' : 'contact_form',
    relatedDonations: message.donorMatch
      ? [
          {
            id: `don-${message.donorMatch.id}-1`,
            campaignName: message.subject.includes('Education') ? 'Education for All' : 'Clean Water Initiative',
            amount: message.donorMatch.totalDonations || 50,
            currency: 'USD',
            status: message.donorMatch.totalDonations > 0 ? 'successful' : 'failed',
            createdAt: new Date(now - (message.receivedMinutesAgo + 240) * 60 * 1000).toISOString(),
          },
        ]
      : [],
    notes: [
      {
        id: `${message.id}-note-1`,
        author: 'Admin Team',
        body: message.status === 'resolved' ? 'Issue has been closed after support follow-up.' : 'Ready for triage.',
        createdAt: updatedAt,
      },
    ],
  }
}

function contactRequestToMessage(request: PublicContactMessageRequest): AdminMessage {
  const timestamp = new Date().toISOString()
  return {
    id: `msg-${Date.now()}`,
    senderName: request.name,
    senderEmail: request.email,
    subject: request.subject,
    body: request.message,
    status: 'unread',
    severity: 'normal',
    assignedAdmin: 'Unassigned',
    receivedAt: timestamp,
    updatedAt: timestamp,
    source: 'contact_form',
    relatedDonations: [],
    notes: [],
  }
}

function getFallbackMessages() {
  return mergeMessages(mockMessages, readStoredMessages())
}

function saveFallbackMessage(message: AdminMessage) {
  if (typeof window === 'undefined') {
    return
  }

  const stored = readStoredMessages()
  window.localStorage.setItem(fallbackStorageKey, JSON.stringify(mergeMessages(stored, [message])))
}

function readStoredMessages(): AdminMessage[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(fallbackStorageKey)
    return value ? (JSON.parse(value) as AdminMessage[]) : []
  } catch (error) {
    console.warn('Stored admin messages could not be parsed.', error)
    return []
  }
}

function mergeMessages(base: AdminMessage[], overrides: AdminMessage[]) {
  const messagesById = new Map<string, AdminMessage>()
  base.forEach((message) => messagesById.set(message.id, message))
  overrides.forEach((message) => messagesById.set(message.id, message))
  return Array.from(messagesById.values())
}
