import ReactMarkdown from 'react-markdown'
import { Calendar, Star, User } from 'lucide-react'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import type { BlogContentFormat, BlogStatus } from '@/types/blog'

interface BlogPreviewPanelProps {
  title: string
  excerpt: string
  content: string
  contentFormat: BlogContentFormat
  featuredImageUrl?: string | null
  category?: string | null
  tags: string[]
  authorName: string
  status: BlogStatus
  isFeatured?: boolean
  scheduledAt?: string | null
}

export default function BlogPreviewPanel({
  title,
  excerpt,
  content,
  contentFormat,
  featuredImageUrl,
  category,
  tags,
  authorName,
  status,
  isFeatured,
  scheduledAt,
}: BlogPreviewPanelProps) {
  const displayDate = scheduledAt ? new Date(scheduledAt).toLocaleDateString() : new Date().toLocaleDateString()

  return (
    <aside className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">Preview</h2>
        <AdminStatusBadge status={status} />
      </div>
      <article className="max-h-[42rem] overflow-y-auto">
        {featuredImageUrl && (
          <img src={featuredImageUrl} alt="" className="h-48 w-full object-cover" />
        )}
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                {category}
              </span>
            )}
            {isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800">
                <Star className="h-3 w-3" />
                Featured
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold leading-tight text-gray-900">{title || 'Untitled blog post'}</h1>
          {excerpt && <p className="text-sm leading-6 text-gray-600">{excerpt}</p>}

          <div className="flex flex-wrap items-center gap-4 border-y border-gray-100 py-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {authorName || 'Author'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {displayDate}
            </span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-sm max-w-none text-gray-700">
            {content ? (
              contentFormat === 'markdown' ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              )
            ) : (
              <p className="text-gray-500">No body content yet.</p>
            )}
          </div>
        </div>
      </article>
    </aside>
  )
}
