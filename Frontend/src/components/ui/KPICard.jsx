import { motion } from 'framer-motion'
import Card from './Card'
import AnimatedNumber from './AnimatedNumber'

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = 'primary',
  onClick,
  trend,
  className = '' 
}) => {
  const iconColors = {
    primary: 'bg-blue-50 text-primary',
    success: 'bg-green-50 text-success',
    warning: 'bg-amber-50 text-warning',
    danger: 'bg-red-50 text-danger',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card 
        onClick={onClick}
        className="!p-6 relative overflow-hidden group"
        hover={!!onClick}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent opacity-50 rounded-full -mr-16 -mt-16 group-hover:opacity-70 transition-opacity" />
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                {trend && (
                  <span className={trend > 0 ? 'text-success' : 'text-danger'}>
                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                  </span>
                )}
                {subtitle}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconColors[iconColor]}`}>
            <Icon size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default KPICard


