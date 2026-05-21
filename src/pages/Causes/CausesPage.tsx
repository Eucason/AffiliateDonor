import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import Card from '@/components/molecules/Card'
import Button from '@/components/atoms/Button'
import { pageTransition, slideUp, staggerContainer, staggerItem } from '@/utils/motionVariants'

const mockCauses = [
  {
    id: 1,
    name: 'Clean Water Initiative',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    raised: 125000,
    goal: 200000,
    supporters: 1234,
    description: 'Providing clean drinking water to communities in need',
  },
  {
    id: 2,
    name: 'Education for All',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    raised: 85000,
    goal: 150000,
    supporters: 892,
    description: 'Ensuring every child has access to quality education',
  },
  {
    id: 3,
    name: 'Wildlife Conservation',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
    raised: 95000,
    goal: 120000,
    supporters: 1567,
    description: 'Protecting endangered species and their habitats',
  },
  {
    id: 4,
    name: 'Hunger Relief',
    category: 'Humanitarian',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    raised: 165000,
    goal: 250000,
    supporters: 2341,
    description: 'Fighting hunger and malnutrition worldwide',
  },
  {
    id: 5,
    name: 'Healthcare Access',
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800',
    raised: 142000,
    goal: 200000,
    supporters: 1876,
    description: 'Bringing healthcare to underserved communities',
  },
  {
    id: 6,
    name: 'Climate Action',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
    raised: 78000,
    goal: 100000,
    supporters: 945,
    description: 'Taking action against climate change',
  },
]

export default function CausesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Environment', 'Education', 'Health', 'Humanitarian']

  const filteredCauses = mockCauses.filter((cause) => {
    const matchesSearch = cause.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || cause.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Browse Causes</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover and support verified causes making real change in the world
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
                  placeholder="Search causes..."
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

      {/* Causes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCauses.map((cause) => {
            const progress = (cause.raised / cause.goal) * 100

            return (
              <motion.div key={cause.id} variants={staggerItem}>
                <Card className="h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cause.image}
                      alt={cause.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                      {cause.category}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{cause.name}</h3>
                    <p className="text-gray-600 mb-4 flex-1">{cause.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            ${cause.raised.toLocaleString()} raised
                          </span>
                          <span className="font-semibold text-primary-600">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Goal: ${cause.goal.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-gray-600">
                          {cause.supporters.toLocaleString()} supporters
                        </span>
                        <Link to={`/cause/${cause.id}`}>
                          <Button variant="primary" size="sm">
                            Support
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </section>
    </motion.div>
  )
}
