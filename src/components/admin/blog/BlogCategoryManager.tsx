import { Tag } from 'lucide-react'
import type { BlogCategory, BlogTag } from '@/types/blog'

interface BlogCategoryManagerProps {
  categories: BlogCategory[]
  tags: BlogTag[]
}

export default function BlogCategoryManager({ categories, tags }: BlogCategoryManagerProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary-600" />
        <div>
          <h2 className="text-base font-semibold text-gray-900">Categories & Tags</h2>
          <p className="mt-1 text-sm text-gray-600">Editorial taxonomy used by the blog workflow.</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Categories</h3>
          <div className="mt-2 space-y-2">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">No categories yet.</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2">
                  <span className="text-sm font-medium text-gray-800">{category.name}</span>
                  <span className="text-xs text-gray-500">{category.postCount}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tags</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <p className="text-sm text-gray-500">No tags yet.</p>
            ) : (
              tags.map((tag) => (
                <span key={tag.id} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {tag.name} ({tag.postCount})
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
