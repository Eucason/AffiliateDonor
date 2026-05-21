import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Loader2, Tag } from 'lucide-react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { pageTransition, slideUp } from '@/utils/motionVariants'
import { blogAPI } from '@/services/blogAPI'
import { BlogPost } from '@/types/blog'
import Card from '@/components/molecules/Card'
import ReactMarkdown from 'react-markdown'

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return

      try {
        setLoading(true)
        const data = await blogAPI.getPublishedPostBySlug(slug)
        setPost(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch blog post:', err)
        setError('Failed to load blog post. It may not exist or is not published.')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </button>
        </section>

        {/* Loading State */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary-600" />
          <p className="mt-4 text-lg text-gray-600">Loading blog post...</p>
        </section>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </button>
        </section>

        {/* Error State */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Return to Blog
          </button>
        </section>
      </motion.div>
    )
  }

  if (!post) {
    return (
      <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </button>
        </section>

        {/* Not Found State */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">Blog post not found.</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Return to Blog
          </button>
        </section>
      </motion.div>
    )
  }

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </button>
      </section>

      {/* Blog Post */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden">
          {/* Featured Image */}
          {post.featuredImageUrl && (
            <div className="relative h-96 w-full">
              <img
                src={post.featuredImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}</span>
              </div>
              {post.category && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span key={index} className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none">
              {post.contentFormat === 'markdown' ? (
                <ReactMarkdown>{post.content}</ReactMarkdown>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              )}
            </div>
          </div>
        </Card>
      </section>
    </motion.div>
  )
}