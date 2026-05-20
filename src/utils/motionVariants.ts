import { Variants } from 'framer-motion'

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const slideUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 60 },
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export const hoverScale = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 300 },
}

export const hoverLift = {
  y: -8,
  transition: { type: 'spring', stiffness: 300 },
}

export const pageTransition = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  transition: { duration: 0.4, ease: 'easeInOut' },
}
