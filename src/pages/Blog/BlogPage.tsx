import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react'
import Card from '@/components/molecules/Card'
import { blogAPI } from '@/services/blogAPI'
import type { BlogPost } from '@/types/blog'
import { pageTransition, slideUp, staggerContainer, staggerItem } from '@/utils/motionVariants'

function formatPostDate(post: BlogPost) {
  const date = post.publishedAt ?? post.updatedAt
  return new Date(date).toLocaleDateString()
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      try {
        setLoading(true)
        const posts = await blogAPI.getPublishedPosts()

        if (isMounted) {
          setBlogPosts(posts)
          setError(null)
        }
      } catch (err) {
        console.error('Failed to fetch blog posts:', err)

        if (isMounted) {
          setError('Failed to load blog posts.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPosts()

    return () => {
      isMounted = false
    }
  }, [])

  const featuredPost = blogPosts.find((post) => post.isFeatured) ?? blogPosts[0]
  const gridPosts = featuredPost ? blogPosts.filter((post) => post.id !== featuredPost.id) : []

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Impact Blog</h1>
          <p className="text-xl opacity-90">
            Stories, insights, and updates from the world of conscious commerce
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary-600" />
            <p className="mt-4 text-lg text-gray-600">Loading blog posts...</p>
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
          </Card>
        ) : featuredPost ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden md:flex">
              {featuredPost.featuredImageUrl && (
                <div className="md:w-1/2 h-96 md:h-auto">
                  <img
                    src={featuredPost.featuredImageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4 w-fit">
                  Featured
                </span>
                <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredPost.authorName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatPostDate(featuredPost)}
                  </div>
                </div>
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all"
                >
                  Read More
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </Card>
          </motion.div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No published blog posts are available yet.</p>
          </Card>
        )}
      </section>

      {/* Blog Grid */}
      {!loading && !error && gridPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {gridPosts.map((post) => (
            <motion.div key={post.id} variants={staggerItem}>
              <Card className="h-full flex flex-col overflow-hidden">
                {post.featuredImageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.featuredImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold mb-3 w-fit">
                      {post.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-3 flex-1">{post.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.authorName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatPostDate(post)}
                    </div>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all text-sm"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg opacity-90 mb-8">
            Get the latest impact stories and conscious shopping tips delivered to your inbox
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
