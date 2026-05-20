import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, PlusCircle, Eye, Loader2 } from 'lucide-react'
import AdminLayout from '@/components/organisms/AdminLayout'
import Card from '@/components/molecules/Card'
import { blogAPI } from '@/services/blogAPI'
import { BlogPost } from '@/types/blog'
import StatusBadge from '@/components/atoms/StatusBadge'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  })
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const posts = await blogAPI.getAdminPosts()

      // Calculate stats
      const totalPosts = posts.length
      const publishedPosts = posts.filter(post => post.status === 'published').length
      const draftPosts = posts.filter(post => post.status === 'draft').length

      // Get recent posts (sorted by updated date, newest first)
      const sortedPosts = [...posts].sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      const recentPosts = sortedPosts.slice(0, 5)

      setStats({ totalPosts, publishedPosts, draftPosts })
      setRecentPosts(recentPosts)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      alert('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your blog management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Blog Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.publishedPosts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Draft Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.draftPosts}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Quick Actions</p>
                <div className="flex gap-2 mt-2">
                  <Link
                    to="/admin/blogs/new"
                    className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 inline mr-1" />
                    New Post
                  </Link>
                  <Link
                    to="/admin/blogs"
                    className="px-3 py-1 bg-secondary-600 text-white rounded-lg text-sm hover:bg-secondary-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 inline mr-1" />
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Blog Posts</h2>
                  <Link
                    to="/admin/blogs"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View All
                  </Link>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                      <span>Loading recent posts...</span>
                    </div>
                  </div>
                ) : recentPosts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No blog posts found. Create your first post!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                        <div className="flex-1">
                          <Link
                            to={`/admin/blogs/edit/${post.id}`}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={post.status} />
                            <span className="text-xs text-gray-500">
                              {new Date(post.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
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
                            <FileText className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Links */}
          <div>
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
                <div className="space-y-3">
                  <Link
                    to="/blog"
                    target="_blank"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">View Public Blog</span>
                  </Link>
                  <Link
                    to="/admin/blogs/new"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <PlusCircle className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Create New Post</span>
                  </Link>
                  <Link
                    to="/admin/blogs"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-secondary-600" />
                    <span className="text-sm font-medium">Manage Blog Posts</span>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}