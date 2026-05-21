import apiClient from '@/lib/apiClient'
import { BlogPost, BlogPostCreateData, BlogPostUpdateData, BlogAPIResponse, BlogAdminAPIResponse } from '@/types/blog'

export const blogAPI = {
  // Get all published blog posts
  async getPublishedPosts(): Promise<BlogPost[]> {
    const response = await apiClient.get('/api/blogs')
    return response.data.posts
  },

  // Get a single published blog post by slug
  async getPublishedPostBySlug(slug: string): Promise<BlogPost> {
    const response = await apiClient.get(`/api/blogs/${slug}`)
    return response.data
  },

  // Get all blog posts (including drafts) for admin
  async getAdminPosts(status?: string): Promise<BlogPost[]> {
    const response = await apiClient.get('/api/admin/blogs', {
      params: { status }
    })
    return response.data.posts
  },

  // Get a single blog post by ID for admin
  async getAdminPostById(id: string): Promise<BlogPost> {
    const response = await apiClient.get(`/api/admin/blogs/${id}`)
    return response.data
  },

  // Create a new blog post
  async createPost(data: BlogPostCreateData): Promise<BlogPost> {
    const response = await apiClient.post('/api/admin/blogs', data)
    return response.data
  },

  // Update an existing blog post
  async updatePost(id: string, data: BlogPostUpdateData): Promise<BlogPost> {
    const response = await apiClient.put(`/api/admin/blogs/${id}`, data)
    return response.data
  },

  // Delete a blog post
  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/blogs/${id}`)
  },

  // Helper function to generate slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s]+/g, '-')   // Replace spaces with hyphens
      .replace(/^-+|-+$/g, '')  // Remove leading/trailing hyphens
  }
}