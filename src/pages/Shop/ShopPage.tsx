import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ExternalLink } from 'lucide-react'
import Card from '@/components/molecules/Card'
import Button from '@/components/atoms/Button'
import { pageTransition, slideUp, staggerContainer, staggerItem } from '@/utils/motionVariants'

const mockProducts = [
  {
    id: 1,
    name: 'Eco-Friendly Water Bottle',
    brand: 'EcoLife',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
    category: 'Home',
    cause: 'Clean Water Initiative',
    donationPercent: 10,
    affiliateLink: 'https://amazon.com/example',
  },
  {
    id: 2,
    name: 'Organic Cotton T-Shirt',
    brand: 'GreenThread',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    category: 'Fashion',
    cause: 'Education for All',
    donationPercent: 15,
    affiliateLink: 'https://amazon.com/example',
  },
  {
    id: 3,
    name: 'Solar Power Bank',
    brand: 'SunCharge',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800',
    category: 'Electronics',
    cause: 'Climate Action',
    donationPercent: 12,
    affiliateLink: 'https://amazon.com/example',
  },
  {
    id: 4,
    name: 'Bamboo Cutlery Set',
    brand: 'EarthWare',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1606380783142-4193e1d26196?w=800',
    category: 'Home',
    cause: 'Wildlife Conservation',
    donationPercent: 10,
    affiliateLink: 'https://amazon.com/example',
  },
  {
    id: 5,
    name: 'Yoga Mat - Recycled Material',
    brand: 'ZenFit',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    category: 'Sports',
    cause: 'Healthcare Access',
    donationPercent: 8,
    affiliateLink: 'https://amazon.com/example',
  },
  {
    id: 6,
    name: 'Reusable Shopping Bags',
    brand: 'EcoCarry',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800',
    category: 'Home',
    cause: 'Ocean Cleanup',
    donationPercent: 20,
    affiliateLink: 'https://amazon.com/example',
  },
]

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Home', 'Fashion', 'Electronics', 'Sports']

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleShopClick = (product: typeof mockProducts[0]) => {
    // Track affiliate click
    window.open(product.affiliateLink, '_blank')
  }

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-secondary-600 to-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Shop & Donate</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Every purchase supports a cause. Shop from our curated selection of products from ethical brands.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <Card className="h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.donationPercent}% Donated
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-primary-600 mb-4">
                    Supports: {product.cause}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => handleShopClick(product)}
                    >
                      Shop Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Info Section */}
      <section className="bg-primary-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-6">
            When you shop through our affiliate links, we receive a commission from the retailer.
            A percentage of that commission is donated to the cause associated with each product.
            You pay the same price, but your purchase makes a difference!
          </p>
        </div>
      </section>
    </motion.div>
  )
}
