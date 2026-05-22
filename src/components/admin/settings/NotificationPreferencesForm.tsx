import Button from '@/components/atoms/Button'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import type { AdminNotificationPreference, AdminNotificationPreferenceKey } from '@/types/adminSettings'

interface NotificationPreferencesFormProps {
  preferences: AdminNotificationPreference[]
  disabled?: boolean
  onChange: (
    key: AdminNotificationPreferenceKey,
    channel: keyof Pick<AdminNotificationPreference, 'email' | 'inApp'>,
    value: boolean,
  ) => void
  onReset: () => void
}

export default function NotificationPreferencesForm({
  preferences,
  disabled = false,
  onChange,
  onReset,
}: NotificationPreferencesFormProps) {
  return (
    <AdminSectionCard
      title="Notification Preferences"
      description="Choose which operational alerts should appear in-app or by email."
      actions={<Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={disabled}>Reset Section</Button>}
    >
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Alert</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">In-app</th>
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {preferences.map((preference) => (
              <tr key={preference.key}>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-gray-900">{preference.label}</p>
                  <p className="mt-1 text-sm text-gray-600">{preference.description}</p>
                </td>
                <td className="px-5 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={preference.inApp}
                    onChange={(event) => onChange(preference.key, 'inApp', event.target.checked)}
                    disabled={disabled}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600"
                    aria-label={`${preference.label} in-app`}
                  />
                </td>
                <td className="px-5 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={preference.email}
                    onChange={(event) => onChange(preference.key, 'email', event.target.checked)}
                    disabled={disabled}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600"
                    aria-label={`${preference.label} email`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminSectionCard>
  )
}
