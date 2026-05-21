import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AdminNotificationButtonProps {
  unreadCount?: number
}

export default function AdminNotificationButton({
  unreadCount = 0,
}: AdminNotificationButtonProps) {
  return (
    <Link
      to="/admin/notifications"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
      aria-label="View admin notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-xs font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
