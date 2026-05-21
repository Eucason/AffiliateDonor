import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '@/components/organisms/AdminLayout'
import AdminEmptyState from '@/components/admin/shared/AdminEmptyState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'

export default function AdminSearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')?.trim()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Admin Search"
          description="Global search will cover donations, campaigns, donors, blog posts, products, messages, and transactions."
        />

        <AdminSectionCard title={query ? `Results for "${query}"` : 'Search all admin data'}>
          <AdminEmptyState
            title={query ? 'Search index is ready for implementation' : 'Enter a search term from the top bar'}
            description="This foundation branch wires the global search route and layout. Data adapters and ranked results will be added in the relevant feature branches."
            icon={<Search className="h-6 w-6" />}
          />
        </AdminSectionCard>
      </div>
    </AdminLayout>
  )
}
