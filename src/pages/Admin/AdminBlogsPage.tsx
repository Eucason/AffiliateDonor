import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Archive, CalendarClock, FileText, PlusCircle, RefreshCcw, Star } from 'lucide-react'
import BlogBulkActionsBar from '@/components/admin/blog/BlogBulkActionsBar'
import BlogCategoryManager from '@/components/admin/blog/BlogCategoryManager'
import BlogFilters from '@/components/admin/blog/BlogFilters'
import BlogPerformanceCard from '@/components/admin/blog/BlogPerformanceCard'
import AdminEmptyState from '@/components/admin/shared/AdminEmptyState'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import AdminBlogTable from '@/components/organisms/AdminBlogTable'
import { blogAPI } from '@/services/blogAPI'
import type { BlogCategory, BlogFiltersState, BlogPost, BlogStatus, BlogTag } from '@/types/blog'

const defaultFilters: BlogFiltersState = {
  search: '',
  status: 'all',
  category: '',
  tag: '',
  author: '',
  featured: 'all',
  dateFrom: '',
  dateTo: '',
  sort: 'updated_desc',
}

export default function AdminBlogsPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [tags, setTags] = useState<BlogTag[]>([])
  const [filters, setFilters] = useState<BlogFiltersState>(defaultFilters)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const [postData, categoryData, tagData] = await Promise.all([
        blogAPI.getAdminPosts(),
        blogAPI.getCategories(),
        blogAPI.getTags(),
      ])
      setPosts(postData)
      setCategories(categoryData)
      setTags(tagData)
      setError(null)
    } catch (requestError) {
      console.error('Failed to fetch blog posts:', requestError)
      setError('Blog posts could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  const summary = useMemo(() => blogAPI.summarizePosts(posts), [posts])

  const filteredPosts = useMemo(() => filterAndSortPosts(posts, filters), [posts, filters])
  const categoryNames = useMemo(() => categories.map((category) => category.name), [categories])
  const tagNames = useMemo(() => tags.map((tag) => tag.name), [tags])
  const authors = useMemo(
    () => Array.from(new Set(posts.map((post) => post.authorName))).sort((first, second) => first.localeCompare(second)),
    [posts],
  )

  const replacePost = (post: BlogPost) => {
    setPosts((current) => current.map((item) => (item.id === post.id ? post : item)))
  }

  const handleStatusChange = async (id: string, status: BlogStatus) => {
    try {
      setBusy(true)
      replacePost(await blogAPI.updatePostStatus(id, status))
      await refreshTaxonomy()
    } catch (requestError) {
      console.error('Failed to update blog post status:', requestError)
      setError('The blog post status could not be updated.')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this blog post?')

    if (!confirmed) {
      return
    }

    try {
      setBusy(true)
      await blogAPI.deletePost(id)
      setPosts((current) => current.filter((post) => post.id !== id))
      setSelectedIds((current) => current.filter((selectedId) => selectedId !== id))
      await refreshTaxonomy()
    } catch (requestError) {
      console.error('Failed to delete blog post:', requestError)
      setError('The blog post could not be deleted.')
    } finally {
      setBusy(false)
    }
  }

  const handleBulkStatus = async (status: BlogStatus) => {
    try {
      setBusy(true)
      const updatedPosts = await blogAPI.bulkUpdateStatus(selectedIds, status)
      setPosts((current) =>
        current.map((post) => updatedPosts.find((updatedPost) => updatedPost.id === post.id) ?? post),
      )
      setSelectedIds([])
      await refreshTaxonomy()
    } catch (requestError) {
      console.error('Failed to bulk update blog posts:', requestError)
      setError('Selected blog posts could not be updated.')
    } finally {
      setBusy(false)
    }
  }

  const handleBulkDelete = async () => {
    const confirmed = window.confirm(`Delete ${selectedIds.length} selected blog posts?`)

    if (!confirmed) {
      return
    }

    try {
      setBusy(true)
      await Promise.all(selectedIds.map((id) => blogAPI.deletePost(id)))
      setPosts((current) => current.filter((post) => !selectedIds.includes(post.id)))
      setSelectedIds([])
      await refreshTaxonomy()
    } catch (requestError) {
      console.error('Failed to delete selected blog posts:', requestError)
      setError('Selected blog posts could not be deleted.')
    } finally {
      setBusy(false)
    }
  }

  const refreshTaxonomy = async () => {
    const [categoryData, tagData] = await Promise.all([blogAPI.getCategories(), blogAPI.getTags()])
    setCategories(categoryData)
    setTags(tagData)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Content"
          title="Blog Management"
          description="Plan, publish, feature, archive, and optimize editorial content for the public blog."
          actions={
            <>
              <Button type="button" variant="outline" onClick={fetchPosts} disabled={loading || busy} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
              <Button type="button" variant="primary" onClick={() => navigate('/admin/blogs/new')} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                New Post
              </Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard label="All Posts" value={summary.total} icon={<FileText className="h-5 w-5" />} />
          <AdminStatCard label="Published" value={summary.published} icon={<FileText className="h-5 w-5" />} />
          <AdminStatCard label="Drafts" value={summary.drafts} icon={<FileText className="h-5 w-5" />} />
          <AdminStatCard label="Scheduled" value={summary.scheduled} icon={<CalendarClock className="h-5 w-5" />} />
          <AdminStatCard label="Archived" value={summary.archived} icon={<Archive className="h-5 w-5" />} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <BlogFilters
              filters={filters}
              categories={categoryNames}
              tags={tagNames}
              authors={authors}
              onChange={setFilters}
              onClear={() => setFilters(defaultFilters)}
            />

            <BlogBulkActionsBar
              selectedCount={selectedIds.length}
              isBusy={busy}
              onPublish={() => handleBulkStatus('published')}
              onArchive={() => handleBulkStatus('archived')}
              onDelete={handleBulkDelete}
              onClear={() => setSelectedIds([])}
            />

            {error && <AdminErrorState message={error} onRetry={fetchPosts} />}

            {loading ? (
              <AdminLoadingState label="Loading blog posts..." />
            ) : posts.length === 0 ? (
              <AdminEmptyState
                title="No blog posts yet"
                description="Create the first editorial post for impact stories, updates, or partner spotlights."
                actionLabel="Create Post"
                onAction={() => navigate('/admin/blogs/new')}
                icon={<FileText className="h-6 w-6" />}
              />
            ) : (
              <AdminBlogTable
                posts={filteredPosts}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                isLoading={busy}
              />
            )}
          </div>

          <div className="space-y-6">
            <BlogPerformanceCard posts={posts} />
            <section className="rounded-lg border border-yellow-200 bg-yellow-50 p-5">
              <div className="flex items-start gap-3">
                <Star className="mt-0.5 h-5 w-5 text-yellow-700" />
                <div>
                  <h2 className="text-base font-semibold text-yellow-950">Featured Queue</h2>
                  <p className="mt-1 text-sm text-yellow-800">
                    {summary.featured} {summary.featured === 1 ? 'post is' : 'posts are'} marked for featured placement.
                  </p>
                </div>
              </div>
            </section>
            <BlogCategoryManager categories={categories} tags={tags} />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function filterAndSortPosts(posts: BlogPost[], filters: BlogFiltersState) {
  const search = filters.search.trim().toLowerCase()
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom).getTime() : null
  const dateTo = filters.dateTo ? new Date(`${filters.dateTo}T23:59:59`).getTime() : null

  return posts
    .filter((post) => {
      const searchable = [
        post.title,
        post.slug,
        post.authorName,
        post.category ?? '',
        post.excerpt,
        post.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase()
      const updatedTime = new Date(post.updatedAt).getTime()

      return (
        (!search || searchable.includes(search)) &&
        (filters.status === 'all' || post.status === filters.status) &&
        (!filters.category || post.category === filters.category) &&
        (!filters.tag || post.tags.includes(filters.tag)) &&
        (!filters.author || post.authorName === filters.author) &&
        (filters.featured === 'all' ||
          (filters.featured === 'featured' && post.isFeatured) ||
          (filters.featured === 'standard' && !post.isFeatured)) &&
        (!dateFrom || updatedTime >= dateFrom) &&
        (!dateTo || updatedTime <= dateTo)
      )
    })
    .sort((first, second) => {
      switch (filters.sort) {
        case 'updated_asc':
          return new Date(first.updatedAt).getTime() - new Date(second.updatedAt).getTime()
        case 'published_desc':
          return new Date(second.publishedAt ?? 0).getTime() - new Date(first.publishedAt ?? 0).getTime()
        case 'title_asc':
          return first.title.localeCompare(second.title)
        case 'title_desc':
          return second.title.localeCompare(first.title)
        case 'views_desc':
          return (second.performance?.viewCount ?? 0) - (first.performance?.viewCount ?? 0)
        case 'updated_desc':
        default:
          return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
      }
    })
}
