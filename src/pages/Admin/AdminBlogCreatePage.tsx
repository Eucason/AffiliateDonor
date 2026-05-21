import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      alert('Blog post created successfully!')
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
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Blog Post</h1>
          <p className="text-gray-600">Write and publish a new blog post</p>
        </div>

        {/* Blog Form */}
        <BlogForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  )
}
