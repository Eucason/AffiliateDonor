import { AlertTriangle, CheckCircle2, FileText, Image, MousePointerClick } from 'lucide-react'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import { assetNeedsAlt } from '@/services/admin/adminMediaAPI'
import type { AdminMediaAsset } from '@/types/adminMedia'
import { cn } from '@/utils/cn'

interface MediaLibraryGridProps {
  assets: AdminMediaAsset[]
  selectedId?: string | null
  selectable?: boolean
  onSelect: (asset: AdminMediaAsset) => void
  onDetails?: (asset: AdminMediaAsset) => void
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export default function MediaLibraryGrid({
  assets,
  selectedId,
  selectable = false,
  onSelect,
  onDetails,
}: MediaLibraryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {assets.map((asset) => {
        const missingAlt = assetNeedsAlt(asset) && !asset.altText.trim()

        return (
          <article
            key={asset.id}
            className={cn(
              'overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md',
              selectedId === asset.id && 'border-primary-500 ring-2 ring-primary-100',
            )}
          >
            <button
              type="button"
              onClick={() => (selectable ? onSelect(asset) : onDetails?.(asset) ?? onSelect(asset))}
              className="block w-full text-left"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                {asset.type === 'image' || asset.type === 'svg' ? (
                  <img src={asset.thumbnailUrl ?? asset.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <FileText className="h-10 w-10" />
                  </div>
                )}
                {missingAlt && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-800 ring-1 ring-yellow-200">
                    <AlertTriangle className="h-3 w-3" />
                    Alt needed
                  </span>
                )}
                {asset.usage.length > 0 && (
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-700">
                    <MousePointerClick className="h-3 w-3" />
                    {asset.usage.length}
                  </span>
                )}
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">{asset.title}</h3>
                  <p className="mt-1 line-clamp-1 text-xs text-gray-500">{asset.fileName}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AdminStatusBadge status={asset.type} label={asset.type.toUpperCase()} tone="blue" />
                  {asset.altText.trim() ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Alt text
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700">
                      <Image className="h-3 w-3" />
                      Missing alt
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatBytes(asset.sizeBytes)}</span>
                  <span>{dateFormatter.format(new Date(asset.updatedAt))}</span>
                </div>
              </div>
            </button>
          </article>
        )
      })}
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes === 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`
}
