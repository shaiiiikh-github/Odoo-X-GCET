import { motion } from 'framer-motion'

const Badge = ({ children, variant = 'default', className = '', glow = false }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-success',
    warning: 'bg-amber-100 text-warning',
    danger: 'bg-red-100 text-danger',
    primary: 'bg-blue-100 text-primary',
  }
  
  const glowStyles = glow ? {
    default: 'shadow-lg shadow-gray-500/20',
    success: 'shadow-lg shadow-green-500/30',
    warning: 'shadow-lg shadow-amber-500/30',
    danger: 'shadow-lg shadow-red-500/30',
    primary: 'shadow-lg shadow-blue-500/30',
  }[variant] || '' : ''
  
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
        ${variants[variant]} ${glowStyles} ${className}
      `}
    >
      {children}
    </motion.span>
  )
}

export default Badge
