export type AdminContentStatus = 'draft' | 'published' | 'scheduled' | 'archived'

export type AdminContentArea =
  | 'homepage'
  | 'banners'
  | 'impact-stories'
  | 'testimonials'
  | 'about'
  | 'footer'

export type AdminContentType =
  | 'homepage_hero'
  | 'announcement'
  | 'banner'
  | 'impact_story'
  | 'testimonial'
  | 'about_section'
  | 'footer_group'
  | 'featured_section'

export type AdminContentSort = 'newest' | 'oldest' | 'title' | 'status' | 'order'

export type AdminContentMetadataValue = string | number | boolean | string[] | null

export type AdminContentMetadata = Record<string, AdminContentMetadataValue>

export interface AdminContentBlock {
  id: string
  area: AdminContentArea
  type: AdminContentType
  title: string
  slug: string
  status: AdminContentStatus
  summary: string
  body: string
  mediaUrl?: string
  ctaLabel?: string
  ctaTarget?: string
  linkLabel?: string
  linkTarget?: string
  linkedEntityId?: string
  linkedEntityLabel?: string
  metadata: AdminContentMetadata
  sortOrder: number
  startAt?: string
  endAt?: string
  scheduledAt?: string
  publishedAt?: string
  archivedAt?: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export interface AdminContentSummary {
  totalCount: number
  publishedCount: number
  draftCount: number
  scheduledCount: number
  archivedCount: number
  missingMediaCount: number
}

export interface AdminContentListResponse {
  blocks: AdminContentBlock[]
  summary: AdminContentSummary
}

export interface AdminContentFilters {
  search: string
  area: AdminContentArea | 'all'
  type: AdminContentType | 'all'
  status: AdminContentStatus | 'all'
  scheduled: 'all' | 'scheduled' | 'unscheduled'
  updatedFrom: string
  updatedTo: string
  sort: AdminContentSort
}

export interface AdminContentFilterOptions {
  areas: AdminContentArea[]
  types: AdminContentType[]
  statuses: AdminContentStatus[]
}

export interface AdminContentAreaConfig {
  area: AdminContentArea
  title: string
  description: string
  path: string
  allowedTypes: AdminContentType[]
}

export interface AdminContentEditorProps {
  draft: AdminContentBlock
  onFieldChange: <Key extends keyof AdminContentBlock>(key: Key, value: AdminContentBlock[Key]) => void
  onMetadataChange: (key: string, value: AdminContentMetadataValue) => void
}
