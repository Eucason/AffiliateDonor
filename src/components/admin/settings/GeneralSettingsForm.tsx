import Button from '@/components/atoms/Button'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import type { AdminGeneralSettings } from '@/types/adminSettings'

interface GeneralSettingsFormProps {
  settings: AdminGeneralSettings
  disabled?: boolean
  onChange: (settings: AdminGeneralSettings) => void
  onReset: () => void
}

const currencies = ['USD', 'EUR', 'GBP', 'KES', 'CAD']
const timezones = ['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Africa/Nairobi', 'UTC']

export default function GeneralSettingsForm({ settings, disabled = false, onChange, onReset }: GeneralSettingsFormProps) {
  return (
    <AdminSectionCard
      title="General Settings"
      description="Core platform identity, support contact, locale, and maintenance posture."
      actions={<Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={disabled}>Reset Section</Button>}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Site name">
          <input
            value={settings.siteName}
            onChange={(event) => onChange({ ...settings, siteName: event.target.value })}
            className={inputClasses}
            disabled={disabled}
          />
        </Field>
        <Field label="Support email">
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(event) => onChange({ ...settings, supportEmail: event.target.value })}
            className={inputClasses}
            disabled={disabled}
          />
        </Field>
        <Field label="Timezone">
          <select
            value={settings.timezone}
            onChange={(event) => onChange({ ...settings, timezone: event.target.value })}
            className={inputClasses}
            disabled={disabled}
          >
            {timezones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Default currency">
          <select
            value={settings.defaultCurrency}
            onChange={(event) => onChange({ ...settings, defaultCurrency: event.target.value })}
            className={inputClasses}
            disabled={disabled}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Maintenance mode">
          <label className="flex h-10 items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(event) => onChange({ ...settings, maintenanceMode: event.target.checked })}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-primary-600"
            />
            Enabled
          </label>
        </Field>
        <Field label="Maintenance message">
          <input
            value={settings.maintenanceMessage}
            onChange={(event) => onChange({ ...settings, maintenanceMessage: event.target.value })}
            className={inputClasses}
            disabled={disabled}
          />
        </Field>
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
