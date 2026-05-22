import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/components/atoms/Button'
import { formatAdminDateTime } from '@/utils/adminFormatters'
import type { AdminUserNote } from '@/types/adminUser'

interface AdminNotesPanelProps {
  notes: AdminUserNote[]
  onAddNote: (body: string) => Promise<void>
}

export default function AdminNotesPanel({ notes, onAddNote }: AdminNotesPanelProps) {
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)

  const addNote = async () => {
    const trimmed = body.trim()
    if (!trimmed) {
      return
    }

    setSaving(true)
    try {
      await onAddNote(trimmed)
      setBody('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Add admin note</label>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="min-h-24 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          placeholder="Record donor context, support handoff details, or follow-up notes."
        />
        <div className="mt-2 flex justify-end">
          <Button type="button" variant="primary" size="sm" isLoading={saving} disabled={!body.trim()} onClick={addNote}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
            No admin notes have been added yet.
          </p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-700">{note.body}</p>
              <p className="mt-2 text-xs text-gray-500">
                {note.author} - {formatAdminDateTime(note.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
