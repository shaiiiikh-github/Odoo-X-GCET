import { useEffect, useState, useRef } from 'react'

const AnimatedNumber = ({ value, duration = 1000, decimals = 0, startOnMount = true }) => {
  const [displayValue, setDisplayValue] = useState(startOnMount ? 0 : value)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current && !startOnMount) {
      setDisplayValue(value)
      return
    }

    const startValue = 0
    const endValue = typeof value === 'number' ? value : parseFloat(value) || 0
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (endValue - startValue) * easeOutQuart
      
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
        hasAnimated.current = true
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration, startOnMount])

  return <span>{displayValue.toFixed(decimals)}</span>
}

export default AnimatedNumber

