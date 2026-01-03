import { useNavigate } from 'react-router-dom'
import { LogOut, Bell, Search, Settings, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { mockEmployees } from '../../data/mockData'
import { format } from 'date-fns'

const AdminHeader = () => {
  const { logout, user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const employeeId = isAdmin ? 1 : 2
  const employee = mockEmployees.find(e => e.id === employeeId) || mockEmployees[0]
  
  // Get profile photo from localStorage
  const getStoredPhoto = () => {
    const stored = localStorage.getItem(`profile_photo_${employeeId}`)
    return stored || employee.photo
  }
  const profilePhoto = getStoredPhoto()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setDropdownOpen(false)
  }

  return (
    <div className="h-16 glass-strong border-b border-gray-200/50 fixed top-0 left-64 right-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employees, departments, or anything..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 backdrop-blur-sm text-sm transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100/80 rounded-lg transition-colors relative"
          >
            <Bell size={20} className="text-gray-600" />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white"
            />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100/80 rounded-lg transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
          </motion.button>
          
          <div className="h-8 w-px bg-gray-200 mx-2" />
          
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100/80 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="relative">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20 shadow-md"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-primary/20">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                )}
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 glass-strong rounded-xl shadow-lg border border-gray-200/50 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-200/50 bg-gradient-to-br from-primary/5 to-blue-50/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {profilePhoto ? (
                          <img
                            src={profilePhoto}
                            alt={user?.name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 shadow-md"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md ring-2 ring-primary/20">
                            {user?.name?.charAt(0) || 'A'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{employee?.email}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{employee?.position}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors text-left"
                    >
                      <User size={18} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">View Profile</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        navigate('/profile')
                        setDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors text-left"
                    >
                      <Settings size={18} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Settings</span>
                    </motion.button>
                    
                    <div className="my-1 h-px bg-gray-200" />
                    
                    <div className="px-3 py-2">
                      <p className="text-xs text-gray-500 mb-1">Department</p>
                      <p className="text-sm font-medium text-gray-700">{employee?.department}</p>
                    </div>
                    
                    {employee?.joinDate && (
                      <div className="px-3 py-2">
                        <p className="text-xs text-gray-500 mb-1">Joined</p>
                        <p className="text-sm font-medium text-gray-700">
                          {format(new Date(employee.joinDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    )}
                    
                    <div className="my-1 h-px bg-gray-200" />
                    
                    <motion.button
                      whileHover={{ x: 4 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={18} className="text-danger" />
                      <span className="text-sm font-medium text-danger">Logout</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHeader
