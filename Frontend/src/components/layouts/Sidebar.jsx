import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, Clock, Calendar, DollarSign, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/attendance', label: 'Attendance', icon: Clock },
    { path: '/leave', label: 'Leave Management', icon: Calendar },
    { path: '/payroll', label: 'Payroll', icon: DollarSign },
  ]

  return (
    <div className="w-64 glass-strong border-r border-gray-200/50 h-screen fixed left-0 top-0 flex flex-col z-30">
      <div className="p-6 border-b border-gray-200/50">
        <h1 className="text-2xl font-bold text-primary">Dayflow</h1>
        <p className="text-xs text-gray-500 mt-1">HR Management System</p>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item, idx) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-gray-700 hover:bg-gray-100/50'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
