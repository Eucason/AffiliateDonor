import Button from '@/components/atoms/Button'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import type { AdminPaymentSettings } from '@/types/adminSettings'

interface PaymentSettingsFormProps {
  settings: AdminPaymentSettings
  disabled?: boolean
  onChange: (settings: AdminPaymentSettings) => void
  onReset: () => void
}

const methods = [
  { value: 'card', label: 'Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'crypto', label: 'Crypto' },
]

export default function PaymentSettingsForm({ settings, disabled = false, onChange, onReset }: PaymentSettingsFormProps) {
  const toggleMethod = (method: string, checked: boolean) => {
    const enabledMethods = checked
      ? [...settings.enabledMethods, method]
      : settings.enabledMethods.filter((item) => item !== method)
    onChange({ ...settings, enabledMethods })
  }

  return (
    <AdminSectionCard
      title="Payment Settings"
      description="Payment method visibility, donation defaults, and webhook health placeholders."
      actions={<Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={disabled}>Reset Section</Button>}
    >
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Enabled methods</span>
            <div className="grid gap-3 sm:grid-cols-2">
              {methods.map((method) => (
                <label key={method.value} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={settings.enabledMethods.includes(method.value)}
                    onChange={(event) => toggleMethod(method.value, event.target.checked)}
                    disabled={disabled}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600"
                  />
                  {method.label}
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Default currency">
              <input
                value={settings.defaultCurrency}
                onChange={(event) => onChange({ ...settings, defaultCurrency: event.target.value })}
                className={inputClasses}
                disabled={disabled}
              />
            </Field>
            <Field label="Minimum donation">
              <input
                type="number"
                min="1"
                value={settings.minimumDonation}
                onChange={(event) => onChange({ ...settings, minimumDonation: Number(event.target.value) })}
                className={inputClasses}
                disabled={disabled}
              />
            </Field>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Webhook status</p>
              <p className="mt-1 text-sm text-gray-600">Latest processor health signal.</p>
            </div>
            <AdminStatusBadge status={settings.webhookStatus} tone={settings.webhookStatus === 'healthy' ? 'green' : 'yellow'} />
          </div>
          <div className="mt-4 space-y-3">
            <VisibilityToggle label="Stripe public" checked={settings.stripeVisible} disabled={disabled} onChange={(value) => onChange({ ...settings, stripeVisible: value })} />
            <VisibilityToggle label="PayPal public" checked={settings.paypalVisible} disabled={disabled} onChange={(value) => onChange({ ...settings, paypalVisible: value })} />
            <VisibilityToggle label="Crypto public" checked={settings.cryptoVisible} disabled={disabled} onChange={(value) => onChange({ ...settings, cryptoVisible: value })} />
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

function VisibilityToggle({ label, checked, disabled, onChange }: { label: string; checked: boolean; disabled: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm text-gray-700">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} disabled={disabled} className="h-4 w-4 rounded border-gray-300 text-primary-600" />
    </label>
  )
}

const inputClasses =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500'
