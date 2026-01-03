import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import KPICard from '../components/ui/KPICard'
import Badge from '../components/ui/Badge'
import { 
  Users, Clock, Calendar, DollarSign, CheckCircle, XCircle, 
  TrendingUp, User as UserIcon, ArrowRight
} from 'lucide-react'
import { mockEmployees, mockAttendance, mockLeaveRequests, mockPayroll } from '../data/mockData'
import { useNavigate } from 'react-router-dom'
import { format, startOfMonth, addMonths } from 'date-fns'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const Dashboard = () => {
  const { isAdmin, user } = useAuth()
  const navigate = useNavigate()

  if (isAdmin) {
    const pendingLeaves = mockLeaveRequests.filter(l => l.status === 'pending').length
    const today = format(new Date(), 'yyyy-MM-dd')
    const presentToday = mockAttendance.filter(a => a.date === today && a.status === 'present').length
    const totalEmployees = mockEmployees.length
    const activeEmployees = mockEmployees.filter(e => e.active).length
    const approvedLeaves = mockLeaveRequests.filter(l => l.status === 'approved').length
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <KPICard
            title="Total Employees"
            value={totalEmployees}
            subtitle={`${activeEmployees} active`}
            icon={Users}
            iconColor="primary"
            onClick={() => navigate('/employees')}
          />
          <KPICard
            title="Present Today"
            value={presentToday}
            subtitle={`of ${totalEmployees} employees`}
            icon={CheckCircle}
            iconColor="success"
            onClick={() => navigate('/attendance')}
          />
          <KPICard
            title="Pending Leaves"
            value={pendingLeaves}
            subtitle={`${approvedLeaves} approved`}
            icon={Calendar}
            iconColor="warning"
            onClick={() => navigate('/leave')}
          />
          <KPICard
            title="Payroll"
            value="Active"
            subtitle={format(new Date(), 'MMM yyyy')}
            icon={DollarSign}
            iconColor="purple"
            onClick={() => navigate('/payroll')}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="!p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Leave Requests</h2>
                <button
                  onClick={() => navigate('/leave')}
                  className="text-sm text-primary hover:underline flex items-center gap-1 group"
                >
                  View all
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="space-y-3">
                {mockLeaveRequests.slice(0, 5).length > 0 ? (
                  mockLeaveRequests.slice(0, 5).map((leave, idx) => (
                    <motion.div
                      key={leave.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{leave.employeeName}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {leave.type} • {leave.days} {leave.days === 1 ? 'day' : 'days'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge
                        variant={
                          leave.status === 'approved' ? 'success' :
                          leave.status === 'pending' ? 'warning' :
                          'danger'
                        }
                        glow
                      >
                        {leave.status}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="mx-auto mb-2 text-gray-300" size={32} />
                    <p>No leave requests</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="!p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Today's Attendance</h2>
                <button
                  onClick={() => navigate('/attendance')}
                  className="text-sm text-primary hover:underline flex items-center gap-1 group"
                >
                  View all
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="space-y-3">
                {mockAttendance.filter(a => a.date === today).slice(0, 5).length > 0 ? (
                  mockAttendance.filter(a => a.date === today).slice(0, 5).map((att, idx) => {
                    const employee = mockEmployees.find(e => e.id === att.employeeId)
                    return (
                      <motion.div
                        key={att.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{employee?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {att.checkIn ? `${att.checkIn} - ${att.checkOut || 'Ongoing'}` : 'Absent'}
                          </p>
                        </div>
                        {att.status === 'present' ? (
                          <CheckCircle className="text-success" size={20} />
                        ) : (
                          <XCircle className="text-danger" size={20} />
                        )}
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="mx-auto mb-2 text-gray-300" size={32} />
                    <p>No attendance records today</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Employee Dashboard
  const employeeId = 2
  const employee = mockEmployees.find(e => e.id === employeeId) || mockEmployees[0]
  const employeeAttendance = mockAttendance.filter(a => a.employeeId === employeeId)
  const todayRecord = employeeAttendance.find(a => a.date === format(new Date(), 'yyyy-MM-dd'))
  const employeeLeaves = mockLeaveRequests.filter(l => l.employeeId === employeeId)
  const pendingLeaves = employeeLeaves.filter(l => l.status === 'pending').length
  const nextPayrollDate = format(startOfMonth(addMonths(new Date(), 1)), 'MMM dd, yyyy')
  const leavesLeft = employee.leavesLeft || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <KPICard
          title="Attendance Today"
          value={todayRecord?.status === 'present' ? 'Present' : 'Absent'}
          subtitle={todayRecord?.checkIn ? `Checked in at ${todayRecord.checkIn}` : 'Not checked in'}
          icon={Clock}
          iconColor={todayRecord?.status === 'present' ? 'success' : 'default'}
          onClick={() => navigate('/attendance')}
        />
        <KPICard
          title="Leaves Left"
          value={leavesLeft}
          subtitle={`${pendingLeaves} pending`}
          icon={Calendar}
          iconColor="warning"
          onClick={() => navigate('/leave')}
        />
        <KPICard
          title="Next Payroll"
          value={nextPayrollDate.split(' ')[0]}
          subtitle={`${nextPayrollDate.split(' ')[1]}, Monthly`}
          icon={DollarSign}
          iconColor="purple"
          onClick={() => navigate('/payroll')}
        />
        <KPICard
          title="Profile"
          value="View"
          subtitle={employee.position}
          icon={UserIcon}
          iconColor="primary"
          onClick={() => navigate('/profile')}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="!p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Attendance</h2>
            <div className="space-y-3">
              {employeeAttendance.slice(-5).reverse().length > 0 ? (
                employeeAttendance.slice(-5).reverse().map((att, idx) => (
                  <motion.div
                    key={att.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{format(new Date(att.date), 'MMM dd, yyyy')}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {att.checkIn ? `${att.checkIn} - ${att.checkOut || 'Ongoing'}` : 'Absent'}
                      </p>
                    </div>
                    {att.status === 'present' ? (
                      <CheckCircle className="text-success" size={20} />
                    ) : (
                      <XCircle className="text-danger" size={20} />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="mx-auto mb-2 text-gray-300" size={32} />
                  <p>No attendance records</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="!p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Leave Status</h2>
            <div className="space-y-3">
              {employeeLeaves.slice(-5).reverse().length > 0 ? (
                employeeLeaves.slice(-5).reverse().map((leave, idx) => (
                  <motion.div
                    key={leave.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{leave.type}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Badge
                      variant={
                        leave.status === 'approved' ? 'success' :
                        leave.status === 'pending' ? 'warning' :
                        'danger'
                      }
                      glow
                    >
                      {leave.status}
                    </Badge>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto mb-2 text-gray-300" size={32} />
                  <p>No leave requests</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard
