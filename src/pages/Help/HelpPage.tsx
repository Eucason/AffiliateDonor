import { motion } from 'framer-motion'
import { Search, HelpCircle, Book, MessageCircle } from 'lucide-react'
import Card from '@/components/molecules/Card'
import Button from '@/components/atoms/Button'
import { Link } from 'react-router-dom'
import { pageTransition, slideUp } from '@/utils/motionVariants'

export default function HelpPage() {
  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics of AffiliateDonor',
      articles: [
        'How to create an account',
        'Making your first donation',
        'Understanding affiliate links',
        'Setting up your profile',
      ],
    },
    {
      icon: HelpCircle,
      title: 'Donations & Payments',
      description: 'Everything about giving',
      articles: [
        'How donations work',
        'Payment methods accepted',
        'Tracking your donations',
        'Tax deductions and receipts',
      ],
    },
    {
      icon: MessageCircle,
      title: 'Shopping & Products',
      description: 'Find and purchase products',
      articles: [
        'How to shop with affiliate links',
        'Product recommendations',
        'Returns and refunds',
        'Brand partnerships',
      ],
    },
  ]

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Help Center</h1>
          <p className="text-xl opacity-90 mb-8">
            Find answers to your questions and get support
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/contact">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h3 className="font-bold text-lg mb-2">Contact Support</h3>
              <p className="text-gray-600 text-sm">Get help from our team</p>
            </Card>
          </Link>
          <Link to="/faqs">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h3 className="font-bold text-lg mb-2">FAQs</h3>
              <p className="text-gray-600 text-sm">Quick answers to common questions</p>
            </Card>
          </Link>
          <Link to="/how-it-works">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
              <Book className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h3 className="font-bold text-lg mb-2">How It Works</h3>
              <p className="text-gray-600 text-sm">Learn about our platform</p>
            </Card>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full">
                <div className="w-12 h-12 mb-4 rounded-lg bg-primary-100 flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.articles.map((article, i) => (
                    <li key={i}>
                      <a href="#" className="text-primary-600 hover:underline text-sm">
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Articles */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Articles</h2>
          <div className="space-y-4">
            {[
              'How do I track my donations?',
              'What payment methods do you accept?',
              'How does affiliate marketing work?',
              'Can I get a tax receipt for my donations?',
              'How do you verify charitable organizations?',
            ].map((question, index) => (
              <a
                key={index}
                href="#"
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="font-medium text-gray-900">{question}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
        <p className="text-gray-600 mb-8">
          Our support team is here to assist you
        </p>
        <Link to="/contact">
          <Button variant="primary" size="lg">
            Contact Support
          </Button>
        </Link>
      </section>
    </motion.div>
  )
}
