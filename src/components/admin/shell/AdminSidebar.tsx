import {
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileText,
  HeartHandshake,
  History,
  Image,
  LayoutDashboard,
  LayoutPanelTop,
  Mail,
  PlusCircle,
  Search,
  Settings,
  ShoppingBag,
  Tags,
  Target,
  Users,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { adminNavigationGroups } from '@/config/adminNavigation'
import { hasAdminPermission } from '@/config/adminPermissions'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/utils/cn'
import type { AdminNavIcon, AdminNavigationItem } from '@/types/admin'

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

const iconMap: Record<AdminNavIcon, LucideIcon> = {
  LayoutDashboard,
  HeartHandshake,
  Target,
  ClipboardCheck,
  FileText,
  PlusCircle,
  PanelsTopLeft: LayoutPanelTop,
  Images: Image,
  Users,
  Mail,
  ExternalLink,
  ShoppingBag,
  Tags,
  BarChart3,
  Download,
  Bell,
  Settings,
  History,
  Search,
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const location = useLocation()
  const { user } = useAuth()

  const toggleGroup = (label: string) => {
    setExpandedGroups((current) => ({
      ...current,
      [label]: !current[label],
    }))
  }

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
          aria-label="Close admin navigation overlay"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-200 md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <Link to="/admin" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
              AD
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">AffiliateDonor</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
            onClick={onClose}
            aria-label="Close admin navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {adminNavigationGroups.map((group) => {
            const visibleItems = group.items.filter((item) => canViewItem(item, user))
            if (visibleItems.length === 0) {
              return null
            }

            const isGroupActive = visibleItems.some((item) => isItemActive(item, location.pathname))
            const isExpanded = expandedGroups[group.label] ?? isGroupActive

            return (
              <section key={group.label}>
                <button
                  type="button"
                  className="mb-2 flex w-full items-center justify-between px-2 text-xs font-semibold uppercase tracking-wide text-gray-400"
                  onClick={() => toggleGroup(group.label)}
                >
                  {group.label}
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>

                {isExpanded && (
                  <ul className="space-y-1">
                    {visibleItems.map((item) => (
                      <AdminSidebarItem
                        key={item.path}
                        item={item}
                        pathname={location.pathname}
                        onNavigate={onClose}
                        user={user}
                      />
                    ))}
                  </ul>
                )}
              </section>
            )
          })}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            onClick={onClose}
          >
            <ExternalLink className="h-4 w-4" />
            View Website
          </Link>
        </div>
      </aside>
    </>
  )
}

function AdminSidebarItem({
  item,
  pathname,
  onNavigate,
  user,
}: {
  item: AdminNavigationItem
  pathname: string
  onNavigate: () => void
  user: User | null
}) {
  const [open, setOpen] = useState(isItemActive(item, pathname))
  const Icon = iconMap[item.icon]
  const active = isActivePath(item.path, pathname)
  const visibleChildren = item.children?.filter((child) => canViewItem(child, user)) ?? []
  const hasChildren = visibleChildren.length > 0

  if (hasChildren) {
    return (
      <li>
        <button
          type="button"
          className={cn(
            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition',
            active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          )}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            {item.label}
          </span>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {open && (
          <ul className="mt-1 space-y-1 pl-8">
            {visibleChildren.map((child) => (
              <AdminSidebarItem
                key={child.path}
                item={child}
                pathname={pathname}
                onNavigate={onNavigate}
                user={user}
              />
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li>
      <Link
        to={item.path}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
          active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        )}
        aria-current={active ? 'page' : undefined}
        onClick={onNavigate}
      >
        <Icon className="h-5 w-5" />
        {item.label}
      </Link>
    </li>
  )
}

function isItemActive(item: AdminNavigationItem, pathname: string): boolean {
  return isActivePath(item.path, pathname) || Boolean(item.children?.some((child) => isItemActive(child, pathname)))
}

function isActivePath(path: string, pathname: string): boolean {
  return pathname === path || (path !== '/admin' && pathname.startsWith(`${path}/`))
}

function canViewItem(item: AdminNavigationItem, user: User | null): boolean {
  const canViewSelf = !item.permission || hasAdminPermission(user, item.permission)
  const visibleChildren = item.children?.some((child) => canViewItem(child, user)) ?? false

  return canViewSelf || visibleChildren
}
