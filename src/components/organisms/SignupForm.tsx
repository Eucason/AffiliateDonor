import { useState } from 'react'
import { Chrome } from 'lucide-react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { useAuth } from '@/context/AuthContext'

interface SignupFormProps {
  onSuccess?: () => void
  onBackToLogin?: () => void
}

export default function SignupForm({ onSuccess, onBackToLogin }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!email || !password || !confirmPassword) {
        setError('Please fill in all fields')
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setIsLoading(false)
        return
      }

      await signUp(email, password)
      onSuccess?.()
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create account. Please try again.'
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setIsLoading(true)

    try {
      await signInWithGoogle()
      onSuccess?.()
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to sign up with Google'
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
      <form onSubmit={handleEmailSignUp} className="space-y-4">
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
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          Create Account
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

      {/* Google Sign Up */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center"
        onClick={handleGoogleSignUp}
        disabled={isLoading}
      >
        <Chrome className="w-4 h-4 mr-2" />
        Sign Up with Google
      </Button>

      {/* Back to Login Link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onBackToLogin}
          className="font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
