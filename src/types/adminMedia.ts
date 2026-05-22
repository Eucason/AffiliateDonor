export type AdminMediaType = 'image' | 'svg' | 'video' | 'document' | 'other'

export type AdminMediaUsageArea =
  | 'blog'
  | 'content'
  | 'causes'
  | 'products'
  | 'settings'
  | 'unused'

export type AdminMediaSort = 'newest' | 'oldest' | 'title' | 'size_desc' | 'usage_desc'

export interface AdminMediaUsage {
  id: string
  area: Exclude<AdminMediaUsageArea, 'unused'>
  entityType: string
  entityId: string
  label: string
  path: string
}

export interface AdminMediaAsset {
  id: string
  title: string
  fileName: string
  url: string
  thumbnailUrl?: string
  mimeType: string
  type: AdminMediaType
  sizeBytes: number
  width?: number
  height?: number
  altText: string
  caption: string
  tags: string[]
  uploadedBy: string
  uploadedAt: string
  updatedAt: string
  usage: AdminMediaUsage[]
  status: 'active' | 'archived'
}

export interface AdminMediaSummary {
  totalCount: number
  imageCount: number
  usedCount: number
  unusedCount: number
  missingAltCount: number
  storageBytes: number
}

export interface AdminMediaListResponse {
  assets: AdminMediaAsset[]
  summary: AdminMediaSummary
}

export interface AdminMediaFilters {
  search: string
  type: AdminMediaType | 'all'
  usageArea: AdminMediaUsageArea | 'all'
  uploadedBy: string
  missingAlt: 'all' | 'missing' | 'complete'
  dateFrom: string
  dateTo: string
  sort: AdminMediaSort
}

export interface AdminMediaFilterOptions {
  types: AdminMediaType[]
  usageAreas: AdminMediaUsageArea[]
  uploadedBy: string[]
}

export interface AdminMediaUploadRequest {
  title: string
  fileName: string
  url: string
  mimeType: string
  type: AdminMediaType
  sizeBytes: number
  width?: number
  height?: number
  altText: string
  caption: string
  tags: string[]
  uploadedBy: string
}
