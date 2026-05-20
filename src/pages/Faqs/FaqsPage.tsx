import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { pageTransition, slideUp } from '@/utils/motionVariants'

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is AffiliateDonor?',
        a: 'AffiliateDonor is a platform that transforms your everyday online shopping into charitable donations. When you shop through our affiliate links, we receive a commission from retailers and donate a percentage to verified causes.',
      },
      {
        q: 'Is it really free?',
        a: 'Yes! You pay the exact same price as shopping directly from the retailer. We earn a commission from the retailer for referring you, and we donate a portion of that commission to charitable causes.',
      },
      {
        q: 'How do I get started?',
        a: 'Simply create a free account, browse products or causes, and shop through our affiliate links. Your donations are tracked automatically in your dashboard.',
      },
    ],
  },
  {
    category: 'Donations',
    questions: [
      {
        q: 'How much of my purchase goes to charity?',
        a: 'The donation amount varies by product and brand, but typically ranges from 5-20% of the commission we receive. The exact percentage is displayed on each product.',
      },
      {
        q: 'Can I choose which cause to support?',
        a: 'Yes! Each product is associated with a specific cause. You can browse by cause or select products that support causes you care about.',
      },
      {
        q: 'Are donations tax-deductible?',
        a: 'Since donations are made on your behalf by AffiliateDonor, they are not directly tax-deductible for you. However, we provide annual giving statements for your records.',
      },
      {
        q: 'How do I track my donations?',
        a: 'Your dashboard shows real-time updates on all your donations, including amounts, causes supported, and impact metrics.',
      },
    ],
  },
  {
    category: 'Shopping',
    questions: [
      {
        q: 'What stores can I shop at?',
        a: 'We partner with over 500 brands and retailers across various categories including fashion, electronics, home goods, and more. Check our Shop page for the full list.',
      },
      {
        q: 'How do affiliate links work?',
        a: 'When you click a product link on our site, you\'re redirected to the retailer\'s website with a unique tracking code. This allows us to receive a commission on your purchase.',
      },
      {
        q: 'What about returns and refunds?',
        a: 'Returns and refunds are handled directly by the retailer according to their policies. If a purchase is refunded, the corresponding donation is also reversed.',
      },
    ],
  },
  {
    category: 'Causes',
    questions: [
      {
        q: 'How do you verify charitable organizations?',
        a: 'We conduct thorough vetting of all partner causes, including checking their 501(c)(3) status, reviewing financial reports, and assessing their impact metrics.',
      },
      {
        q: 'How often are donations sent to causes?',
        a: 'Donations are aggregated and sent to causes on a monthly basis to ensure efficiency and transparency.',
      },
      {
        q: 'Can I suggest a new cause?',
        a: 'Absolutely! Use our contact form to suggest causes you\'d like to see on the platform. We review all submissions.',
      },
    ],
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:text-primary-600 transition-colors"
      >
        <span className="font-semibold pr-8">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl opacity-90 mb-8">
            Find quick answers to common questions about AffiliateDonor
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {faqs.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-primary-600">{category.category}</h2>
              <div>
                {category.questions.map((faq, i) => (
                  <FaqItem key={i} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <button className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Contact Support
          </button>
        </div>
      </section>
    </motion.div>
  )
}
