import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Heart } from 'lucide-react'

// 3D Cube Component
function Cube3D() {
  const cubeRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let animationId: number
    let angle = 0

    const animate = () => {
      angle += 0.5
      setRotation({
        x: Math.sin(angle * 0.01) * 30,
        y: angle,
      })
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="flex items-center justify-center h-80">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .cube-container {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="cube-container" style={{ perspective: '1200px' }}>
        <div
          ref={cubeRef}
          style={{
            width: '200px',
            height: '200px',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: 'transform 0.05s linear',
          }}
        >
          {/* Front */}
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '2px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translateZ(100px)',
              fontSize: '24px',
              color: 'white',
            }}
          >
            <Heart className="w-12 h-12" />
          </div>

          {/* Back */}
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: '2px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotateY(180deg) translateZ(100px)',
              color: 'white',
            }}
          >
            <span className="text-sm font-bold">Impact</span>
          </div>

          {/* Right */}
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: '2px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotateY(90deg) translateZ(100px)',
              color: 'white',
            }}
          >
            <span className="text-sm font-bold">Global</span>
          </div>

          {/* Left */}
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              border: '2px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotateY(-90deg) translateZ(100px)',
              color: 'white',
            }}
          >
            <span className="text-sm font-bold">Change</span>
          </div>

          {/* Top */}
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              border: '2px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotateX(90deg) translateZ(100px)',
              color: 'white',
            }}
          >
            <span className="text-sm font-bold">Together</span>
          </div>

          {/* Bottom */}
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              border: '2px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotateX(-90deg) translateZ(100px)',
              color: '#333',
            }}
          >
            <span className="text-sm font-bold">Donate</span>
          </div>
        </div>
      </div>
    </div>
  )
}

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
    <footer className="bg-gradient-to-b from-gray-950 to-gray-900 text-gray-200">
      {/* 3D Graphic Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            See Your Impact
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Every donation creates lasting change. Watch as our community transforms causes around the world.
          </p>
        </div>

        <Cube3D />

        <div className="mt-20 text-center">
          <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
            Start Donating Today
          </button>
        </div>
      </div>

      {/* Content Divider */}
      <div className="border-t border-gray-800" />

      {/* Main Footer Content - Spacious Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          {/* Brand Column - Extra Space */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              onClick={handleScrollToTop}
              className="flex items-center space-x-3 mb-8"
            >
              <img 
                src="/affiliatedonor_logo.png" 
                alt="AffiliateDonor" 
                className="h-10 w-auto"
              />
              <span className="text-2xl font-extrabold text-white">AffiliateDonor</span>
            </Link>
            <p className="text-base text-gray-300 leading-relaxed mb-10 max-w-sm">
              Shop with purpose, support causes that matter. Every purchase creates measurable impact for communities in need.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" aria-label="Facebook" className="p-3 rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="p-3 rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="p-3 rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-3 rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Causes Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8">Causes</h3>
            <ul className="space-y-4">
              {footerLinks.causes.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={handleScrollToTop}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={handleScrollToTop}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8">Support</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={handleScrollToTop}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section - Spacious */}
        <div className="bg-gray-800/50 rounded-2xl p-12 mb-24 border border-gray-700">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated on Global Impact</h3>
            <p className="text-gray-300 text-base mb-8">
              Get monthly impact reports, exclusive cause highlights, and special donor opportunities delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email address"
                className="flex-1 px-6 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
              />
              <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                <Mail className="w-5 h-5" />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Legal - Spacious */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-gray-400">
            <div>&copy; {new Date().getFullYear()} AffiliateDonor. All rights reserved.</div>
            <div className="flex items-center gap-8">
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
