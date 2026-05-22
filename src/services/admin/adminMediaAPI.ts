import apiClient from '@/lib/apiClient'
import type {
  AdminMediaAsset,
  AdminMediaListResponse,
  AdminMediaSummary,
  AdminMediaUploadRequest,
} from '@/types/adminMedia'

const fallbackStorageKey = 'affiliateDonor.adminMediaAssets'
const fallbackDeletedKey = 'affiliateDonor.adminMediaDeletedAssets'
const now = Date.now()

const mockAssets: AdminMediaAsset[] = [
  createMockAsset({
    id: 'media-clean-water-hero',
    title: 'Clean Water Campaign Hero',
    fileName: 'clean-water-hero.jpg',
    url: 'https://images.unsplash.com/photo-1541976590-713941681591?w=1400',
    mimeType: 'image/jpeg',
    type: 'image',
    sizeBytes: 845000,
    width: 1400,
    height: 934,
    altText: 'Community members gathering near a clean water project.',
    caption: 'Clean Water Initiative field update image.',
    tags: ['clean-water', 'campaign', 'hero'],
    uploadedBy: 'Content Lead',
    uploadedHoursAgo: 8,
    usage: [
      {
        id: 'usage-clean-water-cause',
        area: 'causes',
        entityType: 'campaign',
        entityId: 'clean-water',
        label: 'Clean Water Initiative',
        path: '/admin/causes/clean-water',
      },
      {
        id: 'usage-impact-story',
        area: 'content',
        entityType: 'impact_story',
        entityId: 'content-impact-water',
        label: 'Clean Water Access in Kisumu',
        path: '/admin/content/impact-stories',
      },
    ],
  }),
  createMockAsset({
    id: 'media-home-hero',
    title: 'Homepage Giving Hero',
    fileName: 'homepage-giving-hero.jpg',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400',
    mimeType: 'image/jpeg',
    type: 'image',
    sizeBytes: 1024000,
    width: 1400,
    height: 933,
    altText: 'Volunteers carrying donation boxes during an impact campaign.',
    caption: 'Hero image for public homepage messaging.',
    tags: ['homepage', 'volunteers', 'hero'],
    uploadedBy: 'Design',
    uploadedHoursAgo: 20,
    usage: [
      {
        id: 'usage-home-hero',
        area: 'content',
        entityType: 'homepage_hero',
        entityId: 'content-home-hero',
        label: 'Homepage Hero',
        path: '/admin/content/homepage',
      },
    ],
  }),
  createMockAsset({
    id: 'media-blog-shopping',
    title: 'Impact Shopping Blog Thumbnail',
    fileName: 'impact-shopping-thumbnail.jpg',
    url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
    mimeType: 'image/jpeg',
    type: 'image',
    sizeBytes: 718000,
    width: 1200,
    height: 800,
    altText: 'Shopping bags on a table with a warm storefront background.',
    caption: 'Thumbnail for conscious shopping article.',
    tags: ['blog', 'shopping'],
    uploadedBy: 'Editorial',
    uploadedHoursAgo: 36,
    usage: [
      {
        id: 'usage-blog-shopping',
        area: 'blog',
        entityType: 'blog_post',
        entityId: 'blog-101',
        label: '10 Ways to Make Your Shopping More Impactful',
        path: '/admin/blogs/edit/blog-101',
      },
    ],
  }),
  createMockAsset({
    id: 'media-education-classroom',
    title: 'Education Classroom Gallery',
    fileName: 'education-classroom.jpg',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
    mimeType: 'image/jpeg',
    type: 'image',
    sizeBytes: 932000,
    width: 1200,
    height: 798,
    altText: 'Students sitting at desks during a classroom session.',
    caption: 'Education partner campaign image.',
    tags: ['education', 'campaign'],
    uploadedBy: 'Programs',
    uploadedHoursAgo: 58,
    usage: [
      {
        id: 'usage-education-cause',
        area: 'causes',
        entityType: 'campaign',
        entityId: 'education-for-all',
        label: 'Education for All',
        path: '/admin/causes/education-for-all',
      },
    ],
  }),
  createMockAsset({
    id: 'media-brand-logo',
    title: 'AffiliateDonor Logo Mark',
    fileName: 'affiliatedonor-logo.svg',
    url: 'https://dummyimage.com/512x512/2563eb/ffffff&text=AD',
    mimeType: 'image/svg+xml',
    type: 'svg',
    sizeBytes: 24000,
    width: 512,
    height: 512,
    altText: 'AffiliateDonor AD logo mark.',
    caption: 'Primary square logo mark for admin and social preview placeholders.',
    tags: ['brand', 'logo'],
    uploadedBy: 'Design',
    uploadedHoursAgo: 86,
    usage: [
      {
        id: 'usage-settings-brand',
        area: 'settings',
        entityType: 'branding',
        entityId: 'settings-branding',
        label: 'Branding settings',
        path: '/admin/settings',
      },
    ],
  }),
  createMockAsset({
    id: 'media-product-bottle',
    title: 'Eco Bottle Product Image',
    fileName: 'eco-bottle-product.jpg',
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1000',
    mimeType: 'image/jpeg',
    type: 'image',
    sizeBytes: 548000,
    width: 1000,
    height: 1250,
    altText: '',
    caption: 'Affiliate product image awaiting accessibility metadata.',
    tags: ['product', 'affiliate', 'bottle'],
    uploadedBy: 'Commerce',
    uploadedHoursAgo: 96,
    usage: [
      {
        id: 'usage-product-bottle',
        area: 'products',
        entityType: 'affiliate_product',
        entityId: 'p1',
        label: 'Eco-Friendly Water Bottle',
        path: '/admin/products/affiliate',
      },
    ],
  }),
  createMockAsset({
    id: 'media-unused-partner',
    title: 'Partner Review Draft Image',
    fileName: 'partner-review-draft.jpg',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    mimeType: 'image/jpeg',
    type: 'image',
    sizeBytes: 664000,
    width: 1200,
    height: 800,
    altText: '',
    caption: 'Unused partner article draft image.',
    tags: ['partners', 'draft'],
    uploadedBy: 'Editorial',
    uploadedHoursAgo: 128,
    usage: [],
  }),
]

export const adminMediaAPI = {
  async getAssets(): Promise<AdminMediaListResponse> {
    try {
      const response = await apiClient.get<AdminMediaListResponse>('/api/admin/media')
      return response.data
    } catch (error) {
      console.warn('Using admin media fallback data because the API could not be reached.', error)
      const assets = getFallbackAssets()
      return {
        assets,
        summary: summarizeMedia(assets),
      }
    }
  },

  async getAsset(id: string): Promise<AdminMediaAsset> {
    try {
      const response = await apiClient.get<AdminMediaAsset>(`/api/admin/media/${id}`)
      return response.data
    } catch (error) {
      console.warn('Using admin media fallback detail because the API could not be reached.', error)
      const asset = getFallbackAssets().find((item) => item.id === id)

      if (!asset) {
        throw new Error('Media asset not found.')
      }

      return asset
    }
  },

  async uploadAsset(request: AdminMediaUploadRequest): Promise<AdminMediaAsset> {
    const timestamp = new Date().toISOString()
    const asset: AdminMediaAsset = {
      id: `media-${Date.now()}`,
      title: request.title,
      fileName: request.fileName,
      url: request.url,
      thumbnailUrl: request.url,
      mimeType: request.mimeType,
      type: request.type,
      sizeBytes: request.sizeBytes,
      width: request.width,
      height: request.height,
      altText: request.altText,
      caption: request.caption,
      tags: request.tags,
      uploadedBy: request.uploadedBy,
      uploadedAt: timestamp,
      updatedAt: timestamp,
      usage: [],
      status: 'active',
    }

    try {
      const response = await apiClient.post<AdminMediaAsset>('/api/admin/media', request)
      saveFallbackAsset(response.data)
      return response.data
    } catch (error) {
      console.warn('Saving media asset in fallback admin storage because the API could not be reached.', error)
      saveFallbackAsset(asset)
      return asset
    }
  },

  async updateAsset(id: string, asset: AdminMediaAsset): Promise<AdminMediaAsset> {
    const updated: AdminMediaAsset = {
      ...asset,
      id,
      updatedAt: new Date().toISOString(),
    }

    try {
      const response = await apiClient.put<AdminMediaAsset>(`/api/admin/media/${id}`, updated)
      saveFallbackAsset(response.data)
      return response.data
    } catch (error) {
      console.warn('Updating media asset in fallback admin storage because the API could not be reached.', error)
      saveFallbackAsset(updated)
      return updated
    }
  },

  async deleteAsset(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/media/${id}`)
    } catch (error) {
      console.warn('Deleting media asset in fallback admin storage because the API could not be reached.', error)
    }

    removeFallbackAsset(id)
  },
}

export function summarizeMedia(assets: AdminMediaAsset[]): AdminMediaSummary {
  return assets.reduce<AdminMediaSummary>(
    (summary, asset) => {
      summary.totalCount += 1
      summary.imageCount += asset.type === 'image' || asset.type === 'svg' ? 1 : 0
      summary.usedCount += asset.usage.length > 0 ? 1 : 0
      summary.unusedCount += asset.usage.length === 0 ? 1 : 0
      summary.missingAltCount += assetNeedsAlt(asset) && !asset.altText.trim() ? 1 : 0
      summary.storageBytes += asset.sizeBytes
      return summary
    },
    {
      totalCount: 0,
      imageCount: 0,
      usedCount: 0,
      unusedCount: 0,
      missingAltCount: 0,
      storageBytes: 0,
    },
  )
}

export function assetNeedsAlt(asset: AdminMediaAsset) {
  return asset.type === 'image' || asset.type === 'svg'
}

function createMockAsset(
  asset: Omit<AdminMediaAsset, 'thumbnailUrl' | 'uploadedAt' | 'updatedAt' | 'status'> & {
    uploadedHoursAgo: number
  },
): AdminMediaAsset {
  const uploadedAt = new Date(now - asset.uploadedHoursAgo * 60 * 60 * 1000).toISOString()
  return {
    ...asset,
    thumbnailUrl: asset.url,
    uploadedAt,
    updatedAt: new Date(now - Math.max(2, asset.uploadedHoursAgo - 4) * 60 * 60 * 1000).toISOString(),
    status: 'active',
  }
}

function getFallbackAssets() {
  const deletedIds = readDeletedIds()
  return mergeAssets(
    mockAssets.filter((asset) => !deletedIds.includes(asset.id)),
    readStoredAssets(),
  ).sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime())
}

function saveFallbackAsset(asset: AdminMediaAsset) {
  if (typeof window === 'undefined') {
    return
  }

  const stored = readStoredAssets()
  window.localStorage.setItem(fallbackStorageKey, JSON.stringify(mergeAssets(stored, [asset])))
}

function removeFallbackAsset(id: string) {
  if (typeof window === 'undefined') {
    return
  }

  const stored = readStoredAssets().filter((asset) => asset.id !== id)
  const deleted = Array.from(new Set([...readDeletedIds(), id]))
  window.localStorage.setItem(fallbackStorageKey, JSON.stringify(stored))
  window.localStorage.setItem(fallbackDeletedKey, JSON.stringify(deleted))
}

function readStoredAssets(): AdminMediaAsset[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(fallbackStorageKey)
    return value ? (JSON.parse(value) as AdminMediaAsset[]) : []
  } catch (error) {
    console.warn('Stored admin media assets could not be parsed.', error)
    return []
  }
}

function readDeletedIds(): string[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(fallbackDeletedKey)
    return value ? (JSON.parse(value) as string[]) : []
  } catch (error) {
    console.warn('Stored deleted media IDs could not be parsed.', error)
    return []
  }
}

function mergeAssets(base: AdminMediaAsset[], overrides: AdminMediaAsset[]) {
  const assetsById = new Map<string, AdminMediaAsset>()
  base.forEach((asset) => assetsById.set(asset.id, asset))
  overrides.forEach((asset) => assetsById.set(asset.id, asset))
  return Array.from(assetsById.values())
}
