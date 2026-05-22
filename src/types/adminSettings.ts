import type { AdminRole } from '@/types/admin'

export type AdminSettingsSection =
  | 'general'
  | 'branding'
  | 'payments'
  | 'social'
  | 'footer'
  | 'account'
  | 'security'
  | 'notifications'

export type AdminNotificationPreferenceKey =
  | 'failedPayments'
  | 'newDonations'
  | 'contactMessages'
  | 'campaignApprovals'
  | 'contentApprovals'
  | 'lowInventory'

export interface AdminGeneralSettings {
  siteName: string
  supportEmail: string
  timezone: string
  defaultCurrency: string
  maintenanceMode: boolean
  maintenanceMessage: string
}

export interface AdminBrandingSettings {
  logoUrl: string
  faviconUrl: string
  primaryColor: string
  secondaryColor: string
  socialPreviewImageUrl: string
}

export interface AdminPaymentSettings {
  enabledMethods: string[]
  defaultCurrency: string
  minimumDonation: number
  stripeVisible: boolean
  paypalVisible: boolean
  cryptoVisible: boolean
  webhookStatus: 'healthy' | 'attention' | 'not_configured'
}

export interface AdminSocialLinksSettings {
  facebook: string
  xTwitter: string
  instagram: string
  linkedIn: string
  youtube: string
}

export interface AdminFooterLink {
  id: string
  label: string
  url: string
}

export interface AdminFooterLinkGroup {
  id: string
  title: string
  links: AdminFooterLink[]
}

export interface AdminFooterSettings {
  contactEmail: string
  contactPhone: string
  address: string
  newsletterEnabled: boolean
  linkGroups: AdminFooterLinkGroup[]
  legalLinks: AdminFooterLink[]
}

export interface AdminAccountSettings {
  displayName: string
  email: string
  avatarUrl: string
  role: AdminRole
  authProvider: string
}

export interface AdminRolePermissionOverview {
  role: AdminRole
  label: string
  description: string
  permissions: string[]
}

export interface AdminSecuritySettings {
  sessionTimeoutMinutes: number
  requireTwoFactor: boolean
  passwordPolicy: string
  auditRetentionDays: number
  roles: AdminRolePermissionOverview[]
}

export interface AdminNotificationPreference {
  key: AdminNotificationPreferenceKey
  label: string
  description: string
  email: boolean
  inApp: boolean
}

export interface AdminSettings {
  general: AdminGeneralSettings
  branding: AdminBrandingSettings
  payments: AdminPaymentSettings
  social: AdminSocialLinksSettings
  footer: AdminFooterSettings
  account: AdminAccountSettings
  security: AdminSecuritySettings
  notifications: AdminNotificationPreference[]
  updatedAt: string
  updatedBy: string
}

export interface AdminSettingsSummary {
  maintenanceMode: boolean
  enabledPaymentMethodCount: number
  unreadCriticalPreferenceCount: number
  roleCount: number
  lastUpdatedAt: string
}

export interface AdminSettingsResponse {
  settings: AdminSettings
  summary: AdminSettingsSummary
}
