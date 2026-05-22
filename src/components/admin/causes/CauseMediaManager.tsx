import { Image } from 'lucide-react'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import type { AdminCause } from '@/types/adminCause'

interface CauseMediaManagerProps {
  cause: AdminCause
}

export default function CauseMediaManager({ cause }: CauseMediaManagerProps) {
  return (
    <AdminSectionCard
      title="Campaign Media"
      description="Media library integration points for the campaign hero and gallery."
    >
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {cause.mainImage ? (
            <img src={cause.mainImage} alt={cause.name} className="h-56 w-full object-cover" />
          ) : (
            <div className="flex h-56 items-center justify-center bg-gray-100 text-gray-500">
              <Image className="mr-2 h-5 w-5" />
              Missing hero image
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Image className="h-4 w-4 text-gray-500" />
            Gallery
          </div>
          {cause.galleryImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {cause.galleryImages.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt={`${cause.name} gallery`}
                  className="aspect-video rounded-lg border border-gray-200 object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
              No gallery assets have been attached yet.
            </p>
          )}
        </div>
      </div>
    </AdminSectionCard>
  )
}
