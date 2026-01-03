import { motion } from 'framer-motion'

const Card = ({ children, className = '', onClick, hover = true, ...props }) => {
  const baseStyles = 'glass rounded-xl shadow-card border border-white/50 p-6'
  const hoverStyles = hover && onClick ? 'cursor-pointer' : ''
  
  const content = (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )

  if (onClick && hover) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    )
  }

  return content
}

export default Card
