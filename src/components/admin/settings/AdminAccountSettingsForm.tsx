import { ImagePlus } from 'lucide-react'
import Button from '@/components/atoms/Button'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import type { AdminAccountSettings } from '@/types/adminSettings'

interface AdminAccountSettingsFormProps {
  settings: AdminAccountSettings
  disabled?: boolean
  onChange: (settings: AdminAccountSettings) => void
  onReset: () => void
}

export default function AdminAccountSettingsForm({ settings, disabled = false, onChange, onReset }: AdminAccountSettingsFormProps) {
  return (
    <AdminSectionCard
      title="Admin Account"
      description="Profile display values and auth provider handoff details."
      actions={<Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={disabled}>Reset Section</Button>}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Display name">
            <input value={settings.displayName} onChange={(event) => onChange({ ...settings, displayName: event.target.value })} className={inputClasses} disabled={disabled} />
          </Field>
          <Field label="Email">
            <input type="email" value={settings.email} onChange={(event) => onChange({ ...settings, email: event.target.value })} className={inputClasses} disabled={disabled} />
          </Field>
          <Field label="Avatar media">
            <div className="flex gap-2">
              <input value={settings.avatarUrl} onChange={(event) => onChange({ ...settings, avatarUrl: event.target.value })} className={inputClasses} disabled={disabled} />
              <Button type="button" variant="outline" size="sm" className="h-10 gap-2" onClick={() => onChange({ ...settings, avatarUrl: '/admin/media/avatar-admin.png' })} disabled={disabled}>
                <ImagePlus className="h-4 w-4" />
                Select
              </Button>
            </div>
          </Field>
          <Field label="Auth provider">
            <input value={settings.authProvider} readOnly className={inputClasses} disabled={disabled} />
          </Field>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">Access profile</p>
          <div className="mt-3 flex items-center gap-3">
            <AdminStatusBadge status={settings.role} tone="purple" />
            <span className="text-sm text-gray-600">Password and MFA changes are handled by {settings.authProvider}.</span>
          </div>
        </div>
      </div>
    </AdminSectionCard>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      {children}
    </label>
  )
}

const inputClasses =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500'
