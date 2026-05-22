import { History } from 'lucide-react'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminTimeline from '@/components/admin/shared/AdminTimeline'
import { formatAdminDateTime } from '@/utils/adminFormatters'
import type { AdminAuditLog } from '@/types/adminAudit'

interface ActivityTimelineProps {
  logs: AdminAuditLog[]
}

export default function ActivityTimeline({ logs }: ActivityTimelineProps) {
  return (
    <AdminSectionCard title="Activity Timeline" description="Recent admin actions across settings, approvals, content, and donations.">
      <AdminTimeline
        items={logs.slice(0, 6).map((log) => ({
          id: log.id,
          title: `${log.actor} ${log.action.replace(/_/g, ' ')}`,
          description: `${log.entityLabel} - ${log.metadata.description}`,
          timestamp: formatAdminDateTime(log.timestamp),
          icon: <History className="h-4 w-4" />,
        }))}
      />
    </AdminSectionCard>
  )
}
