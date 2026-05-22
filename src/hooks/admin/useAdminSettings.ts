import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminSettingsAPI,
  defaultAdminSettings,
  summarizeSettings,
} from '@/services/admin/adminSettingsAPI'
import type {
  AdminNotificationPreference,
  AdminNotificationPreferenceKey,
  AdminSettings,
  AdminSettingsSection,
} from '@/types/adminSettings'

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(defaultAdminSettings)
  const [savedSettings, setSavedSettings] = useState<AdminSettings>(defaultAdminSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminSettingsAPI.getSettings()
      setSettings(response.settings)
      setSavedSettings(response.settings)
    } catch (requestError) {
      console.error('Failed to load admin settings:', requestError)
      setError('Settings could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateSection = useCallback(
    <Key extends AdminSettingsSection>(section: Key, value: AdminSettings[Key]) => {
      setSettings((current) => ({ ...current, [section]: value }))
      setSuccessMessage(null)
    },
    [],
  )

  const updateNotificationPreference = useCallback(
    (
      key: AdminNotificationPreferenceKey,
      channel: keyof Pick<AdminNotificationPreference, 'email' | 'inApp'>,
      value: boolean,
    ) => {
      setSettings((current) => ({
        ...current,
        notifications: current.notifications.map((preference) =>
          preference.key === key ? { ...preference, [channel]: value } : preference,
        ),
      }))
      setSuccessMessage(null)
    },
    [],
  )

  const saveSettings = useCallback(async () => {
    try {
      setSaving(true)
      setError(null)
      const response = await adminSettingsAPI.saveSettings(settings)
      setSettings(response.settings)
      setSavedSettings(response.settings)
      setSuccessMessage('Settings saved.')
    } catch (requestError) {
      console.error('Failed to save admin settings:', requestError)
      setError('Settings could not be saved. Please review required fields and try again.')
    } finally {
      setSaving(false)
    }
  }, [settings])

  const resetSection = useCallback(
    async (section: AdminSettingsSection) => {
      try {
        setSaving(true)
        setError(null)
        const response = await adminSettingsAPI.resetSection(settings, section)
        setSettings(response.settings)
        setSavedSettings(response.settings)
        setSuccessMessage('Section reset.')
      } catch (requestError) {
        console.error('Failed to reset admin settings section:', requestError)
        setError('This settings section could not be reset. Please try again.')
      } finally {
        setSaving(false)
      }
    },
    [settings],
  )

  const discardChanges = useCallback(() => {
    setSettings(savedSettings)
    setSuccessMessage(null)
  }, [savedSettings])

  const dirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(savedSettings), [settings, savedSettings])
  const summary = useMemo(() => summarizeSettings(settings), [settings])

  return {
    settings,
    summary,
    loading,
    saving,
    dirty,
    error,
    successMessage,
    refetch: fetchSettings,
    updateSection,
    updateNotificationPreference,
    saveSettings,
    resetSection,
    discardChanges,
  }
}
