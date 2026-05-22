import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminLayout from '@/components/organisms/AdminLayout'
import BlogForm from '@/components/organisms/BlogForm'
import { blogAPI } from '@/services/blogAPI'
import { BlogPost, BlogPostCreateData, BlogPostUpdateData } from '@/types/blog'

export default function AdminBlogEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchPost = useCallback(async (postId: string) => {
    try {
      setIsLoading(true)
      const data = await blogAPI.getAdminPostById(postId)
      setPost(data)
    } catch (error) {
      console.error('Failed to fetch blog post:', error)
      navigate('/admin/blogs')
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    if (id) {
      fetchPost(id)
    }
  }, [fetchPost, id])

  const handleSubmit = async (data: BlogPostUpdateData | BlogPostCreateData): Promise<BlogPost> => {
    if (!id) {
      throw new Error('Post ID is required')
    }

    try {
      setSubmitLoading(true)
      const updatedPost = await blogAPI.updatePost(id, data as BlogPostUpdateData)
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
        <AdminErrorState message="Blog post not found." onRetry={() => navigate('/admin/blogs')} retryLabel="Back to posts" />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Content"
          title="Edit Blog Post"
          description="Update publishing status, taxonomy, SEO fields, schedule, and public preview."
        />

        <BlogForm post={post} onSubmit={handleSubmit} isLoading={submitLoading} />
      </div>
    </AdminLayout>
  )
}
