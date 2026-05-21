import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface AdminTab {
  label: string
  path: string
}

interface AdminTabsProps {
  tabs: AdminTab[]
}

export default function AdminTabs({ tabs }: AdminTabsProps) {
  const location = useLocation()

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                'whitespace-nowrap border-b-2 px-1 py-3 text-sm font-semibold transition',
                isActive
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
