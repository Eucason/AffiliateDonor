import { Download } from 'lucide-react'
import Button from '@/components/atoms/Button'

interface AdminExportButtonProps {
  label?: string
  onExport?: () => void
  disabled?: boolean
}

export default function AdminExportButton({
  label = 'Export',
  onExport,
  disabled = false,
}: AdminExportButtonProps) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onExport} disabled={disabled}>
      <Download className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}
