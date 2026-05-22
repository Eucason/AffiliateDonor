interface BlogSeoPanelProps {
  title: string
  slug: string
  excerpt: string
  seoTitle?: string | null
  seoDescription?: string | null
  onChange: (field: 'seoTitle' | 'seoDescription', value: string) => void
}

export default function BlogSeoPanel({
  title,
  slug,
  excerpt,
  seoTitle,
  seoDescription,
  onChange,
}: BlogSeoPanelProps) {
  const previewTitle = seoTitle?.trim() || title || 'Untitled blog post'
  const previewDescription = seoDescription?.trim() || excerpt || 'No description provided yet.'

  return (
    <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900">SEO</h2>
        <p className="mt-1 text-sm text-gray-600">Search preview and metadata for public blog pages.</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">SEO Title</span>
          <input
            type="text"
            value={seoTitle ?? ''}
            onChange={(event) => onChange('seoTitle', event.target.value)}
            maxLength={70}
            placeholder={title || 'Search result title'}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
          <span className="mt-1 block text-xs text-gray-500">{(seoTitle ?? '').length}/70</span>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">SEO Description</span>
          <textarea
            value={seoDescription ?? ''}
            onChange={(event) => onChange('seoDescription', event.target.value)}
            maxLength={160}
            rows={3}
            placeholder={excerpt || 'Search result description'}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
          <span className="mt-1 block text-xs text-gray-500">{(seoDescription ?? '').length}/160</span>
        </label>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="truncate text-sm text-green-700">affiliatedonations.org/blog/{slug || 'post-slug'}</p>
          <p className="mt-1 line-clamp-1 text-base font-semibold text-blue-700">{previewTitle}</p>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{previewDescription}</p>
        </div>
      </div>
    </section>
  )
}
