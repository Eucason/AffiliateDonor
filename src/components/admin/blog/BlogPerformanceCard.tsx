import { BarChart3, Clock, Eye, MousePointerClick } from 'lucide-react'
import type { BlogPost } from '@/types/blog'

interface BlogPerformanceCardProps {
  posts: BlogPost[]
}

const numberFormatter = new Intl.NumberFormat('en-US')

export default function BlogPerformanceCard({ posts }: BlogPerformanceCardProps) {
  const totalViews = posts.reduce((sum, post) => sum + (post.performance?.viewCount ?? 0), 0)
  const totalConversions = posts.reduce((sum, post) => sum + (post.performance?.conversionAssistCount ?? 0), 0)
  const publishedPosts = posts.filter((post) => post.status === 'published')
  const averageReadTime =
    posts.length > 0
      ? Math.round(posts.reduce((sum, post) => sum + (post.readTimeMinutes ?? 1), 0) / posts.length)
      : 0
  const topPost = [...posts].sort(
    (first, second) => (second.performance?.viewCount ?? 0) - (first.performance?.viewCount ?? 0),
  )[0]

  const metrics = [
    {
      label: 'Views',
      value: numberFormatter.format(totalViews),
      icon: <Eye className="h-4 w-4" />,
    },
    {
      label: 'Published',
      value: numberFormatter.format(publishedPosts.length),
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: 'Avg. read',
      value: `${averageReadTime} min`,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: 'Assists',
      value: numberFormatter.format(totalConversions),
      icon: <MousePointerClick className="h-4 w-4" />,
    },
  ]

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Content Performance</h2>
          <p className="mt-1 text-sm text-gray-600">Basic publishing signals for report integration.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span className="text-primary-600">{metric.icon}</span>
              {metric.label}
            </div>
            <p className="mt-2 text-xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {topPost && (
        <div className="mt-4 rounded-lg border border-gray-100 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Top post</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{topPost.title}</p>
          <p className="mt-1 text-xs text-gray-500">
            {numberFormatter.format(topPost.performance?.viewCount ?? 0)} views
          </p>
        </div>
      )}
    </section>
  )
}
