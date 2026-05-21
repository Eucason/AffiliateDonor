import { Menu } from 'lucide-react'

interface AdminMobileNavProps {
  onOpen: () => void
}

export default function AdminMobileNav({ onOpen }: AdminMobileNavProps) {
  return (
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 md:hidden"
      onClick={onOpen}
      aria-label="Open admin navigation"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}
