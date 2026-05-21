import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/admin/shell/AdminSidebar'
import AdminTopBar from '@/components/admin/shell/AdminTopBar'
import { pageTransition, slideUp } from '@/utils/motionVariants'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-x-hidden bg-gray-50">
          <motion.div {...pageTransition} variants={slideUp} className="p-4 md:p-6 lg:p-8">
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
