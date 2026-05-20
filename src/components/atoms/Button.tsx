import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 shadow-lg hover:shadow-xl',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
      ghost: 'text-gray-700 hover:bg-gray-100',
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="spinner mr-2"></div>
        ) : null}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
