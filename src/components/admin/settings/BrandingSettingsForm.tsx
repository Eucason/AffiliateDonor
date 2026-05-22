import { ImagePlus } from 'lucide-react'
import Button from '@/components/atoms/Button'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import type { AdminBrandingSettings } from '@/types/adminSettings'

interface BrandingSettingsFormProps {
  settings: AdminBrandingSettings
  disabled?: boolean
  onChange: (settings: AdminBrandingSettings) => void
  onReset: () => void
}

export default function BrandingSettingsForm({ settings, disabled = false, onChange, onReset }: BrandingSettingsFormProps) {
  const chooseMedia = (field: keyof Pick<AdminBrandingSettings, 'logoUrl' | 'faviconUrl' | 'socialPreviewImageUrl'>) => {
    onChange({ ...settings, [field]: `/admin/media/selected-${field}.png` })
  }

  return (
    <AdminSectionCard
      title="Branding Settings"
      description="Logo, favicon, brand colors, and social preview defaults."
      actions={<Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={disabled}>Reset Section</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <AssetField label="Logo" value={settings.logoUrl} onChoose={() => chooseMedia('logoUrl')} disabled={disabled} />
        <AssetField label="Favicon" value={settings.faviconUrl} onChoose={() => chooseMedia('faviconUrl')} disabled={disabled} />
        <AssetField
          label="Social preview image"
          value={settings.socialPreviewImageUrl}
          onChoose={() => chooseMedia('socialPreviewImageUrl')}
          disabled={disabled}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField
            label="Primary color"
            value={settings.primaryColor}
            onChange={(value) => onChange({ ...settings, primaryColor: value })}
            disabled={disabled}
          />
          <ColorField
            label="Secondary color"
            value={settings.secondaryColor}
            onChange={(value) => onChange({ ...settings, secondaryColor: value })}
            disabled={disabled}
          />
        </div>
      </div>
    </AdminSectionCard>
  )
}

function AssetField({ label, value, disabled, onChoose }: { label: string; value: string; disabled: boolean; onChoose: () => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      <div className="flex gap-2">
        <input value={value} readOnly className={inputClasses} disabled={disabled} />
        <Button type="button" variant="outline" size="sm" className="h-10 gap-2" onClick={onChoose} disabled={disabled}>
          <ImagePlus className="h-4 w-4" />
          Select
        </Button>
      </div>
    </label>
  )
}

function ColorField({ label, value, disabled, onChange }: { label: string; value: string; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      <div className="flex gap-2">
        <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-14 rounded-lg border border-gray-300 bg-white p-1" disabled={disabled} />
        <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClasses} disabled={disabled} />
      </div>
    </label>
  )
}

const inputClasses =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:text-gray-500'
