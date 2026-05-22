import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import Button from '@/components/atoms/Button'
import type { AdminUserRole } from '@/types/adminUser'

interface RoleSelectorProps {
  value: AdminUserRole
  canManage: boolean
  onChange: (role: AdminUserRole) => Promise<void>
}

const roleOptions: Array<{ value: AdminUserRole; label: string; description: string }> = [
  { value: 'donor', label: 'Donor', description: 'Standard donor and shopper access.' },
  { value: 'support', label: 'Support', description: 'Can review donors, messages, and donations.' },
  { value: 'analyst', label: 'Analyst', description: 'Can review reports and platform records.' },
  { value: 'editor', label: 'Editor', description: 'Can manage content and campaign copy.' },
  { value: 'admin', label: 'Admin', description: 'Broad operational access without owner settings.' },
  { value: 'owner', label: 'Owner', description: 'Full administrative control.' },
]

export default function RoleSelector({ value, canManage, onChange }: RoleSelectorProps) {
  const [nextRole, setNextRole] = useState<AdminUserRole>(value)
  const [saving, setSaving] = useState(false)

  const saveRole = async () => {
    setSaving(true)
    try {
      await onChange(nextRole)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600" />
        <div>
          <p className="font-semibold text-gray-900">Role assignment</p>
          <p className="text-sm text-gray-600">
            {canManage
              ? 'Role changes are audit-ready and can be connected to production permissions.'
              : 'Permission denied for role changes on this account.'}
          </p>
        </div>
      </div>

      <select
        value={nextRole}
        disabled={!canManage}
        onChange={(event) => setNextRole(event.target.value as AdminUserRole)}
        className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition disabled:bg-gray-100 disabled:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
      >
        {roleOptions.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>

      <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-600">
        {roleOptions.find((role) => role.value === nextRole)?.description}
      </div>

      <Button
        type="button"
        variant="primary"
        size="sm"
        disabled={!canManage || nextRole === value}
        isLoading={saving}
        onClick={saveRole}
      >
        Save Role
      </Button>
    </div>
  )
}
