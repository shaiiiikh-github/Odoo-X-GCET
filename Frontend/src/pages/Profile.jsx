import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { mockEmployees } from '../data/mockData'
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, X } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, isAdmin } = useAuth()
  const employeeId = isAdmin ? 1 : 2
  const employee = mockEmployees.find(e => e.id === employeeId) || mockEmployees[0]
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    address: employee.address,
    department: employee.department,
    position: employee.position,
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    toast.success('Profile updated successfully!')
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      department: employee.department,
      position: employee.position,
    })
    setIsEditing(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            <Edit2 size={18} className="mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User size={64} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.name}</h2>
              <p className="text-gray-600 font-medium">{formData.position}</p>
              <p className="text-sm text-gray-500 mt-1">{formData.department}</p>
              {employee.active !== undefined && (
                <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                  employee.active ? 'bg-green-100 text-success' : 'bg-red-100 text-danger'
                }`}>
                  {employee.active ? 'Active' : 'Inactive'}
                </span>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-3 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing && !isAdmin}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-3 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="text-gray-400 mt-3 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Job Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Briefcase className="text-gray-400 mt-3 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <Input
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!isAdmin || !isEditing}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="text-gray-400 mt-3 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <Input
                    label="Position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    disabled={!isAdmin || !isEditing}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="text-gray-400 mt-3 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <Input
                    label="Join Date"
                    type="date"
                    value={employee.joinDate}
                    disabled
                  />
                </div>
              </div>
            </div>
          </Card>

          {isEditing && (
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={handleCancel}>
                <X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
