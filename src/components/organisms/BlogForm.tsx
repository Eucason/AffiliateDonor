import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, X, Tag, Image as ImageIcon } from 'lucide-react'
import { BlogPost, BlogPostCreateData, BlogPostUpdateData } from '@/types/blog'
import { blogAPI } from '@/services/blogAPI'
import Button from '@/components/atoms/Button'
import Card from '@/components/molecules/Card'
import StatusBadge from '@/components/atoms/StatusBadge'

interface BlogFormProps {
  post?: BlogPost | null
  onSubmit: (data: BlogPostCreateData | BlogPostUpdateData) => Promise<BlogPost>
  isLoading?: boolean
}

export default function BlogForm({ post = null, onSubmit, isLoading = false }: BlogFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<BlogPostCreateData>({
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
    seoTitle: null,
    seoDescription: null,
  })
  const [tagInput, setTagInput] = useState('')
  const [slugError, setSlugError] = useState<string | null>(null)
  const [isSlugModified, setIsSlugModified] = useState(false)

  // Initialize form with post data if editing
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        contentFormat: post.contentFormat || 'markdown',
        featuredImageUrl: post.featuredImageUrl,
        category: post.category,
        tags: post.tags || [],
        authorName: post.authorName,
        status: post.status,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
      })
    }
  }, [post])

  // Auto-generate slug from title when title changes
  useEffect(() => {
    if (!isSlugModified && formData.title) {
      const generatedSlug = blogAPI.generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, isSlugModified])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, slug: value }))
    setIsSlugModified(true)
    setSlugError(null)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, content: e.target.value }))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim()
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
        setTagInput('')
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title.trim()) {
      alert('Title is required')
      return
    }

    if (!formData.slug.trim()) {
      alert('Slug is required')
      return
    }

    if (!formData.content.trim()) {
      alert('Content is required')
      return
    }

    if (!formData.authorName.trim()) {
      alert('Author name is required')
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Failed to save blog post:', error)
      if (error instanceof Error && error.message.includes('Slug must be unique')) {
        setSlugError('This slug is already in use. Please choose a different slug.')
      } else {
        alert('Failed to save blog post. Please try again.')
      }
    }
  }

  const handlePreview = () => {
    // In a real app, this would open a preview modal or new tab
    alert('Preview functionality would be implemented here')
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog post title"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="slug"
              name="slug"
              type="text"
              className={`flex-1 px-4 py-2 border ${slugError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder="blog-post-slug"
              required
            />
            <button
              type="button"
              onClick={() => {
                const generatedSlug = blogAPI.generateSlug(formData.title)
                setFormData(prev => ({ ...prev, slug: generatedSlug }))
                setIsSlugModified(false)
                setSlugError(null)
              }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Generate
            </button>
          </div>
          {slugError && <p className="mt-1 text-sm text-red-600">{slugError}</p>}
          <p className="mt-1 text-sm text-gray-500">
            URL: /blog/{formData.slug}
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="A short summary of the blog post (shown in listings)"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <div className="mb-2 flex items-center gap-2">
            <select
              name="contentFormat"
              value={formData.contentFormat}
              onChange={handleChange}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="markdown">Markdown</option>
              <option value="html">HTML</option>
            </select>
            <button
              type="button"
              onClick={handlePreview}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Preview
            </button>
          </div>
          <textarea
            id="content"
            name="content"
            rows={15}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write your blog post content here..."
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.contentFormat === 'markdown' ? 'Markdown formatting is supported' : 'HTML content'}
          </p>
        </div>

        {/* Featured Image */}
        <div>
          <label htmlFor="featuredImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image URL
          </label>
          <div className="flex items-center gap-2">
            <input
              id="featuredImageUrl"
              name="featuredImageUrl"
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.featuredImageUrl || ''}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {formData.featuredImageUrl && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, featuredImageUrl: null }))}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {formData.featuredImageUrl ? (
            <div className="mt-2 relative h-32 w-32 rounded-lg overflow-hidden">
              <img
                src={formData.featuredImageUrl}
                alt="Featured preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2 text-gray-500">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm">No featured image</span>
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={formData.category || ''}
            onChange={handleChange}
            placeholder="e.g. Impact, Education, Success Stories"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              id="tagInput"
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tags (press Enter or comma to add)"
            />
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-primary-400 hover:text-primary-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Author Name */}
        <div>
          <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
            Author Name <span className="text-red-500">*</span>
          </label>
          <input
            id="authorName"
            name="authorName"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={formData.authorName}
            onChange={handleChange}
            placeholder="Enter author name"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            {formData.status === 'published' ? 'Post will be visible to the public' : 'Post will only be visible in admin'}
          </p>
        </div>

        {/* SEO Fields */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">
              SEO Title
            </label>
            <input
              id="seoTitle"
              name="seoTitle"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.seoTitle || ''}
              onChange={handleChange}
              placeholder="Title for search engines"
            />
          </div>
          <div>
            <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">
              SEO Description
            </label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.seoDescription || ''}
              onChange={handleChange}
              placeholder="Description for search engines"
            />
          </div>
        </div>

        {/* Current status display */}
        {post && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Current status:</span>
            <StatusBadge status={post.status} />
            {post.publishedAt && (
              <span className="text-sm text-gray-500">
                Published on {new Date(post.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {/* Form actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/blogs')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handlePreview}
            disabled={isLoading}
          >
            Preview
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : post ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </Card>
  )
}