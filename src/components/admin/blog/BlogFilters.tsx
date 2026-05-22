import { Search, SlidersHorizontal, X } from 'lucide-react'
import Button from '@/components/atoms/Button'
import type { BlogFiltersState, BlogSortOption, BlogStatus } from '@/types/blog'

interface BlogFiltersProps {
  filters: BlogFiltersState
  categories: string[]
  tags: string[]
  authors: string[]
  onChange: (filters: BlogFiltersState) => void
  onClear: () => void
}

const statusOptions: Array<{ value: BlogStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'archived', label: 'Archived' },
]

const sortOptions: Array<{ value: BlogSortOption; label: string }> = [
  { value: 'updated_desc', label: 'Recently updated' },
  { value: 'updated_asc', label: 'Oldest updated' },
  { value: 'published_desc', label: 'Recently published' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'title_desc', label: 'Title Z-A' },
  { value: 'views_desc', label: 'Most viewed' },
]

export default function BlogFilters({
  filters,
  categories,
  tags,
  authors,
  onChange,
  onClear,
}: BlogFiltersProps) {
  const updateFilter = <Key extends keyof BlogFiltersState>(key: Key, value: BlogFiltersState[Key]) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <SlidersHorizontal className="h-4 w-4 text-primary-600" />
        Filters
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-1 xl:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Search</span>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Title, slug, author, category, tags, excerpt"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</span>
          <select
            value={filters.status}
            onChange={(event) => updateFilter('status', event.target.value as BlogStatus | 'all')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Featured</span>
          <select
            value={filters.featured}
            onChange={(event) => updateFilter('featured', event.target.value as BlogFiltersState['featured'])}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">All posts</option>
            <option value="featured">Featured only</option>
            <option value="standard">Standard only</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Category</span>
          <select
            value={filters.category}
            onChange={(event) => updateFilter('category', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tag</span>
          <select
            value={filters.tag}
            onChange={(event) => updateFilter('tag', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Author</span>
          <select
            value={filters.author}
            onChange={(event) => updateFilter('author', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="">All authors</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">From</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => updateFilter('dateFrom', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">To</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => updateFilter('dateTo', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sort</span>
          <select
            value={filters.sort}
            onChange={(event) => updateFilter('sort', event.target.value as BlogSortOption)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onClear} className="gap-2">
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  )
}
