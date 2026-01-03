import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import { mockEmployees } from '../data/mockData'
import { Users, Mail, Phone, MapPin, Briefcase, Calendar, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

const Employees = () => {
  const { isAdmin } = useAuth()
  const [employees] = useState(mockEmployees)

  if (!isAdmin) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Access denied. Admin only.</p>
        </div>
      </div>
    )
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="text-gray-400" size={20} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.original.name}</p>
            <p className="text-sm text-gray-500">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Briefcase className="text-gray-400" size={16} />
          <span>{row.original.department}</span>
        </div>
      ),
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ row }) => row.original.position,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="text-gray-400" size={16} />
          <span>{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 max-w-xs">
          <MapPin className="text-gray-400 flex-shrink-0" size={16} />
          <span className="truncate">{row.original.address}</span>
        </div>
      ),
    },
    {
      accessorKey: 'joinDate',
      header: 'Join Date',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="text-gray-400" size={16} />
          <span>{format(new Date(row.original.joinDate), 'MMM dd, yyyy')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DollarSign className="text-gray-400" size={16} />
          <span className="font-medium">${row.original.salary.toLocaleString()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.active ? 'success' : 'danger'}>
          {row.original.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ]

  const activeCount = employees.filter(emp => emp.active).length
  const inactiveCount = employees.filter(emp => !emp.active).length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage and view all employee details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-primary" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Employees</p>
              <p className="text-3xl font-bold text-success">{activeCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="text-success" size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Inactive Employees</p>
              <p className="text-3xl font-bold text-danger">{inactiveCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Users className="text-danger" size={24} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Table data={employees} columns={columns} />
      </Card>
    </div>
  )
}

export default Employees


