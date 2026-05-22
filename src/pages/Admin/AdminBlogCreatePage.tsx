import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminLayout from '@/components/organisms/AdminLayout'
import BlogForm from '@/components/organisms/BlogForm'
import { blogAPI } from '@/services/blogAPI'
import { BlogPostCreateData, BlogPostUpdateData } from '@/types/blog'

export default function AdminBlogCreatePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: BlogPostCreateData | BlogPostUpdateData) => {
    try {
      setIsLoading(true)
      const createdPost = await blogAPI.createPost(data as BlogPostCreateData)
      navigate(`/admin/blogs/edit/${createdPost.id}`)
      return createdPost
    } catch (error) {
      console.error('Failed to create blog post:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Content"
          title="Create Blog Post"
          description="Draft, schedule, preview, and optimize a new public blog post."
        />

        <BlogForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </AdminLayout>
  )
}
