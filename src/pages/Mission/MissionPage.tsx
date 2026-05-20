import { motion } from 'framer-motion'
import { Globe, Heart, Sparkles, Target } from 'lucide-react'
import { pageTransition, slideUp } from '@/utils/motionVariants'

export default function MissionPage() {
  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero with Video Background */}
      <section className="relative h-96 bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920')] bg-cover bg-center" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl font-bold mb-6">Our Mission</h1>
          <p className="text-2xl max-w-3xl mx-auto">
            Empowering conscious consumers to create lasting change through everyday purchases
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-12 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Target className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-2xl text-center leading-relaxed text-gray-700">
            We believe that <span className="font-bold text-primary-600">every purchase has the power to change the world</span>.
            Our mission is to transform the $4 trillion e-commerce industry into a force for good, making charitable giving
            an effortless part of everyday life.
          </p>
        </motion.div>
      </section>

      {/* Goals */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">What We're Working Toward</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">$100M in Donations</h3>
              <p className="text-gray-600">
                Channeling $100 million to verified charitable causes by 2028, creating measurable impact worldwide.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1M Active Donors</h3>
              <p className="text-gray-600">
                Building a community of one million conscious consumers making giving back a daily habit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Zero-Friction Giving</h3>
              <p className="text-gray-600">
                Making charitable giving so seamless that it becomes the default for online shopping everywhere.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-8 text-center">Our Vision for the Future</h2>
          <div className="space-y-6 text-lg text-gray-600">
            <p>
              We envision a world where commerce and compassion are inseparable—where every transaction,
              no matter how small, contributes to solving the world's biggest challenges.
            </p>
            <p>
              In this future, conscious consumerism isn't a niche movement; it's the norm. Brands compete
              not just on price and quality, but on the positive impact they enable. And consumers make
              purchasing decisions knowing that their money is doing good in the world.
            </p>
            <p>
              AffiliateDonor is building the infrastructure to make this vision a reality, one purchase
              at a time. Join us in creating a more generous, connected, and compassionate world.
            </p>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Be Part of the Mission</h2>
          <p className="text-xl mb-8 opacity-90">
            Every shopper, every purchase, every donation brings us closer to our goal
          </p>
          <button className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Start Shopping with Purpose
          </button>
        </div>
      </section>
    </motion.div>
  )
}
