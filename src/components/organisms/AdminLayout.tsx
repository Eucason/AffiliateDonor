import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, LayoutDashboard, FileText, PlusCircle, LogOut, ChevronRight, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { pageTransition, slideUp } from '@/utils/motionVariants'

interface NavItem {
  name: string
  path: string
  icon: React.ReactNode
  children?: NavItem[]
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const location = useLocation()
  const { signOut } = useAuth()

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Blog Posts',
      path: '/admin/blogs',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: 'Create New',
      path: '/admin/blogs/new',
      icon: <PlusCircle className="w-5 h-5" />,
    },
  ]

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  const isActive = (path: string) => {
    return location.pathname === path ||
           (path !== '/admin' && location.pathname.startsWith(path))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0 transition-all duration-200 ease-in-out`}
      >
        <div className="p-4 border-b">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </Link>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${isActive(item.path) ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {expandedItems[item.name] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {expandedItems[item.name] && (
                      <ul className="ml-6 mt-2 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <Link
                              to={child.path}
                              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isActive(child.path) ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                              {child.icon}
                              <span>{child.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(item.path) ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}

            <li className="mt-8 pt-4 border-t">
              <button
                onClick={() => {
                  signOut()
                  window.location.href = '/'
                }}
                className="flex items-center gap-3 p-3 w-full text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </li>

            <li className="mt-4">
              <Link
                to="/blog"
                className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>View Public Blog</span>
              </Link>
            </li>
          </ul>
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {location.pathname === '/admin' ? 'Dashboard' :
               location.pathname === '/admin/blogs' ? 'Blog Posts' :
               location.pathname === '/admin/blogs/new' ? 'Create New Post' :
               location.pathname.startsWith('/admin/blogs/edit/') ? 'Edit Post' : 'Admin Panel'}
            </h1>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                View Website
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <motion.div {...pageTransition} variants={slideUp} className="p-4 md:p-6 lg:p-8">
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}