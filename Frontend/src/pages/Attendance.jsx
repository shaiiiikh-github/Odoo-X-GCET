import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import AttendanceHeatmap from '../components/ui/AttendanceHeatmap'
import { mockAttendance, mockEmployees } from '../data/mockData'
import { Clock, CheckCircle, XCircle, LogIn, LogOut } from 'lucide-react'
import { format, startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns'
import toast from 'react-hot-toast'

const Attendance = () => {
  const { isAdmin } = useAuth()
  const employeeId = 2
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendance)

  const handleCheckIn = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const time = format(new Date(), 'HH:mm')
    
    const existing = attendanceRecords.find(a => a.employeeId === employeeId && a.date === today)
    
    if (existing) {
      toast.error('Already checked in today!')
      return
    }

    const newRecord = {
      id: attendanceRecords.length + 1,
      employeeId,
      date: today,
      checkIn: time,
      checkOut: null,
      status: 'present',
    }
    
    setAttendanceRecords([...attendanceRecords, newRecord])
    toast.success('Checked in successfully!')
  }

  const handleCheckOut = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const time = format(new Date(), 'HH:mm')
    
    const record = attendanceRecords.find(a => a.employeeId === employeeId && a.date === today)
    
    if (!record) {
      toast.error('Please check in first!')
      return
    }

    if (record.checkOut) {
      toast.error('Already checked out today!')
      return
    }

    setAttendanceRecords(
      attendanceRecords.map(a =>
        a.id === record.id ? { ...a, checkOut: time } : a
      )
    )
    toast.success('Checked out successfully!')
  }

  if (isAdmin) {
    const adminColumns = [
      {
        accessorKey: 'employeeId',
        header: 'Employee',
        cell: ({ row }) => {
          const emp = mockEmployees.find(e => e.id === row.original.employeeId)
          return <span className="font-medium">{emp?.name || 'Unknown'}</span>
        },
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => format(new Date(row.original.date), 'MMM dd, yyyy'),
      },
      {
        accessorKey: 'checkIn',
        header: 'Check In',
        cell: ({ row }) => row.original.checkIn || <span className="text-gray-400">-</span>,
      },
      {
        accessorKey: 'checkOut',
        header: 'Check Out',
        cell: ({ row }) => row.original.checkOut || <span className="text-gray-400">-</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.original.status === 'present' ? 'success' : 'danger'} glow>
            {row.original.status}
          </Badge>
        ),
      },
    ]

    const adminData = attendanceRecords

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-500 mt-1">View and manage employee attendance records</p>
        </div>
        <Card className="p-0 overflow-hidden">
          {adminData.length > 0 ? (
            <Table data={adminData} columns={adminColumns} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Clock className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="text-lg font-medium">No attendance records</p>
              <p className="text-sm mt-1">Attendance data will appear here</p>
            </div>
          )}
        </Card>
      </motion.div>
    )
  }

  // Employee View
  const employeeRecords = attendanceRecords.filter(a => a.employeeId === employeeId)
  const todayRecord = employeeRecords.find(a => a.date === format(new Date(), 'yyyy-MM-dd'))
  const canCheckIn = !todayRecord
  const canCheckOut = todayRecord && !todayRecord.checkOut

  const employeeColumns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{format(new Date(row.original.date), 'MMM dd, yyyy')}</p>
          <p className="text-xs text-gray-500">{format(new Date(row.original.date), 'EEEE')}</p>
        </div>
      ),
    },
    {
      accessorKey: 'checkIn',
      header: 'Check In',
      cell: ({ row }) => row.original.checkIn || <span className="text-gray-400">-</span>,
    },
    {
      accessorKey: 'checkOut',
      header: 'Check Out',
      cell: ({ row }) => row.original.checkOut || <span className="text-gray-400">-</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'present' ? 'success' : 'danger'} glow>
          {row.original.status}
        </Badge>
      ),
    },
  ]

  // Weekly attendance
  const getWeekDates = () => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }

  const weekDates = getWeekDates()
  const weeklyData = weekDates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const record = employeeRecords.find(r => r.date === dateStr)
    return {
      date: dateStr,
      dateObj: date,
      checkIn: record?.checkIn || null,
      checkOut: record?.checkOut || null,
      status: record?.status || 'absent',
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500 mt-1">Mark your daily attendance</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-0">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Today's Attendance</h2>
              <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
            </div>
            
            <div className="flex gap-4 mb-6">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCheckIn}
                  disabled={!canCheckIn}
                  className="w-full"
                >
                  <LogIn size={20} className="mr-2" />
                  Check In
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleCheckOut}
                  disabled={!canCheckOut}
                  className="w-full"
                >
                  <LogOut size={20} className="mr-2" />
                  Check Out
                </Button>
              </motion.div>
            </div>

            {todayRecord && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Check In Time</p>
                    <p className="text-2xl font-bold text-gray-900">{todayRecord.checkIn}</p>
                  </div>
                  {todayRecord.checkOut && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Check Out Time</p>
                      <p className="text-2xl font-bold text-gray-900">{todayRecord.checkOut}</p>
                    </div>
                  )}
                  {!todayRecord.checkOut && (
                    <Badge variant="warning" glow>Ongoing</Badge>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </Card>

        <Card className="p-0">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">This Week</h3>
            <AttendanceHeatmap attendanceRecords={attendanceRecords} employeeId={employeeId} />
            <div className="mt-4 space-y-2">
              {weeklyData.map((record, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {format(record.dateObj, 'EEE')}
                    </p>
                    <p className="text-xs text-gray-500">{format(record.dateObj, 'MMM dd')}</p>
                  </div>
                  {record.status === 'present' ? (
                    <CheckCircle className="text-success" size={20} />
                  ) : (
                    <XCircle className="text-danger" size={20} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Attendance History</h2>
        </div>
        {employeeRecords.length > 0 ? (
          <Table data={[...employeeRecords].reverse()} columns={employeeColumns} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Clock className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-lg font-medium">No attendance records</p>
            <p className="text-sm mt-1">Your attendance history will appear here</p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default Attendance
