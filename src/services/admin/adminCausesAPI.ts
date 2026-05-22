import apiClient from '@/lib/apiClient'
import type {
  AdminCause,
  AdminCauseFormData,
  AdminCauseListResponse,
  AdminCauseStatus,
  AdminCauseSummary,
} from '@/types/adminCause'

const now = Date.now()
const fallbackStorageKey = 'affiliateDonor.adminCauses'

const mockCauses: AdminCause[] = [
  createMockCause({
    id: '1',
    name: 'Clean Water Initiative',
    slug: 'clean-water',
    category: 'Environment',
    description: 'Providing safe, reliable drinking water systems for communities with limited access.',
    goal: 200000,
    raised: 125000,
    supporters: 1234,
    location: 'Global',
    startDate: '2026-01-15',
    endDate: '2026-12-31',
    mainImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1541976590-713941681591?w=800',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    ],
    featured: true,
    verified: true,
    status: 'active',
    impactMetric: '50,000+ people served with clean water access',
    updatedHoursAgo: 4,
  }),
  createMockCause({
    id: '2',
    name: 'Education for All',
    slug: 'education-for-all',
    category: 'Education',
    description: 'Funding school materials, teacher support, and digital learning tools for underserved students.',
    goal: 150000,
    raised: 85000,
    supporters: 892,
    location: 'East Africa',
    startDate: '2026-02-01',
    endDate: '2026-11-30',
    mainImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
    galleryImages: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800'],
    featured: true,
    verified: true,
    status: 'active',
    impactMetric: '12,000 students receiving classroom support',
    updatedHoursAgo: 18,
  }),
  createMockCause({
    id: '3',
    name: 'Wildlife Conservation',
    slug: 'wildlife-conservation',
    category: 'Environment',
    description: 'Protecting endangered habitats through conservation patrols and local stewardship programs.',
    goal: 120000,
    raised: 95000,
    supporters: 1567,
    location: 'Kenya',
    startDate: '2026-01-08',
    mainImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1200',
    galleryImages: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800'],
    featured: false,
    verified: true,
    status: 'active',
    impactMetric: '18 protected habitat zones monitored weekly',
    updatedHoursAgo: 30,
  }),
  createMockCause({
    id: '4',
    name: 'Hunger Relief',
    slug: 'hunger-relief',
    category: 'Humanitarian',
    description: 'Coordinating emergency food distribution and long-term nutrition programs.',
    goal: 250000,
    raised: 165000,
    supporters: 2341,
    location: 'Global',
    startDate: '2026-03-05',
    mainImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200',
    galleryImages: [],
    featured: false,
    verified: true,
    status: 'pending',
    impactMetric: '1.8M meals scheduled through partner networks',
    updatedHoursAgo: 52,
  }),
  createMockCause({
    id: '5',
    name: 'Healthcare Access',
    slug: 'healthcare-access',
    category: 'Health',
    description: 'Mobile clinic funding for preventative care and maternal health outreach.',
    goal: 200000,
    raised: 142000,
    supporters: 1876,
    location: 'Rural clinics',
    startDate: '2026-02-20',
    mainImage: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200',
    galleryImages: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800'],
    featured: true,
    verified: false,
    status: 'draft',
    impactMetric: '32 clinic days ready for launch',
    updatedHoursAgo: 74,
  }),
  createMockCause({
    id: '6',
    name: 'Climate Action',
    slug: 'climate-action',
    category: 'Environment',
    description: 'Community-led tree planting, clean energy workshops, and climate resilience training.',
    goal: 100000,
    raised: 78000,
    supporters: 945,
    location: 'Pacific communities',
    startDate: '2025-10-01',
    endDate: '2026-04-15',
    mainImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200',
    galleryImages: [],
    featured: false,
    verified: true,
    status: 'archived',
    impactMetric: '80,000 trees planted with local partners',
    updatedHoursAgo: 168,
  }),
]

export const adminCausesAPI = {
  async getCauses(): Promise<AdminCauseListResponse> {
    try {
      const response = await apiClient.get<AdminCauseListResponse>('/api/admin/causes')
      return response.data
    } catch (error) {
      console.warn('Using admin causes fallback data because the API could not be reached.', error)
      const causes = getFallbackCauses()
      return {
        causes,
        summary: summarizeCauses(causes),
      }
    }
  },

  async getCause(idOrSlug: string): Promise<AdminCause> {
    try {
      const response = await apiClient.get<AdminCause>(`/api/admin/causes/${idOrSlug}`)
      return response.data
    } catch (error) {
      console.warn('Using admin cause fallback detail because the API could not be reached.', error)
      const cause = getFallbackCauses().find((item) => item.id === idOrSlug || item.slug === idOrSlug)

      if (!cause) {
        throw new Error('Campaign not found.')
      }

      return cause
    }
  },

  async createCause(formData: AdminCauseFormData): Promise<AdminCause> {
    const createdAt = new Date().toISOString()
    const cause = formDataToCause(formData, {
      id: `cause-${Date.now()}`,
      raised: 0,
      supporters: 0,
      createdAt,
      updatedAt: createdAt,
    })

    try {
      const response = await apiClient.post<AdminCause>('/api/admin/causes', cause)
      saveFallbackCause(response.data)
      return response.data
    } catch (error) {
      console.warn('Saving campaign in fallback admin storage because the API could not be reached.', error)
      saveFallbackCause(cause)
      return cause
    }
  },

  async updateCause(id: string, formData: AdminCauseFormData): Promise<AdminCause> {
    const current = await this.getCause(id)
    const cause = formDataToCause(formData, {
      id: current.id,
      raised: current.raised,
      supporters: current.supporters,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
      linkedDonations: current.linkedDonations,
      activity: current.activity,
    })

    try {
      const response = await apiClient.put<AdminCause>(`/api/admin/causes/${id}`, cause)
      saveFallbackCause(response.data)
      return response.data
    } catch (error) {
      console.warn('Updating campaign in fallback admin storage because the API could not be reached.', error)
      saveFallbackCause(cause)
      return cause
    }
  },

  async updateStatus(id: string, status: AdminCauseStatus): Promise<AdminCause> {
    const cause = await this.getCause(id)
    const updated = {
      ...cause,
      status,
      updatedAt: new Date().toISOString(),
    }

    try {
      const response = await apiClient.patch<AdminCause>(`/api/admin/causes/${id}/status`, { status })
      saveFallbackCause(response.data)
      return response.data
    } catch (error) {
      console.warn('Updating campaign status in fallback admin storage because the API could not be reached.', error)
      saveFallbackCause(updated)
      return updated
    }
  },
}

export function summarizeCauses(causes: AdminCause[]): AdminCauseSummary {
  return causes.reduce<AdminCauseSummary>(
    (summary, cause) => {
      if (cause.status === 'active') {
        summary.activeCount += 1
      }

      if (cause.status === 'draft') {
        summary.draftCount += 1
      }

      if (cause.status === 'archived') {
        summary.archivedCount += 1
      }

      summary.totalRaised += cause.raised
      summary.totalGoal += cause.goal
      return summary
    },
    {
      activeCount: 0,
      draftCount: 0,
      archivedCount: 0,
      totalRaised: 0,
      totalGoal: 0,
    },
  )
}

export function causeToFormData(cause: AdminCause): AdminCauseFormData {
  return {
    name: cause.name,
    slug: cause.slug,
    category: cause.category,
    description: cause.description,
    goal: String(cause.goal),
    location: cause.location,
    startDate: cause.startDate,
    endDate: cause.endDate ?? '',
    mainImage: cause.mainImage,
    galleryImages: cause.galleryImages.join('\n'),
    featured: cause.featured,
    verified: cause.verified,
    status: cause.status,
    impactMetric: cause.impactMetric,
    seoTitle: cause.seoTitle ?? '',
    seoDescription: cause.seoDescription ?? '',
  }
}

export const emptyCauseFormData: AdminCauseFormData = {
  name: '',
  slug: '',
  category: 'Environment',
  description: '',
  goal: '',
  location: '',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  mainImage: '',
  galleryImages: '',
  featured: false,
  verified: false,
  status: 'draft',
  impactMetric: '',
  seoTitle: '',
  seoDescription: '',
}

function createMockCause(
  cause: Omit<AdminCause, 'currency' | 'createdAt' | 'updatedAt' | 'linkedDonations' | 'activity' | 'seoTitle' | 'seoDescription'> & {
    updatedHoursAgo: number
  },
): AdminCause {
  const updatedAt = new Date(now - cause.updatedHoursAgo * 60 * 60 * 1000).toISOString()
  const createdAt = new Date(new Date(cause.startDate).getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()

  return {
    ...cause,
    currency: 'USD',
    createdAt,
    updatedAt,
    seoTitle: `${cause.name} | AffiliateDonor`,
    seoDescription: cause.description,
    linkedDonations: buildLinkedDonations(cause.slug, 'USD'),
    activity: [
      {
        id: `${cause.id}-created`,
        label: 'Campaign created',
        description: `${cause.name} was added to the admin campaign queue.`,
        actor: 'Admin Team',
        occurredAt: createdAt,
      },
      {
        id: `${cause.id}-updated`,
        label: 'Campaign updated',
        description: 'Funding details, media, or publishing state were reviewed.',
        actor: 'Program Lead',
        occurredAt: updatedAt,
      },
    ],
  }
}

function buildLinkedDonations(campaignSlug: string, currency: string) {
  const base = [
    {
      donorName: 'Maya Thompson',
      donorEmail: 'maya@example.com',
      amount: 250,
      status: 'successful' as const,
    },
    {
      donorName: 'Aisha Khan',
      donorEmail: 'aisha@example.com',
      amount: 120,
      status: 'pending' as const,
    },
    {
      donorName: 'Daniel Cooper',
      donorEmail: 'daniel@example.com',
      amount: 75,
      status: 'successful' as const,
    },
  ]

  return base.map((donation, index) => ({
    id: `don-${campaignSlug}-${index + 1}`,
    ...donation,
    currency,
    createdAt: new Date(now - (index + 1) * 26 * 60 * 60 * 1000).toISOString(),
  }))
}

function formDataToCause(
  formData: AdminCauseFormData,
  existing: Pick<AdminCause, 'id' | 'raised' | 'supporters' | 'createdAt' | 'updatedAt'> &
    Partial<Pick<AdminCause, 'linkedDonations' | 'activity'>>,
): AdminCause {
  const galleryImages = formData.galleryImages
    .split('\n')
    .map((image) => image.trim())
    .filter(Boolean)

  return {
    id: existing.id,
    name: formData.name.trim(),
    slug: formData.slug.trim(),
    category: formData.category.trim(),
    description: formData.description.trim(),
    goal: Number(formData.goal) || 0,
    raised: existing.raised,
    currency: 'USD',
    supporters: existing.supporters,
    location: formData.location.trim(),
    startDate: formData.startDate,
    endDate: formData.endDate || undefined,
    mainImage: formData.mainImage.trim(),
    galleryImages,
    featured: formData.featured,
    verified: formData.verified,
    status: formData.status,
    impactMetric: formData.impactMetric.trim(),
    seoTitle: formData.seoTitle.trim() || undefined,
    seoDescription: formData.seoDescription.trim() || undefined,
    createdAt: existing.createdAt,
    updatedAt: existing.updatedAt,
    linkedDonations: existing.linkedDonations ?? [],
    activity: existing.activity ?? [
      {
        id: `${existing.id}-created`,
        label: 'Campaign created',
        description: 'Campaign was created from the admin form.',
        actor: 'Admin Team',
        occurredAt: existing.createdAt,
      },
    ],
  }
}

function getFallbackCauses() {
  return mergeCauses(mockCauses, readStoredCauses())
}

function saveFallbackCause(cause: AdminCause) {
  if (typeof window === 'undefined') {
    return
  }

  const stored = readStoredCauses()
  const next = mergeCauses(stored, [cause])
  window.localStorage.setItem(fallbackStorageKey, JSON.stringify(next))
}

function readStoredCauses(): AdminCause[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(fallbackStorageKey)
    return value ? (JSON.parse(value) as AdminCause[]) : []
  } catch (error) {
    console.warn('Stored admin causes could not be parsed.', error)
    return []
  }
}

function mergeCauses(base: AdminCause[], overrides: AdminCause[]) {
  const causesById = new Map<string, AdminCause>()
  base.forEach((cause) => causesById.set(cause.id, cause))
  overrides.forEach((cause) => causesById.set(cause.id, cause))
  return Array.from(causesById.values())
}
