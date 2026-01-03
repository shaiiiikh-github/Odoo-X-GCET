import { motion } from 'framer-motion'

const MiniChart = ({ data, color = 'primary', height = 40 }) => {
  const maxValue = Math.max(...data, 1)
  const barWidth = 100 / data.length

  return (
    <div className="flex items-end gap-1" style={{ height: `${height}px` }}>
      {data.map((value, index) => {
        const barHeight = (value / maxValue) * 100
        const colors = {
          primary: 'bg-primary',
          success: 'bg-success',
          warning: 'bg-warning',
          danger: 'bg-danger',
        }
        
        return (
          <motion.div
            key={index}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${barHeight}%`, opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className={`${colors[color] || colors.primary} rounded-t flex-1`}
            style={{ minHeight: '4px' }}
          />
        )
      })}
    </div>
  )
}

export default MiniChart

