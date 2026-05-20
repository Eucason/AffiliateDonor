import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight } from 'lucide-react'
import Card from '@/components/molecules/Card'
import { pageTransition, slideUp, staggerContainer, staggerItem } from '@/utils/motionVariants'

const blogPosts = [
  {
    id: 1,
    title: '10 Ways to Make Your Shopping More Impactful',
    excerpt: 'Discover simple strategies to maximize the positive impact of your everyday purchases...',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    author: 'Sarah Johnson',
    date: '2024-02-15',
    category: 'Tips & Guides',
  },
  {
    id: 2,
    title: 'How We Verify Our Charitable Partners',
    excerpt: 'Transparency is key. Learn about our rigorous vetting process for cause partners...',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    author: 'David Park',
    date: '2024-02-10',
    category: 'Impact',
  },
  {
    id: 3,
    title: 'The Rise of Conscious Consumerism',
    excerpt: 'Exploring the growing movement of shoppers who vote with their wallets...',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
    author: 'Emma Rodriguez',
    date: '2024-02-05',
    category: 'Trends',
  },
  {
    id: 4,
    title: 'Success Story: Clean Water Initiative',
    excerpt: 'See how your donations helped bring clean water to 5,000 families in Kenya...',
    image: 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=800',
    author: 'Michael Chen',
    date: '2024-01-28',
    category: 'Success Stories',
  },
  {
    id: 5,
    title: 'Understanding Affiliate Marketing for Good',
    excerpt: 'Breaking down how we turn commissions into charitable donations...',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    author: 'Sarah Johnson',
    date: '2024-01-20',
    category: 'Education',
  },
  {
    id: 6,
    title: 'Partner Spotlight: Education for All',
    excerpt: 'Meet one of our amazing cause partners making education accessible worldwide...',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    author: 'Emma Rodriguez',
    date: '2024-01-15',
    category: 'Partners',
  },
]

export default function BlogPage() {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden md:flex">
            <div className="md:w-1/2 h-96 md:h-auto">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4 w-fit">
                Featured
              </span>
              <h2 className="text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
              <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {blogPosts[0].author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(blogPosts[0].date).toLocaleDateString()}
                </div>
              </div>
              <button className="flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all">
                Read More
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.slice(1).map((post) => (
            <motion.div key={post.id} variants={staggerItem}>
              <Card className="h-full flex flex-col overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold mb-3 w-fit">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold mb-3 flex-1">{post.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all text-sm">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

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
