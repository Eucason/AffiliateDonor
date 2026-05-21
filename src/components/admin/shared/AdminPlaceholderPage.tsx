import { Construction } from 'lucide-react'
import AdminLayout from '@/components/organisms/AdminLayout'
import AdminEmptyState from './AdminEmptyState'
import AdminPageHeader from './AdminPageHeader'

interface AdminPlaceholderPageProps {
  title: string
  description?: string
}

export default function AdminPlaceholderPage({ title, description }: AdminPlaceholderPageProps) {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader title={title} description={description} />
        <AdminEmptyState
          title={`${title} layout is ready`}
          description="This route is part of the admin foundation. A later feature branch will populate the page with data, controls, and workflows."
          icon={<Construction className="h-6 w-6" />}
        />
      </div>
    </AdminLayout>
  )
}
