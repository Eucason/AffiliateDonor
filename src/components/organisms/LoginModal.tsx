import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '@/components/molecules/Modal'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const navigate = useNavigate()
  const [isSignupMode, setIsSignupMode] = useState(false)

  const handleSuccess = () => {
    onClose()
    setIsSignupMode(false)
    navigate('/dashboard')
  }

  const handleBackToLogin = () => {
    setIsSignupMode(false)
  }

  const handleSignupClick = () => {
    setIsSignupMode(true)
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {
        onClose()
        setIsSignupMode(false)
      }} 
      title={isSignupMode ? "Create Your Account" : "Sign In to Your Account"} 
      size="md"
    >
      <div className="p-6">
        <p className="text-gray-600 mb-6 text-center">
          {isSignupMode 
            ? "Join us to track your impact and make a difference" 
            : "Enter your credentials to access your dashboard and track your impact"}
        </p>
        {isSignupMode ? (
          <SignupForm onSuccess={handleSuccess} onBackToLogin={handleBackToLogin} />
        ) : (
          <LoginForm onSuccess={handleSuccess} onClose={onClose} onSignupClick={handleSignupClick} />
        )}
      </div>
    </Modal>
  )
}
