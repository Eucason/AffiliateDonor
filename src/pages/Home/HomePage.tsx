import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, TrendingUp, Users, ArrowRight } from 'lucide-react'
import Button from '@/components/atoms/Button'
import Card from '@/components/molecules/Card'
import { slideUp, staggerContainer, staggerItem, pageTransition } from '@/utils/motionVariants'
import Hero3D from './components/Hero3D'
import ImpactCounter from './components/ImpactCounter'

export default function HomePage() {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Shop with Purpose',
      description: 'Browse thousands of products from top brands and support causes you care about.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Heart,
      title: 'Make a Difference',
      description: 'Every purchase generates donations that go directly to verified charitable causes.',
      color: 'from-red-500 to-pink-600',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Impact',
      description: 'See real-time updates on how your shopping is changing lives around the world.',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Users,
      title: 'Join a Community',
      description: 'Connect with millions of shoppers who believe in the power of purpose-driven commerce.',
      color: 'from-purple-500 to-indigo-600',
    },
  ]

  const stats = [
    { value: '$2.5M+', label: 'Donated to Causes' },
    { value: '150K+', label: 'Active Donors' },
    { value: '500+', label: 'Partner Brands' },
    { value: '1,200+', label: 'Supported Causes' },
  ]

  return (
    <motion.div {...pageTransition} variants={slideUp}>
      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <Hero3D />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent animate-gradient">
              Shop. Donate. Impact.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your everyday purchases into powerful donations for causes that matter.
              Every click makes a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/causes">
                <Button variant="outline" size="lg">
                  Browse Causes
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Animated Impact Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <ImpactCounter />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Making an impact has never been easier. Here's how AffiliateDonor works.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="h-full p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/how-it-works">
              <Button variant="primary" size="lg">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Causes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Causes</h2>
            <p className="text-xl text-gray-600">
              Support these amazing organizations making a real difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-500" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Featured Cause {i}</h3>
                  <p className="text-gray-600 mb-4">
                    Making a difference through sustainable initiatives and community support.
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-semibold">75%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '75%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                      />
                    </div>
                  </div>
                  <Link to={`/cause/${i}`}>
                    <Button variant="primary" className="w-full">
                      Support This Cause
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/causes">
              <Button variant="outline" size="lg">
                View All Causes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of shoppers who are changing the world, one purchase at a time.
            </p>
            <Link to="/shop">
              <Button variant="secondary" size="lg">
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
