export type BlogStatus = 'draft' | 'published' | 'archived' | 'scheduled'
export type BlogContentFormat = 'html' | 'markdown'

export interface BlogPerformance {
  viewCount: number
  uniqueVisitors: number
  averageReadSeconds: number
  conversionAssistCount: number
  lastViewedAt?: string | null
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  contentFormat: BlogContentFormat
  featuredImageUrl?: string | null
  category?: string | null
  tags: string[]
  authorName: string
  status: BlogStatus
  isFeatured?: boolean
  seoTitle?: string | null
  seoDescription?: string | null
  readTimeMinutes?: number
  performance?: BlogPerformance
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
  scheduledAt?: string | null
  archivedAt?: string | null
}

export interface BlogPostCreateData {
  title: string
  slug: string
  excerpt: string
  content: string
  contentFormat?: BlogContentFormat
  featuredImageUrl?: string | null
  category?: string | null
  tags: string[]
  authorName: string
  status: BlogStatus
  isFeatured?: boolean
  seoTitle?: string | null
  seoDescription?: string | null
  scheduledAt?: string | null
}

export interface BlogPostUpdateData {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  contentFormat?: BlogContentFormat
  featuredImageUrl?: string | null
  category?: string | null
  tags?: string[]
  authorName?: string
  status?: BlogStatus
  isFeatured?: boolean
  seoTitle?: string | null
  seoDescription?: string | null
  scheduledAt?: string | null
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  postCount: number
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  postCount: number
}

export interface BlogFiltersState {
  search: string
  status: BlogStatus | 'all'
  category: string
  tag: string
  author: string
  featured: 'all' | 'featured' | 'standard'
  dateFrom: string
  dateTo: string
  sort: BlogSortOption
}

export type BlogSortOption =
  | 'updated_desc'
  | 'updated_asc'
  | 'published_desc'
  | 'title_asc'
  | 'title_desc'
  | 'views_desc'

export interface BlogSummary {
  total: number
  published: number
  drafts: number
  archived: number
  scheduled: number
  featured: number
}

export interface BlogAPIResponse {
  posts: BlogPost[]
  total: number
}

export interface BlogAdminAPIResponse {
  posts: BlogPost[]
  total: number
  summary?: BlogSummary
  categories?: BlogCategory[]
  tags?: BlogTag[]
}
