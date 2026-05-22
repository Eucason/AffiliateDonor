import { BellRing } from 'lucide-react'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import type { AdminNotificationPreference } from '@/types/adminSettings'

interface NotificationPreferencesPanelProps {
  preferences: AdminNotificationPreference[]
}

export default function NotificationPreferencesPanel({ preferences }: NotificationPreferencesPanelProps) {
  return (
    <AdminSectionCard title="Preference Snapshot" description="Current in-app and email alert coverage.">
      <div className="space-y-3">
        {preferences.map((preference) => (
          <div key={preference.key} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
            <div className="mt-0.5 rounded-lg bg-primary-50 p-2 text-primary-600">
              <BellRing className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">{preference.label}</p>
              <p className="mt-1 text-sm text-gray-600">{preference.description}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {preference.inApp ? 'In-app on' : 'In-app off'} / {preference.email ? 'Email on' : 'Email off'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AdminSectionCard>
  )
}
