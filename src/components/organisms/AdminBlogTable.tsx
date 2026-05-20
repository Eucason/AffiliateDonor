import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Eye, Search, Filter, ChevronDown, ChevronUp, Calendar, User, Tag } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import StatusBadge from '@/components/atoms/StatusBadge'
import Button from '@/components/atoms/Button'
import Card from '@/components/molecules/Card'

interface AdminBlogTableProps {
  posts: BlogPost[]
  onDelete: (id: string) => void
  isLoading?: boolean
}

export default function AdminBlogTable({ posts, onDelete, isLoading = false }: AdminBlogTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.slug.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || post.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(a.createdAt)
      const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(b.createdAt)
      return sortDirection === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    } else {
      return sortDirection === 'desc'
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title)
    }
  })

  const handleDelete = (id: string) => {
    onDelete(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search by title, author, or slug..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => {
                      setSortBy('title')
                      setSortDirection(sortBy === 'title' && sortDirection === 'asc' ? 'desc' : 'asc')
                    }}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Title
                    {sortBy === 'title' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => {
                      setSortBy('date')
                      setSortDirection(sortBy === 'date' && sortDirection === 'asc' ? 'desc' : 'asc')
                    }}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Date
                    {sortBy === 'date' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                      <span>Loading blog posts...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {posts.length === 0 ? 'No blog posts found. Create your first post!' : 'No posts match your filters.'}
                  </td>
                </tr>
              ) : (
                sortedPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <Link
                          to={`/admin/blogs/edit/${post.id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          {post.title}
                        </Link>
                        <span className="text-xs text-gray-500">{post.slug}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {post.category || <span className="text-gray-400 italic">Uncategorized</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{post.authorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString()
                            : new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.publishedAt ? 'Published' : 'Created'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'published' && (
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="View public post"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/admin/blogs/edit/${post.id}`}
                          className="p-1 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded"
                          title="Edit post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirmId(post.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}