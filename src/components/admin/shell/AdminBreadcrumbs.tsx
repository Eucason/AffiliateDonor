import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { resolveAdminRouteMeta } from '@/config/adminRoutes'

export default function AdminBreadcrumbs() {
  const location = useLocation()
  const { breadcrumbs } = resolveAdminRouteMeta(location.pathname)

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-sm text-gray-500 md:flex">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <span key={`${breadcrumb.label}-${index}`} className="flex items-center gap-1">
            {breadcrumb.path && !isLast ? (
              <Link to={breadcrumb.path} className="font-medium transition hover:text-primary-600">
                {breadcrumb.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-gray-900' : undefined}>
                {breadcrumb.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </span>
        )
      })}
    </nav>
  )
}
