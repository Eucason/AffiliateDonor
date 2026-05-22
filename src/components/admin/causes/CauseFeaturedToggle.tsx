import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

interface CauseFeaturedToggleProps {
  checked: boolean
  label: string
  description?: string
  onChange: (checked: boolean) => void
}

export default function CauseFeaturedToggle({
  checked,
  label,
  description,
  onChange,
}: CauseFeaturedToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border p-4 text-left transition',
        checked
          ? 'border-primary-300 bg-primary-50 text-primary-900'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border',
          checked ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300 bg-white text-transparent',
        )}
      >
        <Star className="h-3.5 w-3.5" />
      </span>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {description && <span className="mt-1 block text-sm text-gray-600">{description}</span>}
      </span>
    </button>
  )
}
