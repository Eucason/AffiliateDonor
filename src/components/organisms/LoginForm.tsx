import { useState } from 'react'
import { Chrome } from 'lucide-react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { useAuth } from '@/context/AuthContext'

interface LoginFormProps {
  onSuccess?: () => void
  onClose?: () => void
  onSignupClick?: () => void
}

export default function LoginForm({ onSuccess, onClose, onSignupClick }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!email || !password) {
        setError('Please enter both email and password')
        setIsLoading(false)
        return
      }
      await signIn(email, password)
      onSuccess?.()
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to sign in. Please check your credentials.'
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setIsLoading(true)

    try {
      await signInWithGoogle()
      onSuccess?.()
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to sign in with Google'
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Email/Password Form */}
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign In with Email
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Chrome className="w-4 h-4 mr-2" />
        Sign In with Google
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSignupClick}
          className="font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
        >
          Sign up
        </button>
      </p>
    </div>
  )
}
