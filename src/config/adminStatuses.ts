import type { AdminStatusTone } from '@/types/admin'

export interface AdminStatusDefinition {
  label: string
  tone: AdminStatusTone
}

export const adminStatusDefinitions: Record<string, AdminStatusDefinition> = {
  active: { label: 'Active', tone: 'green' },
  archived: { label: 'Archived', tone: 'gray' },
  draft: { label: 'Draft', tone: 'gray' },
  failed: { label: 'Failed', tone: 'red' },
  featured: { label: 'Featured', tone: 'purple' },
  pending: { label: 'Pending', tone: 'yellow' },
  published: { label: 'Published', tone: 'green' },
  refunded: { label: 'Refunded', tone: 'blue' },
  resolved: { label: 'Resolved', tone: 'green' },
  succeeded: { label: 'Succeeded', tone: 'green' },
  successful: { label: 'Successful', tone: 'green' },
  unread: { label: 'Unread', tone: 'primary' },
}

export function getAdminStatusDefinition(status: string): AdminStatusDefinition {
  return adminStatusDefinitions[status] ?? {
    label: status.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
    tone: 'gray',
  }
}
