import apiClient from '@/lib/apiClient'
import type {
  AdminNotificationPreference,
  AdminSettings,
  AdminSettingsResponse,
  AdminSettingsSection,
  AdminSettingsSummary,
} from '@/types/adminSettings'

const fallbackStorageKey = 'affiliateDonor.adminSettings'

export const defaultNotificationPreferences: AdminNotificationPreference[] = [
  {
    key: 'failedPayments',
    label: 'Failed payments',
    description: 'Payment failures, webhook issues, and refund review reminders.',
    email: true,
    inApp: true,
  },
  {
    key: 'newDonations',
    label: 'New donations',
    description: 'Successful contributions and donor activity worth reviewing.',
    email: false,
    inApp: true,
  },
  {
    key: 'contactMessages',
    label: 'Contact messages',
    description: 'New support, partner, and donor contact submissions.',
    email: true,
    inApp: true,
  },
  {
    key: 'campaignApprovals',
    label: 'Campaign approvals',
    description: 'Campaign submissions, publishing requests, and verification changes.',
    email: true,
    inApp: true,
  },
  {
    key: 'contentApprovals',
    label: 'Content approvals',
    description: 'Blog posts, homepage blocks, banners, and scheduled content.',
    email: false,
    inApp: true,
  },
  {
    key: 'lowInventory',
    label: 'Low inventory',
    description: 'Merch variants that are at or below their stock threshold.',
    email: true,
    inApp: true,
  },
]

export const defaultAdminSettings: AdminSettings = {
  general: {
    siteName: 'AffiliateDonor',
    supportEmail: 'support@affiliatedonor.example',
    timezone: 'America/New_York',
    defaultCurrency: 'USD',
    maintenanceMode: false,
    maintenanceMessage: 'Scheduled maintenance is in progress. Please check back shortly.',
  },
  branding: {
    logoUrl: '/images/logo.png',
    faviconUrl: '/favicon.ico',
    primaryColor: '#0f766e',
    secondaryColor: '#7c3aed',
    socialPreviewImageUrl: '/images/social-preview.jpg',
  },
  payments: {
    enabledMethods: ['card', 'paypal', 'bank_transfer'],
    defaultCurrency: 'USD',
    minimumDonation: 5,
    stripeVisible: true,
    paypalVisible: true,
    cryptoVisible: false,
    webhookStatus: 'healthy',
  },
  social: {
    facebook: 'https://facebook.com/affiliatedonor',
    xTwitter: 'https://x.com/affiliatedonor',
    instagram: 'https://instagram.com/affiliatedonor',
    linkedIn: 'https://linkedin.com/company/affiliatedonor',
    youtube: '',
  },
  footer: {
    contactEmail: 'hello@affiliatedonor.example',
    contactPhone: '+1 555 0148',
    address: '120 Giving Lane, Austin, TX',
    newsletterEnabled: true,
    linkGroups: [
      {
        id: 'footer-causes',
        title: 'Causes',
        links: [
          { id: 'footer-causes-active', label: 'Active Causes', url: '/causes' },
          { id: 'footer-causes-how', label: 'How It Works', url: '/how-it-works' },
        ],
      },
      {
        id: 'footer-company',
        title: 'Company',
        links: [
          { id: 'footer-about', label: 'About', url: '/about' },
          { id: 'footer-contact', label: 'Contact', url: '/contact' },
        ],
      },
    ],
    legalLinks: [
      { id: 'legal-terms', label: 'Terms', url: '/terms' },
      { id: 'legal-faqs', label: 'FAQs', url: '/faqs' },
    ],
  },
  account: {
    displayName: 'Olivia Grant',
    email: 'olivia@example.com',
    avatarUrl: '',
    role: 'admin',
    authProvider: 'Supabase Auth',
  },
  security: {
    sessionTimeoutMinutes: 60,
    requireTwoFactor: false,
    passwordPolicy: 'Minimum 12 characters with a number and symbol.',
    auditRetentionDays: 365,
    roles: [
      {
        role: 'owner',
        label: 'Owner',
        description: 'Full access to billing-sensitive and system settings.',
        permissions: ['settings:write', 'users:write', 'approvals:write', 'reports:read'],
      },
      {
        role: 'admin',
        label: 'Admin',
        description: 'Manage operations, approvals, campaigns, content, and users.',
        permissions: ['donations:write', 'causes:write', 'content:write', 'products:write'],
      },
      {
        role: 'editor',
        label: 'Editor',
        description: 'Manage publishing workflows and website content.',
        permissions: ['content:write', 'approvals:read', 'media:write'],
      },
      {
        role: 'analyst',
        label: 'Analyst',
        description: 'Read reports, exports, and audit history.',
        permissions: ['reports:read', 'audit:read'],
      },
      {
        role: 'support',
        label: 'Support',
        description: 'Review messages, donors, and donation context.',
        permissions: ['messages:write', 'users:read', 'donations:read'],
      },
    ],
  },
  notifications: defaultNotificationPreferences,
  updatedAt: new Date().toISOString(),
  updatedBy: 'Admin Team',
}

export const adminSettingsAPI = {
  async getSettings(): Promise<AdminSettingsResponse> {
    try {
      const response = await apiClient.get<AdminSettingsResponse>('/api/admin/settings', { timeout: 2500 })
      return normalizeSettingsResponse(response.data)
    } catch (error) {
      console.warn('Using admin settings fallback data because the API could not be reached.', error)
      const settings = readStoredSettings()
      return {
        settings,
        summary: summarizeSettings(settings),
      }
    }
  },

  async saveSettings(settings: AdminSettings): Promise<AdminSettingsResponse> {
    const nextSettings = {
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: settings.account.displayName || 'Admin Team',
    }

    try {
      const response = await apiClient.put<AdminSettingsResponse>('/api/admin/settings', { settings: nextSettings })
      const normalized = normalizeSettingsResponse(response.data)
      writeStoredSettings(normalized.settings)
      return normalized
    } catch (error) {
      console.warn('Saving admin settings in fallback storage because the API could not be reached.', error)
      writeStoredSettings(nextSettings)
      return {
        settings: nextSettings,
        summary: summarizeSettings(nextSettings),
      }
    }
  },

  async resetSection(settings: AdminSettings, section: AdminSettingsSection): Promise<AdminSettingsResponse> {
    const resetSettings = {
      ...settings,
      [section]: cloneDefaultSection(section),
    }

    return this.saveSettings(resetSettings)
  },
}

export function summarizeSettings(settings: AdminSettings): AdminSettingsSummary {
  return {
    maintenanceMode: settings.general.maintenanceMode,
    enabledPaymentMethodCount: settings.payments.enabledMethods.length,
    unreadCriticalPreferenceCount: settings.notifications.filter((item) => item.inApp && item.email).length,
    roleCount: settings.security.roles.length,
    lastUpdatedAt: settings.updatedAt,
  }
}

function normalizeSettingsResponse(response: AdminSettingsResponse): AdminSettingsResponse {
  const settings = {
    ...defaultAdminSettings,
    ...response.settings,
    general: { ...defaultAdminSettings.general, ...response.settings?.general },
    branding: { ...defaultAdminSettings.branding, ...response.settings?.branding },
    payments: { ...defaultAdminSettings.payments, ...response.settings?.payments },
    social: { ...defaultAdminSettings.social, ...response.settings?.social },
    footer: { ...defaultAdminSettings.footer, ...response.settings?.footer },
    account: { ...defaultAdminSettings.account, ...response.settings?.account },
    security: { ...defaultAdminSettings.security, ...response.settings?.security },
    notifications: response.settings?.notifications?.length
      ? response.settings.notifications
      : defaultNotificationPreferences,
  }

  return {
    settings,
    summary: response.summary ?? summarizeSettings(settings),
  }
}

function cloneDefaultSection(section: AdminSettingsSection) {
  return JSON.parse(JSON.stringify(defaultAdminSettings[section])) as AdminSettings[AdminSettingsSection]
}

function readStoredSettings(): AdminSettings {
  if (typeof window === 'undefined') {
    return defaultAdminSettings
  }

  try {
    const value = window.localStorage.getItem(fallbackStorageKey)
    if (!value) {
      return defaultAdminSettings
    }

    return normalizeSettingsResponse({ settings: JSON.parse(value) as AdminSettings, summary: summarizeSettings(defaultAdminSettings) }).settings
  } catch (error) {
    console.warn('Stored admin settings could not be parsed.', error)
    return defaultAdminSettings
  }
}

function writeStoredSettings(settings: AdminSettings) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(fallbackStorageKey, JSON.stringify(settings))
}
