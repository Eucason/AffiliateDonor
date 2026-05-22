import { Bell, CreditCard, Globe2, Palette, RefreshCw, Save, ShieldCheck, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminAccountSettingsForm from '@/components/admin/settings/AdminAccountSettingsForm'
import BrandingSettingsForm from '@/components/admin/settings/BrandingSettingsForm'
import FooterSettingsForm from '@/components/admin/settings/FooterSettingsForm'
import GeneralSettingsForm from '@/components/admin/settings/GeneralSettingsForm'
import NotificationPreferencesForm from '@/components/admin/settings/NotificationPreferencesForm'
import PaymentSettingsForm from '@/components/admin/settings/PaymentSettingsForm'
import SecuritySettingsForm from '@/components/admin/settings/SecuritySettingsForm'
import SocialLinksSettingsForm from '@/components/admin/settings/SocialLinksSettingsForm'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminSettings } from '@/hooks/admin/useAdminSettings'
import { formatAdminDateTime } from '@/utils/adminFormatters'
import { cn } from '@/utils/cn'
import type { AdminSettingsSection } from '@/types/adminSettings'

const settingsSections: Array<{
  key: AdminSettingsSection
  label: string
  icon: typeof Globe2
}> = [
  { key: 'general', label: 'General', icon: Globe2 },
  { key: 'branding', label: 'Branding', icon: Palette },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'social', label: 'Social Links', icon: Globe2 },
  { key: 'footer', label: 'Footer', icon: Globe2 },
  { key: 'account', label: 'Admin Account', icon: UserRound },
  { key: 'security', label: 'Security', icon: ShieldCheck },
  { key: 'notifications', label: 'Notifications', icon: Bell },
]

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<AdminSettingsSection>('general')
  const {
    settings,
    summary,
    loading,
    saving,
    dirty,
    error,
    successMessage,
    refetch,
    updateSection,
    updateNotificationPreference,
    saveSettings,
    resetSection,
    discardChanges,
  } = useAdminSettings()

  const activeSectionLabel = useMemo(
    () => settingsSections.find((section) => section.key === activeSection)?.label ?? 'Settings',
    [activeSection],
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="System"
          title="Settings"
          description="Configure website, branding, payment, social, footer, account, security, and notification settings."
          actions={
            <>
              <Button type="button" variant="outline" size="sm" onClick={refetch} disabled={loading || saving}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={discardChanges} disabled={!dirty || saving}>
                Discard
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={saveSettings} disabled={!dirty || saving} isLoading={saving}>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Maintenance" value={summary.maintenanceMode ? 'On' : 'Off'} helperText="Public site mode" icon={<Globe2 className="h-5 w-5" />} />
          <AdminStatCard label="Payment Methods" value={summary.enabledPaymentMethodCount} helperText="Enabled checkout options" icon={<CreditCard className="h-5 w-5" />} />
          <AdminStatCard label="Alert Rules" value={summary.unreadCriticalPreferenceCount} helperText="Email and in-app enabled" icon={<Bell className="h-5 w-5" />} />
          <AdminStatCard label="Admin Roles" value={summary.roleCount} helperText={formatAdminDateTime(summary.lastUpdatedAt)} icon={<ShieldCheck className="h-5 w-5" />} />
        </div>

        {error && <AdminErrorState message={error} onRetry={refetch} />}
        {successMessage && <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">{successMessage}</div>}

        {loading ? (
          <AdminLoadingState label="Loading settings..." />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
            <AdminSectionCard title="Settings Areas" description="Select a system section to edit.">
              <nav className="space-y-1" aria-label="Settings sections">
                {settingsSections.map((section) => {
                  const Icon = section.icon
                  const isActive = section.key === activeSection

                  return (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => setActiveSection(section.key)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition',
                        isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {section.label}
                    </button>
                  )
                })}
              </nav>
            </AdminSectionCard>

            <div className="space-y-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{activeSectionLabel}</h2>
                <p className="mt-1 text-sm text-gray-600">Changes are staged locally until saved.</p>
              </div>
              {activeSection === 'general' && (
                <GeneralSettingsForm settings={settings.general} disabled={saving} onChange={(value) => updateSection('general', value)} onReset={() => resetSection('general')} />
              )}
              {activeSection === 'branding' && (
                <BrandingSettingsForm settings={settings.branding} disabled={saving} onChange={(value) => updateSection('branding', value)} onReset={() => resetSection('branding')} />
              )}
              {activeSection === 'payments' && (
                <PaymentSettingsForm settings={settings.payments} disabled={saving} onChange={(value) => updateSection('payments', value)} onReset={() => resetSection('payments')} />
              )}
              {activeSection === 'social' && (
                <SocialLinksSettingsForm settings={settings.social} disabled={saving} onChange={(value) => updateSection('social', value)} onReset={() => resetSection('social')} />
              )}
              {activeSection === 'footer' && (
                <FooterSettingsForm settings={settings.footer} disabled={saving} onChange={(value) => updateSection('footer', value)} onReset={() => resetSection('footer')} />
              )}
              {activeSection === 'account' && (
                <AdminAccountSettingsForm settings={settings.account} disabled={saving} onChange={(value) => updateSection('account', value)} onReset={() => resetSection('account')} />
              )}
              {activeSection === 'security' && (
                <SecuritySettingsForm settings={settings.security} disabled={saving} onChange={(value) => updateSection('security', value)} onReset={() => resetSection('security')} />
              )}
              {activeSection === 'notifications' && (
                <NotificationPreferencesForm
                  preferences={settings.notifications}
                  disabled={saving}
                  onChange={updateNotificationPreference}
                  onReset={() => resetSection('notifications')}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
