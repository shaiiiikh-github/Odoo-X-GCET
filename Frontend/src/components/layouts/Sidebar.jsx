import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, Clock, Calendar, DollarSign, Users, Sparkles } from 'lucide-react'
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-gray-200/50"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">Dayflow</h1>
            <p className="text-xs text-gray-500">HR Management</p>
          </div>
        </div>
      </motion.div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
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
                    group relative flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30' 
                      : 'text-gray-700 hover:bg-gray-100/80 hover:text-primary'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon 
                    size={20} 
                    className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary'} transition-colors`}
                  />
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-primary'} transition-colors`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200/50">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-blue-50 rounded-xl border border-primary/20">
          <p className="text-xs font-medium text-gray-700 mb-1">Need help?</p>
          <p className="text-xs text-gray-500">Contact support</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
