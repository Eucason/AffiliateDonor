import { ShieldCheck } from 'lucide-react'
import Button from '@/components/atoms/Button'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import type { AdminSecuritySettings } from '@/types/adminSettings'

interface SecuritySettingsFormProps {
  settings: AdminSecuritySettings
  disabled?: boolean
  onChange: (settings: AdminSecuritySettings) => void
  onReset: () => void
}

export default function SecuritySettingsForm({ settings, disabled = false, onChange, onReset }: SecuritySettingsFormProps) {
  return (
    <AdminSectionCard
      title="Security Settings"
      description="Admin roles, permissions overview, session policy, and two-factor readiness."
      actions={<Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={disabled}>Reset Section</Button>}
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Session timeout minutes">
            <input
              type="number"
              min="15"
              value={settings.sessionTimeoutMinutes}
              onChange={(event) => onChange({ ...settings, sessionTimeoutMinutes: Number(event.target.value) })}
              className={inputClasses}
              disabled={disabled}
            />
          </Field>
          <Field label="Audit retention days">
            <input
              type="number"
              min="30"
              value={settings.auditRetentionDays}
              onChange={(event) => onChange({ ...settings, auditRetentionDays: Number(event.target.value) })}
              className={inputClasses}
              disabled={disabled}
            />
          </Field>
          <Field label="Two-factor policy">
            <label className="flex h-10 items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={settings.requireTwoFactor}
                onChange={(event) => onChange({ ...settings, requireTwoFactor: event.target.checked })}
                disabled={disabled}
                className="h-4 w-4 rounded border-gray-300 text-primary-600"
              />
              Required for admins
            </label>
          </Field>
        </div>
        <Field label="Password policy">
          <input
            value={settings.passwordPolicy}
            onChange={(event) => onChange({ ...settings, passwordPolicy: event.target.value })}
            className={inputClasses}
            disabled={disabled}
          />
        </Field>
        <div>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary-600" />
            <h3 className="text-sm font-semibold text-gray-900">Role permissions</h3>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {settings.roles.map((role) => (
              <div key={role.role} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{role.label}</p>
                    <p className="mt-1 text-sm text-gray-600">{role.description}</p>
                  </div>
                  <AdminStatusBadge status={role.role} tone={role.role === 'owner' ? 'purple' : 'blue'} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <span key={permission} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-200">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            ))}
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
