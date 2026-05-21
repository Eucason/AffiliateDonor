import type { InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AdminSearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void
}

export default function AdminSearchInput({
  className,
  onClear,
  value,
  ...props
}: AdminSearchInputProps) {
  const hasValue = typeof value === 'string' && value.length > 0

  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        {...props}
        type="search"
        value={value}
        className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-9 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
      />
      {hasValue && onClear && (
        <button
          type="button"
          className="absolute right-2 top-1/2 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
