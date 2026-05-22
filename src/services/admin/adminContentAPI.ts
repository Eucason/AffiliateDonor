import apiClient from '@/lib/apiClient'
import type {
  AdminContentArea,
  AdminContentAreaConfig,
  AdminContentBlock,
  AdminContentListResponse,
  AdminContentStatus,
  AdminContentSummary,
  AdminContentType,
} from '@/types/adminContent'

const fallbackStorageKey = 'affiliateDonor.adminContentBlocks'
const now = Date.now()

export const contentAreaConfigs: AdminContentAreaConfig[] = [
  {
    area: 'homepage',
    title: 'Homepage',
    description: 'Hero copy, featured sections, and homepage calls to action.',
    path: '/admin/content/homepage',
    allowedTypes: ['homepage_hero', 'featured_section'],
  },
  {
    area: 'banners',
    title: 'Banners',
    description: 'Site banners, announcements, and scheduled campaign notices.',
    path: '/admin/content/banners',
    allowedTypes: ['announcement', 'banner'],
  },
  {
    area: 'impact-stories',
    title: 'Impact Stories',
    description: 'Narrative proof points tied to campaigns and donation outcomes.',
    path: '/admin/content/impact-stories',
    allowedTypes: ['impact_story'],
  },
  {
    area: 'testimonials',
    title: 'Testimonials',
    description: 'Quotes from donors, partners, volunteers, and campaign teams.',
    path: '/admin/content/testimonials',
    allowedTypes: ['testimonial'],
  },
  {
    area: 'about',
    title: 'About',
    description: 'Mission, values, team, and partner copy for about pages.',
    path: '/admin/content/about',
    allowedTypes: ['about_section'],
  },
  {
    area: 'footer',
    title: 'Footer',
    description: 'Contact information, link groups, legal links, and social copy.',
    path: '/admin/content/footer',
    allowedTypes: ['footer_group'],
  },
]

export const contentTypeLabels: Record<AdminContentType, string> = {
  homepage_hero: 'Homepage Hero',
  announcement: 'Announcement',
  banner: 'Banner',
  impact_story: 'Impact Story',
  testimonial: 'Testimonial',
  about_section: 'About Section',
  footer_group: 'Footer Group',
  featured_section: 'Featured Section',
}

const mockBlocks: AdminContentBlock[] = [
  createMockBlock({
    id: 'content-home-hero',
    area: 'homepage',
    type: 'homepage_hero',
    title: 'Homepage Hero',
    slug: 'homepage-hero',
    status: 'published',
    summary: 'Primary message for the homepage hero.',
    body: 'Turn everyday purchases into direct support for verified causes.',
    mediaUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400',
    ctaLabel: 'Explore Causes',
    ctaTarget: '/causes',
    linkedEntityId: 'clean-water',
    linkedEntityLabel: 'Clean Water Initiative',
    metadata: {
      eyebrow: 'Shop with purpose',
      secondaryCtaLabel: 'How it works',
      secondaryCtaTarget: '/how-it-works',
    },
    sortOrder: 1,
    updatedHoursAgo: 6,
  }),
  createMockBlock({
    id: 'content-home-featured',
    area: 'homepage',
    type: 'featured_section',
    title: 'Featured Causes Strip',
    slug: 'featured-causes-strip',
    status: 'draft',
    summary: 'Homepage section highlighting campaigns, products, and stories.',
    body: 'Promote timely campaigns and new impact stories in a single scannable section.',
    linkedEntityId: 'featured-campaigns',
    linkedEntityLabel: 'Campaign rotation',
    metadata: {
      featuredItems: ['Clean Water Initiative', 'Education for All', 'Healthcare Access'],
      layout: 'three-column',
    },
    sortOrder: 2,
    updatedHoursAgo: 24,
  }),
  createMockBlock({
    id: 'content-banner-giving-week',
    area: 'banners',
    type: 'announcement',
    title: 'Spring Giving Week',
    slug: 'spring-giving-week',
    status: 'scheduled',
    summary: 'Scheduled banner for matching campaign week.',
    body: 'All donations are matched this week for selected campaigns.',
    ctaLabel: 'Donate Now',
    ctaTarget: '/causes',
    linkLabel: 'View matched campaigns',
    linkTarget: '/causes?featured=true',
    startAt: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(now + 9 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledAt: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      severity: 'info',
      placement: 'top-bar',
    },
    sortOrder: 1,
    updatedHoursAgo: 10,
  }),
  createMockBlock({
    id: 'content-banner-partner',
    area: 'banners',
    type: 'banner',
    title: 'Partner Spotlight Banner',
    slug: 'partner-spotlight-banner',
    status: 'published',
    summary: 'Banner promoting verified partner transparency.',
    body: 'See how each partner is vetted before a campaign goes live.',
    mediaUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    ctaLabel: 'Learn More',
    ctaTarget: '/partners',
    metadata: {
      placement: 'homepage-midpage',
      colorTheme: 'blue',
    },
    sortOrder: 2,
    updatedHoursAgo: 31,
  }),
  createMockBlock({
    id: 'content-impact-water',
    area: 'impact-stories',
    type: 'impact_story',
    title: 'Clean Water Access in Kisumu',
    slug: 'clean-water-access-kisumu',
    status: 'published',
    summary: 'Impact story showing a completed clean water milestone.',
    body: 'Local partners installed filtration stations that now support families, schools, and clinics with safer water access.',
    mediaUrl: 'https://images.unsplash.com/photo-1541976590-713941681591?w=1200',
    linkedEntityId: 'clean-water',
    linkedEntityLabel: 'Clean Water Initiative',
    metadata: {
      impactMetric: '5,000 families reached',
      location: 'Kisumu, Kenya',
    },
    sortOrder: 1,
    updatedHoursAgo: 18,
  }),
  createMockBlock({
    id: 'content-testimonial-donor',
    area: 'testimonials',
    type: 'testimonial',
    title: 'Maya Thompson',
    slug: 'maya-thompson',
    status: 'published',
    summary: 'Donor quote for homepage and impact pages.',
    body: 'I can see where my giving goes, and the purchase-linked donations make it easy to keep supporting causes every month.',
    mediaUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
    metadata: {
      role: 'Monthly donor',
      organization: 'AffiliateDonor community',
    },
    sortOrder: 1,
    updatedHoursAgo: 48,
  }),
  createMockBlock({
    id: 'content-about-mission',
    area: 'about',
    type: 'about_section',
    title: 'Mission Statement',
    slug: 'mission-statement',
    status: 'published',
    summary: 'Core mission copy for about and mission pages.',
    body: 'AffiliateDonor helps people turn everyday commerce into transparent support for trusted campaigns.',
    metadata: {
      sectionLabel: 'Mission',
      displayStyle: 'text-with-metric',
      metric: '$642K contributed',
    },
    sortOrder: 1,
    updatedHoursAgo: 72,
  }),
  createMockBlock({
    id: 'content-footer-contact',
    area: 'footer',
    type: 'footer_group',
    title: 'Footer Contact',
    slug: 'footer-contact',
    status: 'draft',
    summary: 'Primary footer contact and social link group.',
    body: 'Questions about donations, partners, or campaigns? Reach out to the support team.',
    linkLabel: 'Contact us',
    linkTarget: '/contact',
    metadata: {
      email: 'support@affiliatedonor.example',
      phone: '+1 555 0148',
      address: 'Remote-first impact team',
      linkGroup: ['About', 'Partners', 'Terms', 'Contact'],
      socialLinks: ['Facebook', 'Instagram', 'LinkedIn'],
    },
    sortOrder: 1,
    updatedHoursAgo: 15,
  }),
]

export const adminContentAPI = {
  async getContentBlocks(area?: AdminContentArea): Promise<AdminContentListResponse> {
    try {
      const response = await apiClient.get<AdminContentListResponse>('/api/admin/content', {
        params: { area },
      })
      return response.data
    } catch (error) {
      console.warn('Using admin content fallback data because the API could not be reached.', error)
      const blocks = filterByArea(getFallbackBlocks(), area)
      return {
        blocks,
        summary: summarizeContent(blocks),
      }
    }
  },

  async getContentBlock(id: string): Promise<AdminContentBlock> {
    try {
      const response = await apiClient.get<AdminContentBlock>(`/api/admin/content/${id}`)
      return response.data
    } catch (error) {
      console.warn('Using admin content fallback detail because the API could not be reached.', error)
      const block = getFallbackBlocks().find((item) => item.id === id)

      if (!block) {
        throw new Error('Content block not found.')
      }

      return block
    }
  },

  async updateContentBlock(id: string, block: AdminContentBlock): Promise<AdminContentBlock> {
    const updated = finalizeBlockDates({
      ...block,
      id,
      updatedAt: new Date().toISOString(),
      updatedBy: block.updatedBy || 'Admin Team',
    })

    try {
      const response = await apiClient.put<AdminContentBlock>(`/api/admin/content/${id}`, updated)
      saveFallbackBlock(response.data)
      return response.data
    } catch (error) {
      console.warn('Saving content block in fallback admin storage because the API could not be reached.', error)
      saveFallbackBlock(updated)
      return updated
    }
  },

  async updateContentStatus(id: string, status: AdminContentStatus): Promise<AdminContentBlock> {
    const block = await this.getContentBlock(id)
    const updated = finalizeBlockDates({
      ...block,
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin Team',
    })

    try {
      const response = await apiClient.patch<AdminContentBlock>(`/api/admin/content/${id}/status`, { status })
      saveFallbackBlock(response.data)
      return response.data
    } catch (error) {
      console.warn('Updating content status in fallback admin storage because the API could not be reached.', error)
      saveFallbackBlock(updated)
      return updated
    }
  },
}

export function summarizeContent(blocks: AdminContentBlock[]): AdminContentSummary {
  return blocks.reduce<AdminContentSummary>(
    (summary, block) => {
      summary.totalCount += 1
      summary.publishedCount += block.status === 'published' ? 1 : 0
      summary.draftCount += block.status === 'draft' ? 1 : 0
      summary.scheduledCount += block.status === 'scheduled' ? 1 : 0
      summary.archivedCount += block.status === 'archived' ? 1 : 0
      summary.missingMediaCount += needsMedia(block.type) && !block.mediaUrl ? 1 : 0
      return summary
    },
    {
      totalCount: 0,
      publishedCount: 0,
      draftCount: 0,
      scheduledCount: 0,
      archivedCount: 0,
      missingMediaCount: 0,
    },
  )
}

export function getContentAreaConfig(area: AdminContentArea) {
  return contentAreaConfigs.find((config) => config.area === area) ?? contentAreaConfigs[0]
}

function createMockBlock(
  block: Omit<AdminContentBlock, 'createdAt' | 'updatedAt' | 'updatedBy' | 'publishedAt' | 'archivedAt'> & {
    updatedHoursAgo: number
  },
): AdminContentBlock {
  const updatedAt = new Date(now - block.updatedHoursAgo * 60 * 60 * 1000).toISOString()

  return finalizeBlockDates({
    ...block,
    createdAt: new Date(now - (block.updatedHoursAgo + 96) * 60 * 60 * 1000).toISOString(),
    updatedAt,
    updatedBy: block.type === 'footer_group' ? 'Operations' : 'Content Lead',
  })
}

function finalizeBlockDates(block: AdminContentBlock): AdminContentBlock {
  const timestamp = block.updatedAt || new Date().toISOString()
  return {
    ...block,
    publishedAt: block.status === 'published' ? block.publishedAt ?? timestamp : undefined,
    archivedAt: block.status === 'archived' ? block.archivedAt ?? timestamp : undefined,
    scheduledAt: block.status === 'scheduled' ? block.scheduledAt ?? timestamp : block.scheduledAt,
  }
}

function filterByArea(blocks: AdminContentBlock[], area?: AdminContentArea) {
  const filtered = area ? blocks.filter((block) => block.area === area) : blocks
  return [...filtered].sort((first, second) => {
    if (first.area === second.area) {
      return first.sortOrder - second.sortOrder
    }
    return first.area.localeCompare(second.area)
  })
}

function needsMedia(type: AdminContentType) {
  return type === 'homepage_hero' || type === 'banner' || type === 'impact_story' || type === 'testimonial'
}

function getFallbackBlocks() {
  return mergeBlocks(mockBlocks, readStoredBlocks())
}

function saveFallbackBlock(block: AdminContentBlock) {
  if (typeof window === 'undefined') {
    return
  }

  const stored = readStoredBlocks()
  window.localStorage.setItem(fallbackStorageKey, JSON.stringify(mergeBlocks(stored, [block])))
}

function readStoredBlocks(): AdminContentBlock[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(fallbackStorageKey)
    return value ? (JSON.parse(value) as AdminContentBlock[]) : []
  } catch (error) {
    console.warn('Stored admin content blocks could not be parsed.', error)
    return []
  }
}

function mergeBlocks(base: AdminContentBlock[], overrides: AdminContentBlock[]) {
  const blocksById = new Map<string, AdminContentBlock>()
  base.forEach((block) => blocksById.set(block.id, block))
  overrides.forEach((block) => blocksById.set(block.id, block))
  return Array.from(blocksById.values())
}
