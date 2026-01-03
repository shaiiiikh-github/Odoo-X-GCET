import { useNavigate } from 'react-router-dom'
import { LogOut, Bell, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import { motion } from 'framer-motion'

const AdminHeader = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="h-16 glass-strong border-b border-gray-200/50 fixed top-0 left-64 right-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employees, departments..."
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors relative"
          >
            <Bell size={20} className="text-gray-600" />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"
            />
          </motion.button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm shadow-md">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminHeader
