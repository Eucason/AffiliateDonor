import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className, hover = true, onClick }: CardProps) {
  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100',
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={hover ? { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
