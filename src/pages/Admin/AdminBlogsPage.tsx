import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Loader2 } from 'lucide-react'
import AdminLayout from '@/components/organisms/AdminLayout'
import AdminBlogTable from '@/components/organisms/AdminBlogTable'
import Button from '@/components/atoms/Button'
import { blogAPI } from '@/services/blogAPI'
import { BlogPost } from '@/types/blog'

export default function AdminBlogsPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await blogAPI.getAdminPosts()
      setPosts(data)
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
      alert('Failed to load blog posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await blogAPI.deletePost(id)
      await fetchPosts()
    } catch (error) {
      console.error('Failed to delete blog post:', error)
      alert('Failed to delete blog post. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-600">Manage all blog posts</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/blogs/new')}
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            New Blog Post
          </Button>
        </div>

        {/* Blog Table */}
        <AdminBlogTable
          posts={posts}
          onDelete={handleDelete}
          isLoading={loading || deletingId !== null}
        />
      </div>
    </AdminLayout>
  )
}