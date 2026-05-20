import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AdminLayout from '@/components/organisms/AdminLayout'
import BlogForm from '@/components/organisms/BlogForm'
import { blogAPI } from '@/services/blogAPI'
import { BlogPost, BlogPostUpdateData } from '@/types/blog'

export default function AdminBlogEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchPost(id)
    }
  }, [id])

  const fetchPost = async (postId: string) => {
    try {
      setIsLoading(true)
      const data = await blogAPI.getAdminPostById(postId)
      setPost(data)
    } catch (error) {
      console.error('Failed to fetch blog post:', error)
      alert('Failed to load blog post. Please try again.')
      navigate('/admin/blogs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: BlogPostUpdateData | BlogPostCreateData): Promise<BlogPost> => {
    if (!id) {
      throw new Error('Post ID is required')
    }

    try {
      setSubmitLoading(true)
      const updatedPost = await blogAPI.updatePost(id, data as BlogPostUpdateData)
      alert('Blog post updated successfully!')
      setPost(updatedPost)
      return updatedPost
    } catch (error) {
      console.error('Failed to update blog post:', error)
      throw error
    } finally {
      setSubmitLoading(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            <span>Loading blog post...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!post) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Blog post not found.</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="text-gray-600">Update your blog post content and settings</p>
        </div>

        {/* Blog Form */}
        <BlogForm
          post={post}
          onSubmit={handleSubmit}
          isLoading={submitLoading}
        />
      </div>
    </AdminLayout>
  )
}