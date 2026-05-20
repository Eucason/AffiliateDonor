import { motion } from 'framer-motion'
import { ShoppingCart, Heart } from 'lucide-react'
import Card from '@/components/molecules/Card'
import Button from '@/components/atoms/Button'
import { useCart } from '@/context/CartContext'
import { pageTransition, slideUp, staggerContainer, staggerItem } from '@/utils/motionVariants'

const merchProducts = [
  {
    id: 'merch-1',
    name: 'AffiliateDonor T-Shirt',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    description: '100% organic cotton, eco-friendly print',
    causeId: '1',
    causeName: 'Clean Water Initiative',
  },
  {
    id: 'merch-2',
    name: 'Impact Hoodie',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
    description: 'Comfortable fleece, perfect for any season',
    causeId: '2',
    causeName: 'Education for All',
  },
  {
    id: 'merch-3',
    name: 'Donation Mug',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
    description: 'Ceramic mug with inspiring message',
    causeId: '1',
    causeName: 'Clean Water Initiative',
  },
  {
    id: 'merch-4',
    name: 'Eco Tote Bag',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800',
    description: 'Reusable canvas bag with logo',
    causeId: '3',
    causeName: 'Wildlife Conservation',
  },
  {
    id: 'merch-5',
    name: 'Supporter Cap',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
    description: 'Adjustable cap with embroidered logo',
    causeId: '2',
    causeName: 'Education for All',
  },
  {
    id: 'merch-6',
    name: 'Sticker Pack',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1611073539857-7f2cd1d58357?w=800',
    description: 'Set of 10 waterproof stickers',
    causeId: '4',
    causeName: 'Hunger Relief',
  },
]

export default function MerchPage() {
  const { addItem } = useCart()

  const handleAddToCart = (product: typeof merchProducts[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      causeId: product.causeId,
      causeName: product.causeName,
    })

    // Show success animation (you could use a toast notification here)
    alert(`${product.name} added to cart!`)
  }

  return (
    <motion.div {...pageTransition} variants={slideUp} className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Official Merchandise</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Show your support and spread awareness. 100% of profits go directly to causes.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {merchProducts.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <Card className="h-full flex flex-col group">
                <div className="relative h-80 overflow-hidden">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center gap-2 mb-4 text-sm text-primary-600">
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Supports {product.causeName}</span>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">
                        100% to cause
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Info Banner */}
      <section className="bg-primary-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Every Purchase Makes a Difference</h2>
          <p className="text-lg opacity-90">
            All profits from merchandise sales go directly to supporting our partner causes.
            When you wear our merch, you're not just showing support—you're creating real impact.
          </p>
        </div>
      </section>
    </motion.div>
  )
}
