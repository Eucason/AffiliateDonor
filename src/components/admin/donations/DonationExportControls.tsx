import { Download } from 'lucide-react'
import Button from '@/components/atoms/Button'
import { buildCsv, downloadCsv } from '@/utils/adminExport'
import type { AdminDonation } from '@/types/adminDonation'

interface DonationExportControlsProps {
  donations: AdminDonation[]
}

export default function DonationExportControls({ donations }: DonationExportControlsProps) {
  const handleExport = () => {
    const csv = buildCsv(donations, [
      { header: 'Donation ID', value: (donation) => donation.id },
      { header: 'Transaction ID', value: (donation) => donation.transactionId },
      { header: 'Donor', value: (donation) => donation.donorName },
      { header: 'Email', value: (donation) => donation.donorEmail },
      { header: 'Campaign', value: (donation) => donation.campaignName },
      { header: 'Amount', value: (donation) => donation.amount },
      { header: 'Currency', value: (donation) => donation.currency },
      { header: 'Method', value: (donation) => donation.method },
      { header: 'Status', value: (donation) => donation.status },
      { header: 'Created At', value: (donation) => donation.createdAt },
      { header: 'Updated At', value: (donation) => donation.updatedAt },
    ])

    downloadCsv(`admin-donations-${new Date().toISOString().slice(0, 10)}.csv`, csv)
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleExport} disabled={donations.length === 0}>
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  )
}
