import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import Card from '@/components/molecules/Card'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import { pageTransition, slideUp } from '@/utils/motionVariants'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    alert('Message sent successfully!')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl opacity-90">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <p className="text-gray-600 text-sm">support@affiliatedonor.com</p>
                  <p className="text-gray-600 text-sm">partnerships@affiliatedonor.com</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Phone</h3>
                  <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                  <p className="text-gray-600 text-sm">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Office</h3>
                  <p className="text-gray-600 text-sm">123 Impact Street</p>
                  <p className="text-gray-600 text-sm">San Francisco, CA 94105</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary-50 border-primary-200">
              <h3 className="font-bold mb-2">Response Time</h3>
              <p className="text-sm text-gray-600">
                We typically respond within 24 hours during business days. For urgent matters,
                please call our support line.
              </p>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
