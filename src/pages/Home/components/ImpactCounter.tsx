import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ImpactCounter() {
  const [donations, setDonations] = useState(2547893)

  useEffect(() => {
    const interval = setInterval(() => {
      setDonations((prev) => prev + Math.floor(Math.random() * 50))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-block"
    >
      <div className="glass px-8 py-4 rounded-2xl border-2 border-primary-200">
        <p className="text-sm text-gray-600 mb-1">Total Donations Raised</p>
        <motion.div
          key={donations}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-primary-600"
        >
          {formatNumber(donations)}
        </motion.div>
        <p className="text-xs text-gray-500 mt-1">Updated in real-time</p>
      </div>
    </motion.div>
  )
}
