import apiClient from '@/lib/apiClient'
import type {
  BlogAdminAPIResponse,
  BlogCategory,
  BlogPost,
  BlogPostCreateData,
  BlogPostUpdateData,
  BlogStatus,
  BlogSummary,
  BlogTag,
} from '@/types/blog'

const fallbackPostsKey = 'affiliateDonor.adminBlogPosts'
const fallbackDeletedPostsKey = 'affiliateDonor.adminBlogDeletedPosts'
const now = Date.now()

const seedPosts: BlogPost[] = [
  createSeedPost({
    id: 'blog-101',
    title: '10 Ways to Make Your Shopping More Impactful',
    slug: '10-ways-to-make-your-shopping-more-impactful',
    excerpt: 'Discover simple strategies to maximize the positive impact of your everyday purchases.',
    content:
      'Every purchase can do more than complete a transaction. Choose verified partners, compare contribution rates, and keep a simple monthly giving rhythm that fits your budget.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
    category: 'Tips & Guides',
    tags: ['shopping', 'impact', 'tips'],
    authorName: 'Sarah Johnson',
    status: 'published',
    isFeatured: true,
    daysAgo: 9,
    viewCount: 18420,
  }),
  createSeedPost({
    id: 'blog-102',
    title: 'How We Verify Our Charitable Partners',
    slug: 'how-we-verify-our-charitable-partners',
    excerpt: 'Transparency is key. Learn about our vetting process for cause partners.',
    content:
      'Our partner review combines public registry checks, program documentation, financial signals, and impact reporting. Admin reviewers keep the process consistent across every campaign.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    category: 'Impact',
    tags: ['transparency', 'partners', 'vetting'],
    authorName: 'David Park',
    status: 'published',
    isFeatured: false,
    daysAgo: 18,
    viewCount: 12780,
  }),
  createSeedPost({
    id: 'blog-103',
    title: 'Spring Giving Week Campaign Draft',
    slug: 'spring-giving-week-campaign-draft',
    excerpt: 'Draft campaign story for the upcoming matching campaign.',
    content:
      'Spring Giving Week will highlight matching donations, donor stories, and clear progress updates from campaign teams.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200',
    category: 'Campaigns',
    tags: ['matching', 'campaigns'],
    authorName: 'Emma Rodriguez',
    status: 'draft',
    isFeatured: false,
    daysAgo: 3,
    viewCount: 0,
  }),
  createSeedPost({
    id: 'blog-104',
    title: 'Partner Spotlight: Education for All',
    slug: 'partner-spotlight-education-for-all',
    excerpt: 'A scheduled profile of an education partner expanding classroom access.',
    content:
      'Education for All supports local teachers with materials, scholarships, and community reporting that makes each contribution easier to understand.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
    category: 'Partners',
    tags: ['education', 'partners'],
    authorName: 'Emma Rodriguez',
    status: 'scheduled',
    isFeatured: false,
    daysAgo: 1,
    scheduledDaysAhead: 5,
    viewCount: 0,
  }),
  createSeedPost({
    id: 'blog-105',
    title: 'The Rise of Conscious Consumerism',
    slug: 'the-rise-of-conscious-consumerism',
    excerpt: 'A retired trend piece retained for editorial history.',
    content:
      'Conscious consumerism continues to evolve as shoppers expect clear contribution data and easier ways to support causes.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200',
    category: 'Trends',
    tags: ['consumerism', 'trends'],
    authorName: 'Sarah Johnson',
    status: 'archived',
    isFeatured: false,
    daysAgo: 92,
    viewCount: 9820,
  }),
]

export const blogAPI = {
  async getPublishedPosts(): Promise<BlogPost[]> {
    try {
      const response = await apiClient.get<{ posts: BlogPost[] }>('/api/blogs')
      return response.data.posts.map(normalizeBlogPost)
    } catch (error) {
      console.warn('Using blog fallback data because published posts could not be loaded.', error)
      return getFallbackPosts().filter((post) => post.status === 'published')
    }
  },

  async getPublishedPostBySlug(slug: string): Promise<BlogPost> {
    try {
      const response = await apiClient.get<BlogPost>(`/api/blogs/${slug}`)
      return normalizeBlogPost(response.data)
    } catch (error) {
      console.warn('Using blog fallback detail because the API could not be reached.', error)
      const post = getFallbackPosts().find((item) => item.slug === slug && item.status === 'published')

      if (!post) {
        throw new Error('Blog post not found.')
      }

      return post
    }
  },

  async getAdminPosts(status?: BlogStatus | 'all'): Promise<BlogPost[]> {
    try {
      const response = await apiClient.get<BlogAdminAPIResponse>('/api/admin/blogs', {
        params: { status },
      })
      return response.data.posts.map(normalizeBlogPost)
    } catch (error) {
      console.warn('Using admin blog fallback data because the API could not be reached.', error)
      const posts = getFallbackPosts()
      return status && status !== 'all' ? posts.filter((post) => post.status === status) : posts
    }
  },

  async getAdminPostById(id: string): Promise<BlogPost> {
    try {
      const response = await apiClient.get<BlogPost>(`/api/admin/blogs/${id}`)
      return normalizeBlogPost(response.data)
    } catch (error) {
      console.warn('Using admin blog fallback detail because the API could not be reached.', error)
      const post = getFallbackPosts().find((item) => item.id === id)

      if (!post) {
        throw new Error('Blog post not found.')
      }

      return post
    }
  },

  async createPost(data: BlogPostCreateData): Promise<BlogPost> {
    const fallbackPost = createPostFromRequest(data)

    try {
      const response = await apiClient.post<BlogPost>('/api/admin/blogs', data)
      const post = normalizeBlogPost(response.data)
      saveFallbackPost(post)
      return post
    } catch (error) {
      console.warn('Saving blog post in fallback admin storage because the API could not be reached.', error)
      saveFallbackPost(fallbackPost)
      return fallbackPost
    }
  },

  async updatePost(id: string, data: BlogPostUpdateData): Promise<BlogPost> {
    const current = await this.getAdminPostById(id)
    const fallbackPost = finalizePostDates({
      ...current,
      ...data,
      id,
      tags: data.tags ?? current.tags,
      updatedAt: new Date().toISOString(),
    })

    try {
      const response = await apiClient.put<BlogPost>(`/api/admin/blogs/${id}`, data)
      const post = normalizeBlogPost(response.data)
      saveFallbackPost(post)
      return post
    } catch (error) {
      console.warn('Updating blog post in fallback admin storage because the API could not be reached.', error)
      saveFallbackPost(fallbackPost)
      return fallbackPost
    }
  },

  async updatePostStatus(id: string, status: BlogStatus): Promise<BlogPost> {
    try {
      const response = await apiClient.patch<BlogPost>(`/api/admin/blogs/${id}/status`, { status })
      const post = normalizeBlogPost(response.data)
      saveFallbackPost(post)
      return post
    } catch (error) {
      console.warn('Updating blog status in fallback admin storage because the API could not be reached.', error)
      return this.updatePost(id, { status })
    }
  },

  async bulkUpdateStatus(ids: string[], status: BlogStatus): Promise<BlogPost[]> {
    const updated = await Promise.all(ids.map((id) => this.updatePostStatus(id, status)))
    return updated
  },

  async deletePost(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/blogs/${id}`)
    } catch (error) {
      console.warn('Deleting blog post from fallback admin storage because the API could not be reached.', error)
    }

    removeFallbackPost(id)
  },

  async getCategories(): Promise<BlogCategory[]> {
    return summarizeCategories(getFallbackPosts())
  },

  async getTags(): Promise<BlogTag[]> {
    return summarizeTags(getFallbackPosts())
  },

  summarizePosts(posts: BlogPost[]): BlogSummary {
    return summarizePosts(posts)
  },

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },
}

export function summarizePosts(posts: BlogPost[]): BlogSummary {
  return posts.reduce<BlogSummary>(
    (summary, post) => {
      summary.total += 1
      summary.published += post.status === 'published' ? 1 : 0
      summary.drafts += post.status === 'draft' ? 1 : 0
      summary.archived += post.status === 'archived' ? 1 : 0
      summary.scheduled += post.status === 'scheduled' ? 1 : 0
      summary.featured += post.isFeatured ? 1 : 0
      return summary
    },
    {
      total: 0,
      published: 0,
      drafts: 0,
      archived: 0,
      scheduled: 0,
      featured: 0,
    },
  )
}

function createSeedPost(
  post: Omit<
    BlogPost,
    'contentFormat' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'scheduledAt' | 'archivedAt' | 'readTimeMinutes' | 'performance'
  > & {
    daysAgo: number
    scheduledDaysAhead?: number
    viewCount: number
  },
): BlogPost {
  const updatedAt = new Date(now - post.daysAgo * 24 * 60 * 60 * 1000).toISOString()
  const scheduledAt = post.scheduledDaysAhead
    ? new Date(now + post.scheduledDaysAhead * 24 * 60 * 60 * 1000).toISOString()
    : null

  return {
    ...post,
    contentFormat: 'markdown',
    createdAt: new Date(now - (post.daysAgo + 7) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt,
    publishedAt: post.status === 'published' ? updatedAt : null,
    scheduledAt,
    archivedAt: post.status === 'archived' ? updatedAt : null,
    readTimeMinutes: estimateReadTime(post.content),
    performance: {
      viewCount: post.viewCount,
      uniqueVisitors: Math.round(post.viewCount * 0.72),
      averageReadSeconds: 142,
      conversionAssistCount: Math.max(0, Math.round(post.viewCount * 0.012)),
      lastViewedAt: post.viewCount > 0 ? new Date(now - 6 * 60 * 60 * 1000).toISOString() : null,
    },
  }
}

function createPostFromRequest(data: BlogPostCreateData): BlogPost {
  const timestamp = new Date().toISOString()
  return finalizePostDates({
    id: `blog-${Date.now()}`,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    contentFormat: data.contentFormat ?? 'markdown',
    featuredImageUrl: data.featuredImageUrl ?? null,
    category: data.category ?? null,
    tags: data.tags,
    authorName: data.authorName,
    status: data.status,
    isFeatured: data.isFeatured ?? false,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
    scheduledAt: data.scheduledAt ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
    readTimeMinutes: estimateReadTime(data.content),
    performance: {
      viewCount: 0,
      uniqueVisitors: 0,
      averageReadSeconds: 0,
      conversionAssistCount: 0,
      lastViewedAt: null,
    },
  })
}

function normalizeBlogPost(post: BlogPost): BlogPost {
  return finalizePostDates({
    ...post,
    contentFormat: post.contentFormat ?? 'markdown',
    tags: post.tags ?? [],
    isFeatured: post.isFeatured ?? false,
    readTimeMinutes: post.readTimeMinutes ?? estimateReadTime(post.content),
    performance: post.performance ?? {
      viewCount: 0,
      uniqueVisitors: 0,
      averageReadSeconds: 0,
      conversionAssistCount: 0,
      lastViewedAt: null,
    },
  })
}

function finalizePostDates(post: BlogPost): BlogPost {
  const timestamp = new Date().toISOString()
  const publishedAt =
    post.status === 'published' ? post.publishedAt ?? timestamp : post.status === 'scheduled' ? null : post.publishedAt ?? null
  const archivedAt = post.status === 'archived' ? post.archivedAt ?? timestamp : null

  return {
    ...post,
    publishedAt,
    scheduledAt: post.status === 'scheduled' ? post.scheduledAt ?? timestamp : post.scheduledAt ?? null,
    archivedAt,
    readTimeMinutes: post.readTimeMinutes ?? estimateReadTime(post.content),
  }
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 225))
}

function getFallbackPosts() {
  return mergePosts(seedPosts.filter((post) => !getDeletedPostIds().includes(post.id)), readStoredPosts()).sort(
    (first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime(),
  )
}

function saveFallbackPost(post: BlogPost) {
  if (typeof window === 'undefined') {
    return
  }

  const stored = readStoredPosts()
  window.localStorage.setItem(fallbackPostsKey, JSON.stringify(mergePosts(stored, [post])))
}

function removeFallbackPost(id: string) {
  if (typeof window === 'undefined') {
    return
  }

  const stored = readStoredPosts().filter((post) => post.id !== id)
  const deleted = Array.from(new Set([...getDeletedPostIds(), id]))
  window.localStorage.setItem(fallbackPostsKey, JSON.stringify(stored))
  window.localStorage.setItem(fallbackDeletedPostsKey, JSON.stringify(deleted))
}

function readStoredPosts(): BlogPost[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(fallbackPostsKey)
    return value ? (JSON.parse(value) as BlogPost[]).map(normalizeBlogPost) : []
  } catch (error) {
    console.warn('Stored admin blog posts could not be parsed.', error)
    return []
  }
}

function getDeletedPostIds(): string[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(fallbackDeletedPostsKey)
    return value ? (JSON.parse(value) as string[]) : []
  } catch (error) {
    console.warn('Stored deleted blog IDs could not be parsed.', error)
    return []
  }
}

function mergePosts(base: BlogPost[], overrides: BlogPost[]) {
  const postsById = new Map<string, BlogPost>()
  base.forEach((post) => postsById.set(post.id, normalizeBlogPost(post)))
  overrides.forEach((post) => postsById.set(post.id, normalizeBlogPost(post)))
  return Array.from(postsById.values())
}

function summarizeCategories(posts: BlogPost[]): BlogCategory[] {
  const countByName = new Map<string, number>()

  posts.forEach((post) => {
    if (post.category) {
      countByName.set(post.category, (countByName.get(post.category) ?? 0) + 1)
    }
  })

  return Array.from(countByName.entries())
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([name, postCount]) => ({
      id: blogAPI.generateSlug(name),
      name,
      slug: blogAPI.generateSlug(name),
      postCount,
      isArchived: false,
      createdAt: new Date(now - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    }))
}

function summarizeTags(posts: BlogPost[]): BlogTag[] {
  const countByName = new Map<string, number>()

  posts.forEach((post) => {
    post.tags.forEach((tag) => countByName.set(tag, (countByName.get(tag) ?? 0) + 1))
  })

  return Array.from(countByName.entries())
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([name, postCount]) => ({
      id: blogAPI.generateSlug(name),
      name,
      slug: blogAPI.generateSlug(name),
      postCount,
    }))
}
