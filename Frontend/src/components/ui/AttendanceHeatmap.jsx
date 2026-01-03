import { format, startOfWeek, eachDayOfInterval, endOfWeek, isToday } from 'date-fns'
import { motion } from 'framer-motion'

const AttendanceHeatmap = ({ attendanceRecords, employeeId }) => {
  const getWeekDates = () => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }

  const weekDates = getWeekDates()
  const employeeRecords = attendanceRecords.filter(a => a.employeeId === employeeId)

  const getIntensity = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const record = employeeRecords.find(r => r.date === dateStr)
    if (!record) return 0
    if (record.status === 'present') return record.checkOut ? 4 : 3
    return 1
  }

  const getColor = (intensity) => {
    const colors = {
      0: 'bg-gray-100',
      1: 'bg-red-100',
      2: 'bg-amber-100',
      3: 'bg-green-200',
      4: 'bg-green-500',
    }
    return colors[intensity] || colors[0]
  }

  return (
    <div className="flex items-center gap-2">
      {weekDates.map((date, idx) => {
        const intensity = getIntensity(date)
        const isCurrentDay = isToday(date)
        return (
          <motion.div
            key={idx}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`
              w-10 h-10 rounded-lg ${getColor(intensity)}
              ${isCurrentDay ? 'ring-2 ring-primary ring-offset-2' : ''}
              flex items-center justify-center text-xs font-medium
              ${intensity >= 3 ? 'text-white' : 'text-gray-600'}
              cursor-pointer hover:scale-110 transition-transform
            `}
            title={format(date, 'EEEE, MMM dd')}
          >
            {format(date, 'd')}
          </motion.div>
        )
      })}
    </div>
  )
}

export default AttendanceHeatmap


