import { motion } from 'framer-motion'
import { Search, ShoppingCart, Heart, TrendingUp, Check } from 'lucide-react'
import Card from '@/components/molecules/Card'
import Button from '@/components/atoms/Button'
import { Link } from 'react-router-dom'
import { pageTransition, slideUp, staggerContainer, staggerItem } from '@/utils/motionVariants'

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: 'Browse Products & Causes',
      description: 'Explore thousands of products from top brands and discover causes that matter to you.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: ShoppingCart,
      title: 'Shop as Usual',
      description: 'Purchase products through our affiliate links. You pay the same price—no extra cost!',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: Heart,
      title: 'We Donate for You',
      description: 'A percentage of our commission goes directly to the cause associated with your purchase.',
      color: 'from-red-500 to-pink-600',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Impact',
      description: 'See real-time updates on how your shopping is making a difference around the world.',
      color: 'from-green-500 to-emerald-600',
    },
  ]

  const benefits = [
    'No extra cost to you - same prices as shopping directly',
    'Verified charitable organizations',
    'Real-time impact tracking',
    'Support multiple causes with one platform',
    'Secure payment processing',
    'Transparent donation tracking',
  ]

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-xl opacity-90">
            Transform your everyday shopping into powerful donations—at no extra cost to you
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="h-full p-6 text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-300 to-transparent z-10" />
                )}
                <div className="relative">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose AffiliateDonor?</h2>
            <p className="text-xl text-gray-600">
              The easiest way to make a difference while shopping online
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Flow */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">See It In Action</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="bg-blue-100 w-full h-40 rounded-lg mb-4 flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">You Shop</h3>
              <p className="text-gray-600 text-sm">
                Purchase a $50 eco-friendly water bottle through our link
              </p>
            </Card>

            <Card className="p-6">
              <div className="bg-purple-100 w-full h-40 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600">$5</p>
                  <p className="text-sm text-gray-600 mt-2">Commission</p>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">We Earn</h3>
              <p className="text-gray-600 text-sm">
                The retailer pays us a $5 commission for referring you
              </p>
            </Card>

            <Card className="p-6">
              <div className="bg-red-100 w-full h-40 rounded-lg mb-4 flex items-center justify-center">
                <Heart className="w-16 h-16 text-red-600 fill-current" />
              </div>
              <h3 className="font-bold text-lg mb-2">Cause Receives</h3>
              <p className="text-gray-600 text-sm">
                We donate $2.50 (50% of commission) to Clean Water Initiative
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Making an Impact?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of shoppers who are changing the world with every purchase
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Start Shopping
              </Button>
            </Link>
            <Link to="/causes">
              <Button variant="outline" size="lg">
                Browse Causes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
