import { useNavigate } from 'react-router-dom'
import Modal from '@/components/molecules/Modal'
import SignupForm from './SignupForm'

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onBackToLogin: () => void
}

export default function SignupModal({ isOpen, onClose, onBackToLogin }: SignupModalProps) {
  const navigate = useNavigate()

  const handleSuccess = () => {
    onClose()
    navigate('/dashboard')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Your Account" size="md">
      <div className="p-6">
        <p className="text-gray-600 mb-6 text-center">
          Join us to track your impact and make a difference
        </p>
        <SignupForm onSuccess={handleSuccess} onBackToLogin={onBackToLogin} />
      </div>
    </Modal>
  )
}
