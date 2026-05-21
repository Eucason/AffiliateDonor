import { useState } from 'react'
import { ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AdminProfileDropdown() {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const metadata = user?.user_metadata as Record<string, unknown> | undefined
  const displayName =
    stringValue(metadata?.name) ?? stringValue(metadata?.full_name) ?? user?.email ?? 'Admin'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 text-sm font-medium text-gray-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserCircle className="h-6 w-6" />
        <span className="hidden max-w-36 truncate lg:inline">{displayName}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
            {user?.email && <p className="truncate text-xs text-gray-500">{user.email}</p>}
          </div>
          <Link
            to="/admin/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Account Settings
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : undefined
}
