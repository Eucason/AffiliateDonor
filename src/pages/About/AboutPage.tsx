import { motion } from 'framer-motion'
import { Heart, Target, Users, Award } from 'lucide-react'
import Card from '@/components/molecules/Card'
import { pageTransition, slideUp, staggerContainer, staggerItem } from '@/utils/motionVariants'

export default function AboutPage() {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Former nonprofit director passionate about combining commerce and social good.',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Tech innovator with 15 years building platforms that make a difference.',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of Partnerships',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Building relationships with brands and causes to maximize impact.',
    },
    {
      name: 'David Park',
      role: 'Impact Director',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Ensuring transparency and measuring real-world impact of donations.',
    },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Purpose-Driven',
      description: 'Every decision we make is guided by our mission to create positive change.',
    },
    {
      icon: Target,
      title: 'Transparency',
      description: 'Complete visibility into where donations go and the impact they create.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a movement of conscious consumers making a difference together.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to the highest standards in everything we do.',
    },
  ]

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About AffiliateDonor</h1>
          <p className="text-xl opacity-90">
            We're on a mission to make giving back as easy as online shopping
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-lg text-gray-600">
            <p>
              AffiliateDonor was born from a simple idea: what if your everyday shopping could change the world?
              In 2023, our founders realized that billions of dollars in affiliate commissions were being generated
              every year, but none of it was going to charitable causes.
            </p>
            <p>
              We saw an opportunity to create a platform where consumers could shop from their favorite brands,
              pay the same prices they always do, and automatically support causes they care about—all without
              spending an extra penny.
            </p>
            <p>
              Today, we've grown into a community of over 150,000 conscious consumers who have collectively
              raised over $2.5 million for verified charitable organizations around the world. And we're just
              getting started.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="p-6 text-center h-full">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {team.map((member, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary-600 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">$2.5M+</div>
              <div className="text-lg opacity-90">Donated</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">150K+</div>
              <div className="text-lg opacity-90">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Partner Brands</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1,200+</div>
              <div className="text-lg opacity-90">Causes</div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
