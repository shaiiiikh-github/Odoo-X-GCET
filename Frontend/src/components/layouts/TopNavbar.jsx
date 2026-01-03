import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, User, Clock, Calendar, DollarSign, LogOut, Sparkles, Menu, ChevronDown, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { mockEmployees } from '../../data/mockData'
import { format } from 'date-fns'

const TopNavbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user, isAdmin } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg transition-shadow">
                <Sparkles className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-gray-900">Dayflow</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
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
                        relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md shadow-primary/20' 
                          : 'text-gray-700 hover:bg-gray-100/80 hover:text-primary'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100/80 transition-colors"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Employee</p>
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
                      {user?.name?.charAt(0) || 'E'}
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
                              {user?.name?.charAt(0) || 'E'}
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
                        onClick={() => {
                          navigate('/profile')
                          setDropdownOpen(false)
                        }}
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
            
            {/* Mobile Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="sm:hidden flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100/80 rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </motion.button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100/80 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200/50"
          >
            <div className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TopNavbar
