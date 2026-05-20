import { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '@/components/molecules/Modal'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import CryptoPaymentModal from './CryptoPaymentModal'
import {
  CreditCard,
  DollarSign,
  Smartphone,
  Building,
  Bitcoin,
} from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
}

type PaymentMethod =
  | 'card'
  | 'paypal'
  | 'venmo'
  | 'apple-pay'
  | 'google-pay'
  | 'ach'
  | 'crypto'

export default function PaymentModal({ isOpen, onClose, amount }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCryptoOpen, setIsCryptoOpen] = useState(false)

  const paymentMethods = [
    { id: 'card' as PaymentMethod, name: 'Credit/Debit Card', icon: CreditCard, color: 'blue' },
    { id: 'paypal' as PaymentMethod, name: 'PayPal', icon: DollarSign, color: 'blue' },
    { id: 'venmo' as PaymentMethod, name: 'Venmo', icon: Smartphone, color: 'blue' },
    { id: 'apple-pay' as PaymentMethod, name: 'Apple Pay', icon: Smartphone, color: 'gray' },
    { id: 'google-pay' as PaymentMethod, name: 'Google Pay', icon: DollarSign, color: 'green' },
    { id: 'ach' as PaymentMethod, name: 'Bank Transfer', icon: Building, color: 'indigo' },
    { id: 'crypto' as PaymentMethod, name: 'Cryptocurrency', icon: Bitcoin, color: 'orange' },
  ]

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    alert('Payment successful!')
    onClose()
  }

  const handleCryptoClick = () => {
    setIsCryptoOpen(true)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Payment Method" size="lg">
        <div className="space-y-6">
          {/* Amount Display */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 rounded-xl text-center">
            <p className="text-sm opacity-90 mb-1">Total Amount</p>
            <p className="text-4xl font-bold">${amount.toFixed(2)}</p>
          </div>

          {/* Payment Method Selection */}
          {!selectedMethod && (
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (method.id === 'crypto') {
                      handleCryptoClick()
                    } else {
                      setSelectedMethod(method.id)
                    }
                  }}
                  className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all"
                >
                  <method.icon className="w-12 h-12 mb-3 text-gray-700" />
                  <span className="font-medium text-sm text-center">{method.name}</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Card Payment Form */}
          {selectedMethod === 'card' && (
            <div className="space-y-4">
              <Input label="Card Number" placeholder="1234 5678 9012 3456" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry Date" placeholder="MM/YY" />
                <Input label="CVV" placeholder="123" type="password" />
              </div>
              <Input label="Cardholder Name" placeholder="John Doe" />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedMethod(null)} className="flex-1">
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePayment}
                  isLoading={isProcessing}
                  className="flex-1"
                >
                  Pay ${amount.toFixed(2)}
                </Button>
              </div>
            </div>
          )}

          {/* PayPal */}
          {selectedMethod === 'paypal' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-xl text-center">
                <p className="text-gray-700 mb-4">
                  You will be redirected to PayPal to complete your payment
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedMethod(null)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handlePayment}
                    isLoading={isProcessing}
                    className="flex-1"
                  >
                    Continue to PayPal
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Venmo */}
          {selectedMethod === 'venmo' && (
            <div className="space-y-4">
              <Input label="Venmo Username" placeholder="@username" />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedMethod(null)} className="flex-1">
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePayment}
                  isLoading={isProcessing}
                  className="flex-1"
                >
                  Pay with Venmo
                </Button>
              </div>
            </div>
          )}

          {/* Apple/Google Pay */}
          {(selectedMethod === 'apple-pay' || selectedMethod === 'google-pay') && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <p className="text-gray-700 mb-4">
                  Complete payment with {selectedMethod === 'apple-pay' ? 'Apple Pay' : 'Google Pay'}
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedMethod(null)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handlePayment}
                    isLoading={isProcessing}
                    className="flex-1"
                  >
                    Authorize Payment
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ACH Transfer */}
          {selectedMethod === 'ach' && (
            <div className="space-y-4">
              <Input label="Account Number" placeholder="000123456789" />
              <Input label="Routing Number" placeholder="123456789" />
              <Input label="Account Holder Name" placeholder="John Doe" />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedMethod(null)} className="flex-1">
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePayment}
                  isLoading={isProcessing}
                  className="flex-1"
                >
                  Transfer ${amount.toFixed(2)}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <CryptoPaymentModal
        isOpen={isCryptoOpen}
        onClose={() => setIsCryptoOpen(false)}
        amount={amount}
      />
    </>
  )
}
