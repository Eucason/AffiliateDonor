import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus } from 'lucide-react'
import Modal from '@/components/molecules/Modal'
import Button from '@/components/atoms/Button'
import { useCart } from '@/context/CartContext'
import PaymentModal from './PaymentModal'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const handleCheckout = () => {
    onClose()
    setIsPaymentOpen(true)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Shopping Cart" size="lg">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
            <Button variant="primary" className="mt-4" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div>
            <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {item.causeName && (
                      <p className="text-sm text-primary-600">Supports: {item.causeName}</p>
                    )}
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button variant="primary" className="w-full" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={totalPrice}
      />
    </>
  )
}
