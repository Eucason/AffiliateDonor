import { motion } from 'framer-motion'
import { pageTransition, slideUp } from '@/utils/motionVariants'

export default function TermsPage() {
  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms of Service & Privacy Policy</h1>
          <p className="text-lg opacity-90">Last updated: February 15, 2024</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Terms of Service */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">Terms of Service</h2>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h3 className="text-xl font-bold mb-3">1. Acceptance of Terms</h3>
              <p>
                By accessing and using AffiliateDonor, you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">2. Description of Service</h3>
              <p>
                AffiliateDonor provides a platform that enables users to support charitable causes through
                their online shopping. We earn affiliate commissions from partner retailers and donate a
                percentage of those commissions to verified charitable organizations.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">3. User Accounts</h3>
              <p>
                You may be required to create an account to access certain features. You are responsible for
                maintaining the confidentiality of your account information and for all activities that occur
                under your account.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">4. Donations</h3>
              <p>
                Donations to charitable organizations are made by AffiliateDonor on behalf of users. We commit
                to donating the stated percentage of affiliate commissions to the associated causes. Donation
                amounts are estimates based on expected commissions and may vary.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">5. Affiliate Links</h3>
              <p>
                Our service includes affiliate links to third-party retailers. We receive compensation when users
                make purchases through these links. Prices are set by the retailers and are the same as purchasing
                directly.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">6. Limitation of Liability</h3>
              <p>
                AffiliateDonor is not responsible for the products, services, or policies of third-party retailers
                or charitable organizations. We act as a platform to facilitate connections and donations.
              </p>
            </section>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h3 className="text-xl font-bold mb-3">Information We Collect</h3>
              <p className="mb-2">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Name, email address, and account credentials</li>
                <li>Payment information (processed securely by third-party providers)</li>
                <li>Shopping and donation history</li>
                <li>Communications with our support team</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">How We Use Your Information</h3>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and track donations</li>
                <li>Send you updates about your impact and account</li>
                <li>Respond to your requests and provide customer support</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">Information Sharing</h3>
              <p>
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Service providers who assist in operating our platform</li>
                <li>Charitable organizations (aggregated donation data only)</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information.
                However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">Your Rights</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">Cookies</h3>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage, and assist
                in our marketing efforts. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">Contact Us</h3>
              <p>
                If you have questions about these terms or our privacy practices, please contact us at:
                <br />
                <span className="font-semibold">privacy@affiliatedonor.com</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
