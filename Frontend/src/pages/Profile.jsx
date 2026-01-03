import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import { mockEmployees } from '../data/mockData'
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, X, Camera, Upload, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const Profile = () => {
  const { user, isAdmin } = useAuth()
  const employeeId = isAdmin ? 1 : 2
  const employee = mockEmployees.find(e => e.id === employeeId) || mockEmployees[0]
  const fileInputRef = useRef(null)
  
  // Get profile photo from localStorage or use employee photo
  const getStoredPhoto = () => {
    const stored = localStorage.getItem(`profile_photo_${employeeId}`)
    return stored || employee.photo
  }

  const [isEditing, setIsEditing] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(getStoredPhoto())
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

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const photoUrl = reader.result
      setProfilePhoto(photoUrl)
      localStorage.setItem(`profile_photo_${employeeId}`, photoUrl)
      toast.success('Profile picture updated!')
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setProfilePhoto(null)
    localStorage.removeItem(`profile_photo_${employeeId}`)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('Profile picture removed')
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
    setProfilePhoto(getStoredPhoto())
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8"
    >
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
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/10 via-blue-50/50 to-transparent" />
              
              <div className="relative text-center pt-8 pb-6">
                {/* Profile Picture */}
                <div className="relative inline-block mb-4">
                  <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-primary/20">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center">
                        <User size={64} className="text-primary/60" />
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button Overlay */}
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute bottom-0 right-0"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="profile-photo-upload"
                      />
                      <label
                        htmlFor="profile-photo-upload"
                        className="cursor-pointer"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <Camera size={20} className="text-white" />
                        </motion.div>
                      </label>
                    </motion.div>
                  )}
                </div>

                {/* Name and Position */}
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.name}</h2>
                <p className="text-gray-600 font-medium mb-1">{formData.position}</p>
                <p className="text-sm text-gray-500 mb-4">{formData.department}</p>
                
                {/* Status Badge */}
                {employee.active !== undefined && (
                  <Badge
                    variant={employee.active ? 'success' : 'danger'}
                    glow
                  >
                    {employee.active ? 'Active' : 'Inactive'}
                  </Badge>
                )}

                {/* Photo Actions (when editing) */}
                {isEditing && profilePhoto && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleRemovePhoto}
                    >
                      <X size={16} className="mr-1" />
                      Remove Photo
                    </Button>
                  </motion.div>
                )}

                {/* Join Date */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    <span>Joined {format(new Date(employee.joinDate), 'MMM yyyy')}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="text-primary" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="text-gray-400" size={18} />
                    <label className="text-sm font-medium text-gray-700">Email</label>
                  </div>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing && !isAdmin}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="text-gray-400" size={18} />
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                  </div>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="text-gray-400" size={18} />
                    <label className="text-sm font-medium text-gray-700">Address</label>
                  </div>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Job Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Briefcase className="text-warning" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Job Information</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="text-gray-400" size={18} />
                    <label className="text-sm font-medium text-gray-700">Department</label>
                  </div>
                  <Input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!isAdmin || !isEditing}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="text-gray-400" size={18} />
                    <label className="text-sm font-medium text-gray-700">Position</label>
                  </div>
                  <Input
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    disabled={!isAdmin || !isEditing}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-gray-400" size={18} />
                    <label className="text-sm font-medium text-gray-700">Join Date</label>
                  </div>
                  <Input
                    type="date"
                    value={employee.joinDate}
                    disabled
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end gap-3 pt-4"
            >
              <Button variant="secondary" onClick={handleCancel}>
                <X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <CheckCircle size={18} className="mr-2" />
                Save Changes
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Profile
