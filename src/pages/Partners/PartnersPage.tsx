import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Card from '@/components/molecules/Card'
import { pageTransition, slideUp, staggerContainer, staggerItem } from '@/utils/motionVariants'

export default function PartnersPage() {
  const brandPartners = [
    { name: 'Amazon', category: 'E-commerce', logo: '🛒' },
    { name: 'Nike', category: 'Fashion & Sports', logo: '👟' },
    { name: 'Apple', category: 'Technology', logo: '🍎' },
    { name: 'Whole Foods', category: 'Groceries', logo: '🥬' },
    { name: 'Target', category: 'Retail', logo: '🎯' },
    { name: 'Best Buy', category: 'Electronics', logo: '📱' },
    { name: 'Patagonia', category: 'Outdoor Gear', logo: '🏔️' },
    { name: 'Etsy', category: 'Handmade Goods', logo: '🎨' },
  ]

  const causePartners = [
    {
      name: 'charity: water',
      mission: 'Clean water for everyone',
      impact: '1M+ people served',
      website: 'charitywater.org',
    },
    {
      name: 'Room to Read',
      mission: 'Education for children worldwide',
      impact: '23M children reached',
      website: 'roomtoread.org',
    },
    {
      name: 'World Wildlife Fund',
      mission: 'Wildlife and habitat conservation',
      impact: '100+ countries',
      website: 'worldwildlife.org',
    },
    {
      name: 'Feeding America',
      mission: 'Fighting hunger in the US',
      impact: '40M people helped annually',
      website: 'feedingamerica.org',
    },
  ]

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Partners</h1>
          <p className="text-xl opacity-90">
            Working together with brands and causes to create meaningful impact
          </p>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Brand Partners</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          We partner with leading brands across industries to offer you the best products while supporting great causes
        </p>
        
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {brandPartners.map((partner, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="p-8 text-center hover:shadow-xl transition-shadow">
                <div className="text-6xl mb-4">{partner.logo}</div>
                <h3 className="font-bold text-lg mb-1">{partner.name}</h3>
                <p className="text-sm text-gray-600">{partner.category}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Want to partner with us?</p>
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Become a Brand Partner
          </button>
        </div>
      </section>

      {/* Cause Partners */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Cause Partners</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Verified charitable organizations making real, measurable impact around the world
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {causePartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full">
                  <h3 className="text-2xl font-bold mb-3 text-primary-600">{partner.name}</h3>
                  <p className="text-gray-700 mb-2">{partner.mission}</p>
                  <p className="text-sm text-gray-600 mb-4">Impact: {partner.impact}</p>
                  <a
                    href={`https://${partner.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm font-semibold"
                  >
                    Visit website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Represent a charitable organization?</p>
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Apply as a Cause Partner
            </button>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why Partner With Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-3">Reach New Audiences</h3>
            <p className="text-gray-600">
              Access our growing community of 150K+ conscious consumers
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold mb-3">Brand Alignment</h3>
            <p className="text-gray-600">
              Showcase your commitment to social responsibility
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3">Impact Tracking</h3>
            <p className="text-gray-600">
              Transparent reporting on donations and outcomes
            </p>
          </Card>
        </div>
      </section>
    </motion.div>
  )
}
