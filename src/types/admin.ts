export type AdminRole = 'owner' | 'admin' | 'editor' | 'analyst' | 'support'

export type AdminPermission =
  | 'admin:access'
  | 'dashboard:read'
  | 'donations:read'
  | 'donations:write'
  | 'causes:read'
  | 'causes:write'
  | 'content:read'
  | 'content:write'
  | 'users:read'
  | 'users:write'
  | 'products:read'
  | 'products:write'
  | 'reports:read'
  | 'messages:read'
  | 'messages:write'
  | 'settings:read'
  | 'settings:write'
  | 'notifications:read'
  | 'audit:read'
  | 'approvals:read'
  | 'approvals:write'

export type AdminNavIcon =
  | 'LayoutDashboard'
  | 'HeartHandshake'
  | 'Target'
  | 'ClipboardCheck'
  | 'FileText'
  | 'PlusCircle'
  | 'PanelsTopLeft'
  | 'Images'
  | 'Users'
  | 'Mail'
  | 'ExternalLink'
  | 'ShoppingBag'
  | 'Tags'
  | 'BarChart3'
  | 'Download'
  | 'Bell'
  | 'Settings'
  | 'History'
  | 'Search'

export interface AdminNavigationItem {
  label: string
  path: string
  icon: AdminNavIcon
  description?: string
  permission?: AdminPermission
  children?: AdminNavigationItem[]
}

export interface AdminNavigationGroup {
  label: string
  items: AdminNavigationItem[]
}

export interface AdminRouteMeta {
  path: string
  title: string
  description?: string
  breadcrumbs: Array<{
    label: string
    path?: string
  }>
  permission?: AdminPermission
}

export type AdminStatusTone =
  | 'gray'
  | 'green'
  | 'red'
  | 'yellow'
  | 'blue'
  | 'purple'
  | 'primary'
  | 'secondary'
