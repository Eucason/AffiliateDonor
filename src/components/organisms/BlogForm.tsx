import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { CalendarClock, Image as ImageIcon, Loader2, Star, Tag, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BlogPreviewPanel from '@/components/admin/blog/BlogPreviewPanel'
import BlogSeoPanel from '@/components/admin/blog/BlogSeoPanel'
import Button from '@/components/atoms/Button'
import Card from '@/components/molecules/Card'
import { blogAPI } from '@/services/blogAPI'
import type { BlogPost, BlogPostCreateData, BlogPostUpdateData, BlogStatus } from '@/types/blog'

interface BlogFormProps {
  post?: BlogPost | null
  onSubmit: (data: BlogPostCreateData | BlogPostUpdateData) => Promise<BlogPost>
  isLoading?: boolean
}

const defaultFormData: BlogPostCreateData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  contentFormat: 'markdown',
  featuredImageUrl: null,
  category: null,
  tags: [],
  authorName: '',
  status: 'draft',
  isFeatured: false,
  seoTitle: null,
  seoDescription: null,
  scheduledAt: null,
}

export default function BlogForm({ post = null, onSubmit, isLoading = false }: BlogFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<BlogPostCreateData>(defaultFormData)
  const [tagInput, setTagInput] = useState('')
  const [slugError, setSlugError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSlugModified, setIsSlugModified] = useState(false)

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        contentFormat: post.contentFormat || 'markdown',
        featuredImageUrl: post.featuredImageUrl ?? null,
        category: post.category ?? null,
        tags: post.tags || [],
        authorName: post.authorName,
        status: post.status,
        isFeatured: post.isFeatured ?? false,
        seoTitle: post.seoTitle ?? null,
        seoDescription: post.seoDescription ?? null,
        scheduledAt: post.scheduledAt ?? null,
      })
      setIsSlugModified(true)
    }
  }, [post])

  useEffect(() => {
    if (!isSlugModified && formData.title) {
      setFormData((current) => ({ ...current, slug: blogAPI.generateSlug(formData.title) }))
    }
  }, [formData.title, isSlugModified])

  const scheduledInputValue = useMemo(() => toDatetimeLocalValue(formData.scheduledAt), [formData.scheduledAt])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    const nullableFields = ['featuredImageUrl', 'category', 'seoTitle', 'seoDescription']
    setFormData((current) => ({ ...current, [name]: nullableFields.includes(name) ? emptyToNull(value) : value }))
  }

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value as BlogStatus
    setFormData((current) => ({
      ...current,
      status,
      scheduledAt: status === 'scheduled' ? current.scheduledAt : null,
    }))
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.checked }))
  }

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({ ...current, slug: blogAPI.generateSlug(event.target.value) }))
    setIsSlugModified(true)
    setSlugError(null)
  }

  const handleScheduledAtChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      scheduledAt: event.target.value ? new Date(event.target.value).toISOString() : null,
    }))
  }

  const handleSeoChange = (field: 'seoTitle' | 'seoDescription', value: string) => {
    setFormData((current) => ({ ...current, [field]: emptyToNull(value) }))
  }

  const handleTagInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      const tag = tagInput.trim()

      if (tag && !formData.tags.includes(tag)) {
        setFormData((current) => ({ ...current, tags: [...current.tags, tag] }))
        setTagInput('')
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((current) => ({ ...current, tags: current.tags.filter((tag) => tag !== tagToRemove) }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    setSlugError(null)

    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim() || !formData.authorName.trim()) {
      setFormError('Title, slug, content, and author are required.')
      return
    }

    if (formData.status === 'scheduled' && !formData.scheduledAt) {
      setFormError('Scheduled posts need a publish date.')
      return
    }

    try {
      await onSubmit({
        ...formData,
        excerpt: formData.excerpt.trim(),
        featuredImageUrl: formData.featuredImageUrl || null,
        category: formData.category || null,
        seoTitle: formData.seoTitle || null,
        seoDescription: formData.seoDescription || null,
        tags: formData.tags.map((tag) => tag.trim()).filter(Boolean),
      })
    } catch (error) {
      console.error('Failed to save blog post:', error)
      if (error instanceof Error && error.message.includes('Slug must be unique')) {
        setSlugError('This slug is already in use. Please choose a different slug.')
      } else {
        setFormError('Failed to save blog post. Please try again.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <Card className="p-6">
        <div className="space-y-6">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block lg:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Title</span>
              <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog post title"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Slug</span>
              <div className="flex gap-2">
                <input
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="blog-post-slug"
                  required
                  className={`min-w-0 flex-1 rounded-lg border px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 ${
                    slugError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData((current) => ({ ...current, slug: blogAPI.generateSlug(current.title) }))
                    setIsSlugModified(false)
                    setSlugError(null)
                  }}
                >
                  Generate
                </Button>
              </div>
              {slugError && <span className="mt-1 block text-sm text-red-600">{slugError}</span>}
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Author</span>
              <input
                name="authorName"
                type="text"
                value={formData.authorName}
                onChange={handleChange}
                placeholder="Author name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <label className="block lg:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Excerpt</span>
              <textarea
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Short summary for cards and previews"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Status</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Category</span>
              <input
                name="category"
                type="text"
                value={formData.category ?? ''}
                onChange={handleChange}
                placeholder="Impact"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
              <input
                name="isFeatured"
                type="checkbox"
                checked={formData.isFeatured ?? false}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <Star className="h-4 w-4 text-yellow-600" />
                Featured post
              </span>
            </label>
          </div>

          {formData.status === 'scheduled' && (
            <label className="block">
              <span className="mb-1 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <CalendarClock className="h-4 w-4 text-primary-600" />
                Scheduled publish date
              </span>
              <input
                type="datetime-local"
                value={scheduledInputValue}
                onChange={handleScheduledAtChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Featured Image URL</label>
            <div className="flex gap-2">
              <input
                name="featuredImageUrl"
                type="url"
                value={formData.featuredImageUrl ?? ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              {formData.featuredImageUrl && (
                <button
                  type="button"
                  onClick={() => setFormData((current) => ({ ...current, featuredImageUrl: null }))}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {formData.featuredImageUrl ? (
              <img src={formData.featuredImageUrl} alt="" className="mt-3 h-36 w-56 rounded-lg object-cover" />
            ) : (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <ImageIcon className="h-4 w-4" />
                No featured image
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tags</label>
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tags with Enter or comma"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {formData.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700">
                    <Tag className="h-3 w-3" />
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-primary-500 hover:text-primary-800">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <select
                name="contentFormat"
                value={formData.contentFormat}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
              </select>
            </div>
            <textarea
              id="content"
              name="content"
              rows={18}
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Write the blog post body"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <BlogSeoPanel
            title={formData.title}
            slug={formData.slug}
            excerpt={formData.excerpt}
            seoTitle={formData.seoTitle}
            seoDescription={formData.seoDescription}
            onChange={handleSeoChange}
          />

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : post ? (
                'Update Post'
              ) : (
                'Create Post'
              )}
            </Button>
          </div>
        </div>
      </Card>

      <BlogPreviewPanel
        title={formData.title}
        excerpt={formData.excerpt}
        content={formData.content}
        contentFormat={formData.contentFormat ?? 'markdown'}
        featuredImageUrl={formData.featuredImageUrl}
        category={formData.category}
        tags={formData.tags}
        authorName={formData.authorName}
        status={formData.status}
        isFeatured={formData.isFeatured}
        scheduledAt={formData.scheduledAt}
      />
    </form>
  )
}

function emptyToNull(value: string) {
  return value === '' ? null : value
}

function toDatetimeLocalValue(value?: string | null) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}
