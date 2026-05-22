import { Archive, CalendarClock, Edit, Eye, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import type { BlogPost, BlogStatus } from '@/types/blog'

interface AdminBlogTableProps {
  posts: BlogPost[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onStatusChange: (id: string, status: BlogStatus) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export default function AdminBlogTable({
  posts,
  selectedIds,
  onSelectionChange,
  onStatusChange,
  onDelete,
  isLoading = false,
}: AdminBlogTableProps) {
  const allVisibleSelected = posts.length > 0 && posts.every((post) => selectedIds.includes(post.id))

  const toggleAll = () => {
    if (allVisibleSelected) {
      onSelectionChange(selectedIds.filter((id) => !posts.some((post) => post.id === id)))
      return
    }

    onSelectionChange(Array.from(new Set([...selectedIds, ...posts.map((post) => post.id)])))
  }

  const togglePost = (id: string) => {
    onSelectionChange(selectedIds.includes(id) ? selectedIds.filter((selectedId) => selectedId !== id) : [...selectedIds, id])
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAll}
                  aria-label="Select all visible posts"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Post</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Taxonomy</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Performance</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Updated</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                  Loading blog posts...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                  No posts match the current filters.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 align-top">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(post.id)}
                      onChange={() => togglePost(post.id)}
                      aria-label={`Select ${post.title}`}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="min-w-[20rem] px-4 py-4 align-top">
                    <div className="flex gap-3">
                      <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {post.featuredImageUrl ? (
                          <img src={post.featuredImageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <Archive className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          to={`/admin/blogs/edit/${post.id}`}
                          className="font-semibold text-gray-900 hover:text-primary-700"
                        >
                          {post.title}
                        </Link>
                        <p className="mt-1 text-xs text-gray-500">/{post.slug}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span>{post.authorName}</span>
                          <span>{post.readTimeMinutes ?? 1} min read</span>
                          {post.isFeatured && (
                            <span className="inline-flex items-center gap-1 font-semibold text-yellow-700">
                              <Star className="h-3 w-3" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-2">
                      <AdminStatusBadge status={post.status} />
                      {post.status === 'scheduled' && post.scheduledAt && (
                        <p className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <CalendarClock className="h-3 w-3" />
                          {dateFormatter.format(new Date(post.scheduledAt))}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="text-sm font-medium text-gray-800">{post.category || 'Uncategorized'}</p>
                    <div className="mt-2 flex max-w-56 flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="text-sm font-semibold text-gray-900">
                      {(post.performance?.viewCount ?? 0).toLocaleString()} views
                    </p>
                    <p className="text-xs text-gray-500">
                      {(post.performance?.conversionAssistCount ?? 0).toLocaleString()} assists
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="text-sm text-gray-900">{dateFormatter.format(new Date(post.updatedAt))}</p>
                    <p className="text-xs text-gray-500">
                      {post.publishedAt ? `Published ${dateFormatter.format(new Date(post.publishedAt))}` : 'Not published'}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center justify-end gap-1">
                      {post.status === 'published' && (
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                          title="View public post"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        to={`/admin/blogs/edit/${post.id}`}
                        className="rounded-lg p-2 text-primary-600 hover:bg-primary-50 hover:text-primary-800"
                        title="Edit post"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      {post.status !== 'published' && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => onStatusChange(post.id, 'published')}>
                          Publish
                        </Button>
                      )}
                      {post.status !== 'archived' && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(post.id, 'archived')}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                          title="Archive post"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDelete(post.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-800"
                        title="Delete post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
