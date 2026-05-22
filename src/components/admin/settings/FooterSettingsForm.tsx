import Button from '@/components/atoms/Button'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import type { AdminFooterLink, AdminFooterSettings } from '@/types/adminSettings'

interface FooterSettingsFormProps {
  settings: AdminFooterSettings
  disabled?: boolean
  onChange: (settings: AdminFooterSettings) => void
  onReset: () => void
}

export default function FooterSettingsForm({ settings, disabled = false, onChange, onReset }: FooterSettingsFormProps) {
  const updateLegalLink = (index: number, link: AdminFooterLink) => {
    onChange({
      ...settings,
      legalLinks: settings.legalLinks.map((item, itemIndex) => (itemIndex === index ? link : item)),
    })
  }

  return (
    <AdminSectionCard
      title="Footer Settings"
      description="Contact information, legal links, link groups, and newsletter visibility."
      actions={<Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={disabled}>Reset Section</Button>}
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Contact email">
            <input value={settings.contactEmail} onChange={(event) => onChange({ ...settings, contactEmail: event.target.value })} className={inputClasses} disabled={disabled} />
          </Field>
          <Field label="Contact phone">
            <input value={settings.contactPhone} onChange={(event) => onChange({ ...settings, contactPhone: event.target.value })} className={inputClasses} disabled={disabled} />
          </Field>
          <Field label="Address">
            <input value={settings.address} onChange={(event) => onChange({ ...settings, address: event.target.value })} className={inputClasses} disabled={disabled} />
          </Field>
        </div>
        <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={settings.newsletterEnabled}
            onChange={(event) => onChange({ ...settings, newsletterEnabled: event.target.checked })}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-primary-600"
          />
          Newsletter signup visible
        </label>
        <div className="grid gap-4 lg:grid-cols-2">
          {settings.linkGroups.map((group) => (
            <div key={group.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-semibold text-gray-900">{group.title}</p>
              <div className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <div key={link.id} className="grid gap-2 sm:grid-cols-2">
                    <input value={link.label} readOnly className={inputClasses} disabled={disabled} />
                    <input value={link.url} readOnly className={inputClasses} disabled={disabled} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-900">Legal links</p>
            <div className="mt-3 space-y-2">
              {settings.legalLinks.map((link, index) => (
                <div key={link.id} className="grid gap-2 sm:grid-cols-2">
                  <input value={link.label} onChange={(event) => updateLegalLink(index, { ...link, label: event.target.value })} className={inputClasses} disabled={disabled} />
                  <input value={link.url} onChange={(event) => updateLegalLink(index, { ...link, url: event.target.value })} className={inputClasses} disabled={disabled} />
                </div>
              ))}
            </div>
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
