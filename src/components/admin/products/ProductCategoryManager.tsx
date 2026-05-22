import { useEffect, useMemo, useState } from 'react'
import { Archive, Edit3, Layers, Plus, Save } from 'lucide-react'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import type { AdminDataTableColumn } from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import { adminProductsAPI, generateProductSlug } from '@/services/admin/adminProductsAPI'
import type { AdminProductCategory, AdminProductType } from '@/types/adminProduct'

interface ProductCategoryManagerProps {
  categories: AdminProductCategory[]
  onCategoriesChange?: (categories: AdminProductCategory[]) => void
}

type CategoryDraft = Pick<AdminProductCategory, 'id' | 'name' | 'slug' | 'type' | 'description' | 'productCount' | 'status' | 'updatedAt'>

export default function ProductCategoryManager({ categories, onCategoriesChange }: ProductCategoryManagerProps) {
  const [localCategories, setLocalCategories] = useState(categories)
  const [draft, setDraft] = useState<CategoryDraft>(() => createDraftCategory())
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    setLocalCategories(categories)
  }, [categories])

  const activeCount = useMemo(
    () => localCategories.filter((category) => category.status === 'active').length,
    [localCategories],
  )

  const updateLocalCategories = (nextCategories: AdminProductCategory[]) => {
    setLocalCategories(nextCategories)
    onCategoriesChange?.(nextCategories)
  }

  const updateDraft = <Key extends keyof CategoryDraft>(key: Key, value: CategoryDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const saveCategory = async () => {
    if (!draft.name.trim()) {
      setActionError('Category name is required.')
      return
    }

    try {
      setBusy(true)
      setActionError(null)
      const category = await adminProductsAPI.saveCategory({
        ...draft,
        name: draft.name.trim(),
        slug: draft.slug.trim() || generateProductSlug(draft.name),
        description: draft.description.trim(),
      })
      const nextCategories = [
        category,
        ...localCategories.filter((current) => current.id !== category.id),
      ].sort((first, second) => first.name.localeCompare(second.name))
      updateLocalCategories(nextCategories)
      setDraft(createDraftCategory())
    } catch (requestError) {
      console.error('Failed to save product category:', requestError)
      setActionError('Category could not be saved.')
    } finally {
      setBusy(false)
    }
  }

  const archiveCategory = async (category: AdminProductCategory) => {
    const updated = { ...category, status: 'archived' as const }
    try {
      setBusy(true)
      setActionError(null)
      const saved = await adminProductsAPI.saveCategory(updated)
      updateLocalCategories(localCategories.map((current) => (current.id === saved.id ? saved : current)))
    } catch (requestError) {
      console.error('Failed to archive product category:', requestError)
      setActionError('Category could not be archived.')
    } finally {
      setBusy(false)
    }
  }

  const columns: AdminDataTableColumn<AdminProductCategory>[] = [
    {
      key: 'name',
      header: 'Category',
      cell: (category) => (
        <div>
          <p className="font-semibold text-gray-900">{category.name}</p>
          <p className="mt-1 text-xs text-gray-500">{category.slug}</p>
          <p className="mt-1 max-w-xl text-sm text-gray-600">{category.description}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (category) => <AdminStatusBadge status={category.type} label={category.type} tone={category.type === 'merch' ? 'purple' : category.type === 'affiliate' ? 'blue' : 'gray'} />,
    },
    {
      key: 'products',
      header: 'Products',
      cell: (category) => category.productCount.toLocaleString(),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (category) => <AdminStatusBadge status={category.status} />,
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      className: 'text-right',
      cell: (category) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setDraft(category)}
            className="rounded-lg p-2 text-primary-600 hover:bg-primary-50 hover:text-primary-800"
            title="Edit category"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          {category.status !== 'archived' && (
            <button
              type="button"
              onClick={() => archiveCategory(category)}
              disabled={busy}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              title="Archive category"
            >
              <Archive className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Product Categories</h2>
              <p className="mt-1 text-sm text-gray-600">{activeCount} active categories across affiliate and merch products.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setDraft(createDraftCategory())} className="gap-2">
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </div>
        </div>
        <AdminDataTable
          rows={localCategories}
          columns={columns}
          getRowKey={(category) => category.id}
          emptyTitle="No product categories"
          emptyDescription="Create categories to organize affiliate and merch products."
        />
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary-600" />
          <h2 className="text-base font-semibold text-gray-900">Category Editor</h2>
        </div>
        <div className="mt-5 space-y-4">
          {actionError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {actionError}
            </div>
          )}
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Name</span>
            <input
              value={draft.name}
              onChange={(event) => {
                const name = event.target.value
                setDraft((current) => ({ ...current, name, slug: current.slug ? current.slug : generateProductSlug(name) }))
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Slug</span>
            <input
              value={draft.slug}
              onChange={(event) => updateDraft('slug', generateProductSlug(event.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Product Type</span>
            <select
              value={draft.type}
              onChange={(event) => updateDraft('type', event.target.value as AdminProductType | 'all')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="all">All products</option>
              <option value="affiliate">Affiliate</option>
              <option value="merch">Merch</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Status</span>
            <select
              value={draft.status}
              onChange={(event) => updateDraft('status', event.target.value as AdminProductCategory['status'])}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Description</span>
            <textarea
              rows={4}
              value={draft.description}
              onChange={(event) => updateDraft('description', event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>
          <Button type="button" variant="primary" onClick={saveCategory} disabled={busy} className="w-full gap-2">
            <Save className="h-4 w-4" />
            Save Category
          </Button>
        </div>
      </section>
    </div>
  )
}

function createDraftCategory(): CategoryDraft {
  return {
    id: `cat-${Date.now()}`,
    name: '',
    slug: '',
    type: 'all',
    description: '',
    productCount: 0,
    status: 'active',
    updatedAt: new Date().toISOString(),
  }
}
