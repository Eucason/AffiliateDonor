import { useMemo, useState } from 'react'
import { Inbox, MailCheck, MailOpen, RefreshCw, Reply } from 'lucide-react'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import AdminTableToolbar from '@/components/admin/shared/AdminTableToolbar'
import MessageDetailsPanel from '@/components/admin/messages/MessageDetailsPanel'
import MessageFilters from '@/components/admin/messages/MessageFilters'
import MessagesInboxTable from '@/components/admin/messages/MessagesInboxTable'
import AdminLayout from '@/components/organisms/AdminLayout'
import Button from '@/components/atoms/Button'
import { adminMessagesAPI } from '@/services/admin/adminMessagesAPI'
import { defaultAdminMessageFilters, useAdminMessages } from '@/hooks/admin/useAdminMessages'
import type { AdminMessage, AdminMessageFilters, AdminMessageStatus } from '@/types/adminMessage'

export default function AdminMessagesPage() {
  const {
    filteredMessages,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch,
    updateFilter,
    clearFilters,
    replaceMessage,
  } = useAdminMessages()
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null)

  const hasActiveFilters = useMemo(
    () => Object.entries(filters).some(([key, value]) => value !== defaultAdminMessageFilters[key as keyof AdminMessageFilters]),
    [filters],
  )

  const applyMessageUpdate = (updatedMessage: AdminMessage) => {
    replaceMessage(updatedMessage)
    setSelectedMessage((current) => (current?.id === updatedMessage.id ? updatedMessage : current))
  }

  const updateStatus = async (message: AdminMessage, status: AdminMessageStatus) => {
    applyMessageUpdate(await adminMessagesAPI.updateStatus(message.id, status))
  }

  const assignMessage = async (message: AdminMessage, assignedAdmin: string) => {
    applyMessageUpdate(await adminMessagesAPI.assignMessage(message.id, assignedAdmin))
  }

  const addNote = async (message: AdminMessage, body: string) => {
    applyMessageUpdate(await adminMessagesAPI.addNote(message.id, body))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Inbox"
          title="Contact Messages"
          description="Triage contact submissions, donor matches, assignments, workflow status, and admin notes."
          actions={
            <Button type="button" variant="primary" size="sm" onClick={refetch}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Unread" value={summary.unreadCount} helperText={`${summary.totalCount} total messages`} icon={<Inbox className="h-5 w-5" />} />
          <AdminStatCard label="Pending" value={summary.pendingCount} helperText="Needs follow-up" icon={<MailOpen className="h-5 w-5" />} />
          <AdminStatCard label="Replied" value={summary.repliedCount} helperText="Response sent" icon={<Reply className="h-5 w-5" />} />
          <AdminStatCard label="Resolved" value={summary.resolvedCount} helperText="Closed conversations" icon={<MailCheck className="h-5 w-5" />} />
        </div>

        <AdminTableToolbar
          title="Message Inbox"
          description="Search by sender name, email, subject, message body, or status."
          searchSlot={
            <AdminSearchInput
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              onClear={() => updateFilter('search', '')}
              placeholder="Search contact messages..."
            />
          }
          actions={<span className="text-sm font-medium text-gray-500">{filteredMessages.length} visible</span>}
        />

        <MessageFilters filters={filters} options={filterOptions} onChange={updateFilter} onClear={clearFilters} />

        {error && !loading && <AdminErrorState message={error} onRetry={refetch} />}

        <MessagesInboxTable
          messages={filteredMessages}
          isLoading={loading}
          hasActiveFilters={hasActiveFilters}
          onView={setSelectedMessage}
          onMarkRead={(message) => updateStatus(message, 'read')}
        />

        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/30">
            <button
              type="button"
              className="absolute inset-0 cursor-default"
              onClick={() => setSelectedMessage(null)}
              aria-label="Close message drawer"
            />
            <aside className="relative h-full w-full max-w-3xl overflow-y-auto bg-white p-6 shadow-xl">
              <MessageDetailsPanel
                message={selectedMessage}
                onClose={() => setSelectedMessage(null)}
                onStatusChange={(status) => updateStatus(selectedMessage, status)}
                onAssign={(assignedAdmin) => assignMessage(selectedMessage, assignedAdmin)}
                onAddNote={(body) => addNote(selectedMessage, body)}
              />
            </aside>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
