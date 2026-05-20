import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Share2, MapPin, Calendar, Users, TrendingUp } from 'lucide-react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { pageTransition, slideUp } from '@/utils/motionVariants'
import PaymentModal from '@/components/organisms/PaymentModal'

export default function CausePage() {
  const { id } = useParams()
  const [donationAmount, setDonationAmount] = useState('50')
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const presetAmounts = ['10', '25', '50', '100', '250']

  // Mock data
  const cause = {
    id,
    name: 'Clean Water Initiative',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    raised: 125000,
    goal: 200000,
    supporters: 1234,
    location: 'Global',
    startDate: '2024-01-15',
    description: `The Clean Water Initiative is dedicated to providing safe, clean drinking water to communities around the world. 
    Access to clean water is a fundamental human right, yet millions of people still lack this basic necessity.`,
    impact: [
      '50,000+ people served with clean water',
      '120 wells constructed in rural areas',
      '15 communities transformed',
      '95% sustainability rate',
    ],
    updates: [
      {
        date: '2024-02-15',
        title: 'New Well Completed in Rural Village',
        content: 'We successfully completed our 120th well, providing clean water to 500 families.',
      },
      {
        date: '2024-01-28',
        title: 'Milestone: 50,000 People Served',
        content: 'Thanks to your support, we have now provided clean water to over 50,000 people!',
      },
    ],
  }

  const progress = (cause.raised / cause.goal) * 100

  const handleDonate = () => {
    setIsPaymentOpen(true)
  }

  return (
    <>
      <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
        {/* Hero Image */}
        <div className="relative h-96 overflow-hidden">
          <img src={cause.image} alt={cause.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-7xl mx-auto">
              <span className="inline-block px-4 py-1 bg-primary-600 rounded-full text-sm mb-4">
                {cause.category}
              </span>
              <h1 className="text-5xl font-bold mb-4">{cause.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {cause.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Started {new Date(cause.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {cause.supporters.toLocaleString()} supporters
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">About This Cause</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {cause.description}
                </p>
              </div>

              {/* Impact */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Our Impact</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {cause.impact.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg"
                    >
                      <TrendingUp className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Updates */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Recent Updates</h2>
                <div className="space-y-6">
                  {cause.updates.map((update, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4">
                      <div className="text-sm text-gray-500 mb-1">
                        {new Date(update.date).toLocaleDateString()}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{update.title}</h3>
                      <p className="text-gray-600">{update.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Donation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-xl shadow-lg sticky top-24">
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-3xl font-bold text-primary-600">
                      ${cause.raised.toLocaleString()}
                    </span>
                    <span className="text-gray-600">
                      of ${cause.goal.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{progress.toFixed(0)}% funded</p>
                </div>

                {/* Donation Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {presetAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setDonationAmount(amount)}
                          className={`py-2 rounded-lg border-2 transition-all ${
                            donationAmount === amount
                              ? 'border-primary-500 bg-primary-50 text-primary-600'
                              : 'border-gray-300 hover:border-primary-300'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Custom amount"
                    />
                  </div>

                  <Button variant="primary" className="w-full" onClick={handleDonate}>
                    <Heart className="w-5 h-5 mr-2" />
                    Donate ${donationAmount}
                  </Button>

                  <button className="w-full py-3 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share This Cause
                  </button>
                </div>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Supporters</span>
                    <span className="font-semibold">{cause.supporters.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Active</span>
                    <span className="font-semibold">
                      {Math.floor(
                        (Date.now() - new Date(cause.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={parseFloat(donationAmount)}
      />
    </>
  )
}
