import { motion } from 'framer-motion'
import { TrendingUp, Heart, ShoppingBag, Award, DollarSign, Users } from 'lucide-react'
import Card from '@/components/molecules/Card'
import Button from '@/components/atoms/Button'
import { useAuth } from '@/context/AuthContext'
import { pageTransition, slideUp, staggerContainer, staggerItem } from '@/utils/motionVariants'

export default function DashboardPage() {
  const { user, signIn } = useAuth()

  // Mock user data
  const userData = {
    totalDonations: 450.75,
    totalPurchases: 12,
    causesSupported: 5,
    impactScore: 892,
    recentActivity: [
      { date: '2024-02-15', action: 'Donated $50 to Clean Water Initiative', cause: 'Environment' },
      { date: '2024-02-10', action: 'Purchased Eco-Friendly Water Bottle', amount: 24.99 },
      { date: '2024-02-05', action: 'Donated $25 to Education for All', cause: 'Education' },
    ],
    supportedCauses: [
      { name: 'Clean Water Initiative', donated: 150, progress: 75 },
      { name: 'Education for All', donated: 125, progress: 62 },
      { name: 'Wildlife Conservation', donated: 100, progress: 83 },
      { name: 'Hunger Relief', donated: 75.75, progress: 45 },
    ],
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Sign In to View Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Track your impact, view donation history, and manage your profile
          </p>
          <Button variant="primary" className="w-full">
            Sign In with Email
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Impact Dashboard</h1>
          <p className="text-lg opacity-90">Track your journey of making a difference</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <motion.div variants={staggerItem}>
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Donations</p>
              <p className="text-3xl font-bold text-gray-900">${userData.totalDonations}</p>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Purchases</p>
              <p className="text-3xl font-bold text-gray-900">{userData.totalPurchases}</p>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Causes Supported</p>
              <p className="text-3xl font-bold text-gray-900">{userData.causesSupported}</p>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Impact Score</p>
              <p className="text-3xl font-bold text-gray-900">{userData.impactScore}</p>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Supported Causes */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Your Supported Causes</h2>
              <div className="space-y-6">
                {userData.supportedCauses.map((cause, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{cause.name}</h3>
                      <span className="text-primary-600 font-bold">${cause.donated}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cause.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{cause.progress}% of your goal</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {userData.recentActivity.map((activity, index) => (
                  <div key={index} className="border-l-2 border-primary-500 pl-4">
                    <p className="text-xs text-gray-500 mb-1">{activity.date}</p>
                    <p className="text-sm text-gray-900">{activity.action}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Impact Visualization */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Your Impact</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-semibold">45 People</p>
                    <p className="text-xs text-gray-600">Directly helped</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-semibold">Top 10%</p>
                    <p className="text-xs text-gray-600">Of all donors</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
