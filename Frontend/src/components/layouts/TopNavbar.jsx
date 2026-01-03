import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, User, Clock, Calendar, DollarSign, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

const TopNavbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/attendance', label: 'Attendance', icon: Clock },
    { path: '/leave', label: 'Leave', icon: Calendar },
    { path: '/payroll', label: 'Payroll', icon: DollarSign },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-full glass-strong border-b border-gray-200/50 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-2xl font-bold text-primary">
              Dayflow
            </Link>
            <nav className="flex items-center gap-1">
              {menuItems.map((item, idx) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                        ${isActive 
                          ? 'bg-primary text-white shadow-md shadow-primary/20' 
                          : 'text-gray-700 hover:bg-gray-100/50'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">Employee</p>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm shadow-md">
              {user?.name?.charAt(0) || 'E'}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNavbar
