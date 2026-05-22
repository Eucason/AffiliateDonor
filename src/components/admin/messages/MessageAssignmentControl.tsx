import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import Button from '@/components/atoms/Button'

interface MessageAssignmentControlProps {
  value: string
  onAssign: (assignedAdmin: string) => Promise<void>
}

const assignmentOptions = ['Unassigned', 'Support', 'Finance', 'Payments', 'Partnerships', 'Admin Team']

export default function MessageAssignmentControl({ value, onAssign }: MessageAssignmentControlProps) {
  const [assignedAdmin, setAssignedAdmin] = useState(value)
  const [saving, setSaving] = useState(false)

  const saveAssignment = async () => {
    setSaving(true)
    try {
      await onAssign(assignedAdmin)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <select
        value={assignedAdmin}
        onChange={(event) => setAssignedAdmin(event.target.value)}
        className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
      >
        {assignmentOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Button type="button" variant="outline" size="sm" disabled={assignedAdmin === value} isLoading={saving} onClick={saveAssignment}>
        <UserPlus className="mr-2 h-4 w-4" />
        Assign
      </Button>
    </div>
  )
}
