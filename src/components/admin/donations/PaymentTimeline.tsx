import { CheckCircle2, Clock, RotateCcw, XCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatAdminDateTime } from '@/utils/adminFormatters'
import type { AdminDonationTimelineEvent } from '@/types/adminDonation'

interface PaymentTimelineProps {
  events: AdminDonationTimelineEvent[]
}

export default function PaymentTimeline({ events }: PaymentTimelineProps) {
  return (
    <ol className="space-y-4">
      {events.map((event, index) => (
        <li key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full ring-4 ring-white',
                event.status === 'successful' && 'bg-green-100 text-green-700',
                event.status === 'pending' && 'bg-yellow-100 text-yellow-700',
                event.status === 'failed' && 'bg-red-100 text-red-700',
                event.status === 'refunded' && 'bg-purple-100 text-purple-700',
                event.status === 'reviewed' && 'bg-blue-100 text-blue-700',
              )}
            >
              {event.status === 'successful' && <CheckCircle2 className="h-5 w-5" />}
              {event.status === 'pending' && <Clock className="h-5 w-5" />}
              {event.status === 'failed' && <XCircle className="h-5 w-5" />}
              {event.status === 'refunded' && <RotateCcw className="h-5 w-5" />}
              {event.status === 'reviewed' && <CheckCircle2 className="h-5 w-5" />}
            </div>
            {index < events.length - 1 && <div className="mt-2 h-full w-px bg-gray-200" />}
          </div>
          <div className="min-w-0 pb-2">
            <p className="font-semibold text-gray-900">{event.label}</p>
            <p className="text-sm text-gray-600">{event.description}</p>
            <p className="mt-1 text-xs text-gray-500">{formatAdminDateTime(event.occurredAt)}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
