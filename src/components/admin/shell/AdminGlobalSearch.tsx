import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput'
import { cn } from '@/utils/cn'

interface AdminGlobalSearchProps {
  className?: string
}

export default function AdminGlobalSearch({ className }: AdminGlobalSearchProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedQuery = query.trim()
    const searchPath = trimmedQuery
      ? `/admin/search?query=${encodeURIComponent(trimmedQuery)}`
      : '/admin/search'

    navigate(searchPath)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('w-full max-w-md', className)}>
      <AdminSearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery('')}
        placeholder="Search donations, donors, campaigns..."
        aria-label="Search admin"
      />
    </form>
  )
}
