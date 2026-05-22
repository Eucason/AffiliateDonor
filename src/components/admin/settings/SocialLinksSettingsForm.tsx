import Button from '@/components/atoms/Button'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import type { AdminSocialLinksSettings } from '@/types/adminSettings'

interface SocialLinksSettingsFormProps {
  settings: AdminSocialLinksSettings
  disabled?: boolean
  onChange: (settings: AdminSocialLinksSettings) => void
  onReset: () => void
}

const fields: Array<{ key: keyof AdminSocialLinksSettings; label: string }> = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'xTwitter', label: 'X/Twitter' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'linkedIn', label: 'LinkedIn' },
  { key: 'youtube', label: 'YouTube' },
]

export default function SocialLinksSettingsForm({ settings, disabled = false, onChange, onReset }: SocialLinksSettingsFormProps) {
  return (
    <AdminSectionCard
      title="Social Links"
      description="Public social destinations used by the footer and brand surfaces."
      actions={<Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={disabled}>Reset Section</Button>}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{field.label}</span>
            <input
              value={settings[field.key]}
              onChange={(event) => onChange({ ...settings, [field.key]: event.target.value })}
              className={inputClasses}
              disabled={disabled}
            />
          </label>
        ))}
      </div>
    </AdminSectionCard>
  )
}

const inputClasses =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500'
