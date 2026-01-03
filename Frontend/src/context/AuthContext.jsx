import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('dayflow_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Mock login - in real app, this would be an API call
    const mockUsers = {
      'admin@dayflow.com': { id: 1, email: 'admin@dayflow.com', name: 'Admin User', role: 'admin' },
      'employee@dayflow.com': { id: 2, email: 'employee@dayflow.com', name: 'John Doe', role: 'employee' },
    }

    const user = mockUsers[email]
    if (user && password === 'password') {
      setUser(user)
      localStorage.setItem('dayflow_user', JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('dayflow_user')
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


