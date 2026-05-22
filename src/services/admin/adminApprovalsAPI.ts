import apiClient from '@/lib/apiClient'
import type {
  AdminApprovalComment,
  AdminApprovalPriority,
  AdminApprovalRequest,
  AdminApprovalStatus,
  AdminApprovalSummary,
  AdminApprovalType,
  AdminApprovalsResponse,
} from '@/types/adminApproval'

const fallbackStorageKey = 'affiliateDonor.adminApprovals'

const mockApprovals: AdminApprovalRequest[] = [
  approval(
    'apv-801',
    'campaign',
    'pending',
    'urgent',
    'Hunger Relief campaign refresh',
    'Goal, media, and distribution partner copy are ready for final review.',
    'Daniel Cooper',
    'cause-004',
    'Hunger Relief',
    '/admin/causes/4',
    'Publishes updated campaign content and moves the campaign back into featured rotation.',
    3,
  ),
  approval(
    'apv-802',
    'content',
    'pending',
    'high',
    'Spring Giving Week banner',
    'Homepage banner is scheduled and needs approval before the launch window.',
    'Grace Miller',
    'content-banner-giving-week',
    'Spring Giving Week',
    '/admin/content/banners',
    'Shows the banner to public visitors during the giving week campaign.',
    10,
  ),
  approval(
    'apv-803',
    'product',
    'pending',
    'normal',
    'Impact Hoodie inventory update',
    'New hoodie variants and low-stock thresholds were added for merch sales.',
    'Olivia Grant',
    'merch-2',
    'Impact Hoodie',
    '/admin/products/merch',
    'Updates public merch availability and inventory warnings.',
    21,
  ),
  approval(
    'apv-804',
    'product',
    'rejected',
    'normal',
    'Solar Power Bank affiliate listing',
    'Affiliate disclosure copy was incomplete for the product detail page.',
    'Liam Brooks',
    'p2',
    'Solar Power Bank',
    '/admin/products/p2/edit',
    'Would publish a new affiliate product to the shop experience.',
    72,
    'Olivia Grant',
  ),
  approval(
    'apv-805',
    'refund',
    'approved',
    'high',
    'Donation refund review',
    'Card processor refund was approved after donor support confirmation.',
    'Noah Rivera',
    'don-1043',
    'Donation don-1043',
    '/admin/donations/don-1043',
    'Records a refunded donation and updates reporting totals.',
    96,
    'Olivia Grant',
  ),
]

export const adminApprovalsAPI = {
  async getApprovals(): Promise<AdminApprovalsResponse> {
    try {
      const response = await apiClient.get<AdminApprovalsResponse>('/api/admin/approvals', { timeout: 2500 })
      const approvals = response.data.approvals ?? []
      return {
        approvals,
        summary: response.data.summary ?? summarizeApprovals(approvals),
      }
    } catch (error) {
      console.warn('Using admin approvals fallback data because the API could not be reached.', error)
      const approvals = getFallbackApprovals()
      return {
        approvals,
        summary: summarizeApprovals(approvals),
      }
    }
  },

  async reviewApproval(id: string, status: Extract<AdminApprovalStatus, 'approved' | 'rejected'>, comment: string) {
    const approvals = getFallbackApprovals()
    const current = approvals.find((item) => item.id === id)

    if (!current) {
      throw new Error('Approval request not found.')
    }

    const updated = applyApprovalReview(current, status, comment)

    try {
      const response = await apiClient.patch<AdminApprovalRequest>(`/api/admin/approvals/${id}`, { status, comment })
      saveFallbackApproval(response.data)
      return response.data
    } catch (error) {
      console.warn('Reviewing approval in fallback storage because the API could not be reached.', error)
      saveFallbackApproval(updated)
      return updated
    }
  },
}

export function summarizeApprovals(approvals: AdminApprovalRequest[]): AdminApprovalSummary {
  return approvals.reduce<AdminApprovalSummary>(
    (summary, approvalItem) => {
      summary.totalCount += 1
      summary.pendingCount += approvalItem.status === 'pending' ? 1 : 0
      summary.approvedCount += approvalItem.status === 'approved' ? 1 : 0
      summary.rejectedCount += approvalItem.status === 'rejected' ? 1 : 0
      summary.urgentCount += approvalItem.priority === 'urgent' ? 1 : 0
      return summary
    },
    {
      totalCount: 0,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      urgentCount: 0,
    },
  )
}

function applyApprovalReview(
  approvalItem: AdminApprovalRequest,
  status: Extract<AdminApprovalStatus, 'approved' | 'rejected'>,
  comment: string,
): AdminApprovalRequest {
  const reviewedAt = new Date().toISOString()
  const reviewComment: AdminApprovalComment = {
    id: `${approvalItem.id}-${status}-${Date.now()}`,
    author: 'Admin Team',
    body: comment || (status === 'approved' ? 'Approved.' : 'Rejected.'),
    createdAt: reviewedAt,
  }

  return {
    ...approvalItem,
    status,
    reviewer: 'Admin Team',
    reviewedAt,
    comments: [reviewComment, ...approvalItem.comments],
  }
}

function approval(
  id: string,
  type: AdminApprovalType,
  status: AdminApprovalStatus,
  priority: AdminApprovalPriority,
  title: string,
  summary: string,
  requestedBy: string,
  relatedEntityId: string,
  relatedEntityLabel: string,
  relatedEntityPath: string,
  impact: string,
  hoursAgo: number,
  reviewer?: string,
): AdminApprovalRequest {
  const submittedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
  const reviewedAt = status === 'pending' ? undefined : new Date(Date.now() - Math.max(1, hoursAgo - 4) * 60 * 60 * 1000).toISOString()

  return {
    id,
    type,
    status,
    priority,
    title,
    summary,
    requestedBy,
    submittedAt,
    relatedEntityId,
    relatedEntityLabel,
    relatedEntityPath,
    impact,
    reviewer,
    reviewedAt,
    comments: [
      {
        id: `${id}-comment-1`,
        author: requestedBy,
        body: summary,
        createdAt: submittedAt,
      },
    ],
  }
}

function getFallbackApprovals() {
  return mergeApprovals(mockApprovals, readStoredApprovals())
}

function saveFallbackApproval(approvalItem: AdminApprovalRequest) {
  const approvals = getFallbackApprovals().map((item) => (item.id === approvalItem.id ? approvalItem : item))
  writeStoredApprovals(approvals)
}

function readStoredApprovals(): AdminApprovalRequest[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(fallbackStorageKey)
    return value ? (JSON.parse(value) as AdminApprovalRequest[]) : []
  } catch (error) {
    console.warn('Stored admin approvals could not be parsed.', error)
    return []
  }
}

function writeStoredApprovals(approvals: AdminApprovalRequest[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(fallbackStorageKey, JSON.stringify(approvals))
}

function mergeApprovals(base: AdminApprovalRequest[], overrides: AdminApprovalRequest[]) {
  const byId = new Map<string, AdminApprovalRequest>()
  base.forEach((item) => byId.set(item.id, item))
  overrides.forEach((item) => byId.set(item.id, item))
  return Array.from(byId.values())
}
