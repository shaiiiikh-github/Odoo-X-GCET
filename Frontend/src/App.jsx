import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/layouts/Sidebar'
import TopNavbar from './components/layouts/TopNavbar'
import AdminHeader from './components/layouts/AdminHeader'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Profile from './pages/Profile'
import Attendance from './pages/Attendance'
import LeaveManagement from './pages/LeaveManagement'
import Payroll from './pages/Payroll'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const LayoutWrapper = ({ children }) => {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <>
      {isAdmin ? (
        <>
          <Sidebar />
          <AdminHeader />
          <div className="ml-64 pt-16">
            {children}
          </div>
        </>
      ) : (
        <>
          <TopNavbar />
          <div className="pt-16">
            {children}
          </div>
        </>
      )}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Dashboard />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Employees />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Profile />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Attendance />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <LeaveManagement />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll"
            element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Payroll />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

