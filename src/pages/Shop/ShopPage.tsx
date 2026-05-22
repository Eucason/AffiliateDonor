import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Loader2, PackageSearch, Search } from 'lucide-react'
import Card from '@/components/molecules/Card'
import Button from '@/components/atoms/Button'
import { productCatalogAPI, getPublicProductCategories } from '@/services/productCatalogAPI'
import type { PublicProduct } from '@/services/productCatalogAPI'
import { pageTransition, slideUp, staggerContainer, staggerItem } from '@/utils/motionVariants'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function ShopPage() {
  const [products, setProducts] = useState<PublicProduct[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const publishedProducts = await productCatalogAPI.getPublishedProducts('affiliate')
        if (active) {
          setProducts(publishedProducts)
        }
      } catch (requestError) {
        console.error('Failed to load affiliate products:', requestError)
        if (active) {
          setError('Products could not be loaded right now.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(() => getPublicProductCategories(products), [products])

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const search = searchQuery.trim().toLowerCase()
        const searchable = [product.name, product.brand, product.category, product.causeName, product.description]
          .join(' ')
          .toLowerCase()
        const matchesSearch = !search || searchable.includes(search)
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
        return matchesSearch && matchesCategory
      }),
    [products, searchQuery, selectedCategory],
  )

  const handleShopClick = (product: PublicProduct) => {
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-secondary-600 to-primary-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold">Shop & Donate</h1>
          <p className="mx-auto max-w-2xl text-xl opacity-90">
            Every purchase supports a cause. Shop from our curated selection of products from ethical brands.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, brands, causes..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-600" />
            Loading products...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <PackageSearch className="mb-3 h-10 w-10 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">No affiliate products found</h2>
            <p className="mt-2 max-w-md text-sm text-gray-600">Published affiliate products from admin will appear here.</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={staggerItem}>
                <Card className="flex h-full flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-sm font-semibold text-white">
                      {product.donationPercent}% Donated
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-1 text-sm text-gray-500">{product.brand}</div>
                    <h3 className="mb-2 text-xl font-bold">{product.name}</h3>
                    <p className="mb-4 text-sm text-primary-600">Supports: {product.causeName}</p>
                    <p className="mb-5 line-clamp-3 text-sm text-gray-600">{product.description}</p>

                    <div className="mt-auto">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {currencyFormatter.format(product.price)}
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">{product.category}</span>
                      </div>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleShopClick(product)}
                        disabled={!product.affiliateLink}
                      >
                        Shop Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <section className="bg-primary-50 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
          <p className="mb-6 text-gray-600">
            When you shop through our affiliate links, we receive a commission from the retailer.
            A percentage of that commission is donated to the cause associated with each product.
            You pay the same price, but your purchase makes a difference.
          </p>
        </div>
      </section>
    </motion.div>
  )
}
