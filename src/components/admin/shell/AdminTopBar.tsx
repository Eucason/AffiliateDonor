import { ExternalLink, Menu } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { resolveAdminRouteMeta } from '@/config/adminRoutes'
import AdminBreadcrumbs from './AdminBreadcrumbs'
import AdminGlobalSearch from './AdminGlobalSearch'
import AdminNotificationButton from './AdminNotificationButton'
import AdminProfileDropdown from './AdminProfileDropdown'

interface AdminTopBarProps {
  onMenuClick: () => void
}

export default function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  const location = useLocation()
  const routeMeta = resolveAdminRouteMeta(location.pathname)

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 md:hidden"
            onClick={onMenuClick}
            aria-label="Open admin navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <AdminBreadcrumbs />
            <h1 className="truncate text-lg font-semibold text-gray-900 md:mt-1">
              {routeMeta.title}
            </h1>
          </div>
        </div>

        <div className="hidden flex-1 justify-center xl:flex">
          <AdminGlobalSearch />
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <Link
            to="/"
            className="hidden h-10 items-center gap-2 rounded-lg bg-primary-600 px-3 text-sm font-semibold text-white transition hover:bg-primary-700 lg:inline-flex"
          >
            View Website
            <ExternalLink className="h-4 w-4" />
          </Link>
          <AdminNotificationButton />
          <AdminProfileDropdown />
        </div>
      </div>

      <div className="mt-3 xl:hidden">
        <AdminGlobalSearch className="max-w-none" />
      </div>
    </header>
  )
}
