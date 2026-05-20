import { Link } from 'react-router-dom'
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    causes: [
      { name: 'Browse Causes', path: '/causes' },
      { name: 'Shop & Donate', path: '/shop' },
      { name: 'Impact Dashboard', path: '/dashboard' },
      { name: 'How It Works', path: '/how-it-works' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Mission', path: '/mission' },
      { name: 'Partners', path: '/partners' },
      { name: 'Blog', path: '/blog' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Terms & Privacy', path: '/terms' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link
              to="/"
              onClick={handleScrollToTop}
              className="flex items-center space-x-2 mb-4"
            >
              <Heart className="w-8 h-8 text-primary-500 fill-primary-500" />
              <span className="text-xl font-bold text-white">AffiliateDonor</span>
            </Link>
            <p className="text-sm mb-4">
              Shop with purpose, support causes that matter. Every purchase makes a difference.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Causes */}
          <div>
            <h3 className="text-white font-semibold mb-4">Causes</h3>
            <ul className="space-y-2">
              {footerLinks.causes.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={handleScrollToTop}
                    className="text-sm hover:text-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={handleScrollToTop}
                    className="text-sm hover:text-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={handleScrollToTop}
                    className="text-sm hover:text-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold mb-2">Stay Updated</h3>
            <p className="text-sm mb-4">Get the latest news on causes and impact</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary-500 focus:outline-none"
              />
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AffiliateDonor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
