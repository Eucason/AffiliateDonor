import type { User } from '@supabase/supabase-js'
import type { AdminPermission, AdminRole } from '@/types/admin'

export const adminRoleLabels: Record<AdminRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  analyst: 'Analyst',
  support: 'Support',
}

const rolePermissions: Record<AdminRole, AdminPermission[]> = {
  owner: [
    'admin:access',
    'dashboard:read',
    'donations:read',
    'donations:write',
    'causes:read',
    'causes:write',
    'content:read',
    'content:write',
    'users:read',
    'users:write',
    'products:read',
    'products:write',
    'reports:read',
    'messages:read',
    'messages:write',
    'settings:read',
    'settings:write',
    'notifications:read',
    'audit:read',
    'approvals:read',
    'approvals:write',
  ],
  admin: [
    'admin:access',
    'dashboard:read',
    'donations:read',
    'donations:write',
    'causes:read',
    'causes:write',
    'content:read',
    'content:write',
    'users:read',
    'products:read',
    'products:write',
    'reports:read',
    'messages:read',
    'messages:write',
    'notifications:read',
    'audit:read',
    'approvals:read',
    'approvals:write',
  ],
  editor: [
    'admin:access',
    'dashboard:read',
    'causes:read',
    'content:read',
    'content:write',
    'products:read',
    'notifications:read',
  ],
  analyst: [
    'admin:access',
    'dashboard:read',
    'donations:read',
    'causes:read',
    'users:read',
    'products:read',
    'reports:read',
    'notifications:read',
  ],
  support: [
    'admin:access',
    'dashboard:read',
    'donations:read',
    'users:read',
    'messages:read',
    'messages:write',
    'notifications:read',
  ],
}

const adminRoles: AdminRole[] = ['owner', 'admin', 'editor', 'analyst', 'support']

export function getAdminRoles(user: User | null): AdminRole[] {
  const metadata = user?.app_metadata as Record<string, unknown> | undefined
  const roles = [
    ...normalizeRoles(metadata?.roles),
    ...normalizeRoles(metadata?.role),
    ...normalizeRoles(metadata?.admin_role),
  ]

  return Array.from(new Set(roles))
}

export function hasAdminAccess(user: User | null) {
  return hasAdminPermission(user, 'admin:access')
}

export function hasAdminPermission(user: User | null, permission: AdminPermission) {
  if (import.meta.env.DEV || Boolean(import.meta.env.VITE_ADMIN_AUTH_TOKEN)) {
    return true
  }

  if (!user) {
    return false
  }

  const permissions = getAdminRoles(user).flatMap((role) => rolePermissions[role])
  return permissions.includes(permission)
}

function normalizeRoles(value: unknown): AdminRole[] {
  if (Array.isArray(value)) {
    return value.flatMap(normalizeRoles)
  }

  if (typeof value !== 'string') {
    return []
  }

  return value
    .split(',')
    .map((role) => role.trim().toLowerCase())
    .filter((role): role is AdminRole => adminRoles.includes(role as AdminRole))
}
