import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import MessageDetailsPanel from '@/components/admin/messages/MessageDetailsPanel'
import AdminLayout from '@/components/organisms/AdminLayout'
import { adminMessagesAPI } from '@/services/admin/adminMessagesAPI'
import type { AdminMessage, AdminMessageStatus } from '@/types/adminMessage'

export default function AdminMessageDetailsPage() {
  const { id } = useParams()
  const [message, setMessage] = useState<AdminMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessage = useCallback(async () => {
    if (!id) {
      setError('Message ID is missing.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      setMessage(await adminMessagesAPI.getMessage(id))
    } catch (requestError) {
      console.error('Failed to load message detail:', requestError)
      setError('This message could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchMessage()
  }, [fetchMessage])

  const updateStatus = async (status: AdminMessageStatus) => {
    if (!message) {
      return
    }

    setMessage(await adminMessagesAPI.updateStatus(message.id, status))
  }

  const assignMessage = async (assignedAdmin: string) => {
    if (!message) {
      return
    }

    setMessage(await adminMessagesAPI.assignMessage(message.id, assignedAdmin))
  }

  const addNote = async (body: string) => {
    if (!message) {
      return
    }

    setMessage(await adminMessagesAPI.addNote(message.id, body))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link
          to="/admin/messages"
          className="inline-flex items-center text-sm font-semibold text-gray-600 transition hover:text-primary-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to messages
        </Link>

        {loading && <AdminLoadingState label="Loading message details..." />}

        {error && !loading && <AdminErrorState message={error} onRetry={fetchMessage} />}

        {message && !loading && !error && (
          <>
            <AdminPageHeader
              eyebrow="Message Detail"
              title={message.subject}
              description={`From ${message.senderName} at ${message.senderEmail}`}
            />
            <MessageDetailsPanel
              message={message}
              onStatusChange={updateStatus}
              onAssign={assignMessage}
              onAddNote={addNote}
            />
          </>
        )}
      </div>
    </AdminLayout>
  )
}
