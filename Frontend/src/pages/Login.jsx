import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
 const { setUser, setIsAdmin } = useAuth()
  const navigate = useNavigate()

 const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  try {
    const response = await fetch("http://127.0.0.1:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 403) {
        toast.error("Your account is pending admin approval")
      } else {
        toast.error(data.msg || "Login failed")
      }
      return
    }

    // 🔐 Save JWT
    localStorage.setItem("token", data.token)

    // 👤 Save user
    localStorage.setItem("dayflow_user", JSON.stringify(data.employee))
    setUser(data.employee)
    setIsAdmin(data.employee.role?.toUpperCase() === "ADMIN")



    toast.success("Login successful!")
    if (data.employee.role === "ADMIN") {
  navigate("/dashboard")
} else {
  navigate("/dashboard")
}

  } catch (error) {
    toast.error("Server error. Please try again.")
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Dayflow</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        <div className="bg-card rounded-lg shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-500">Admin: admin@dayflow.com / password</p>
            <p className="text-xs text-gray-500">Employee: employee@dayflow.com / password</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login


