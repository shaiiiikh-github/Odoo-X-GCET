import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import { mockPayroll, mockEmployees } from '../data/mockData'
import { DollarSign, Edit2 } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const Payroll = () => {
  const { isAdmin } = useAuth()
  const employeeId = 2
  const [payrollData, setPayrollData] = useState(mockPayroll)
  const [editingPayroll, setEditingPayroll] = useState(null)
  const [editFormData, setEditFormData] = useState({
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
  })

  const handleEditClick = (payroll) => {
    setEditFormData({
      basicSalary: payroll.basicSalary,
      allowances: payroll.allowances,
      deductions: payroll.deductions,
    })
    setEditingPayroll(payroll)
  }

  const handleSaveEdit = () => {
    if (!editingPayroll) return
    
    const netSalary = editFormData.basicSalary + editFormData.allowances - editFormData.deductions
    
    setPayrollData(payrollData.map(p => {
      if (p.id === editingPayroll.id) {
        return {
          ...p,
          basicSalary: editFormData.basicSalary,
          allowances: editFormData.allowances,
          deductions: editFormData.deductions,
          netSalary,
        }
      }
      return p
    }))
    
    toast.success('Salary updated successfully!')
    setEditingPayroll(null)
  }

  if (isAdmin) {
    const adminColumns = [
      {
        accessorKey: 'employeeName',
        header: 'Employee',
        cell: ({ row }) => <span className="font-medium">{row.original.employeeName}</span>,
      },
      {
        accessorKey: 'basicSalary',
        header: 'Basic Salary',
        cell: ({ row }) => `$${row.original.basicSalary.toLocaleString()}`,
      },
      {
        accessorKey: 'allowances',
        header: 'Allowances',
        cell: ({ row }) => `$${row.original.allowances.toLocaleString()}`,
      },
      {
        accessorKey: 'deductions',
        header: 'Deductions',
        cell: ({ row }) => `$${row.original.deductions.toLocaleString()}`,
      },
      {
        accessorKey: 'netSalary',
        header: 'Net Salary',
        cell: ({ row }) => (
          <span className="font-bold text-primary">
            ${row.original.netSalary.toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'month',
        header: 'Month',
        cell: ({ row }) => format(new Date(row.original.month + '-01'), 'MMMM yyyy'),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditClick(row.original)}
          >
            <Edit2 size={16} className="mr-1" />
            Edit
          </Button>
        ),
      },
    ]

    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-500 mt-1">Manage employee salaries and payroll</p>
        </div>
        <Card>
          {payrollData.length > 0 ? (
            <Table data={payrollData} columns={adminColumns} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="text-lg font-medium">No payroll data</p>
              <p className="text-sm mt-1">Payroll information will appear here</p>
            </div>
          )}
        </Card>

        <Modal
          open={editingPayroll !== null}
          onOpenChange={() => setEditingPayroll(null)}
          title={`Edit Salary - ${editingPayroll?.employeeName}`}
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Basic Salary"
              type="number"
              value={editFormData.basicSalary}
              onChange={(e) => setEditFormData({ ...editFormData, basicSalary: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              label="Allowances"
              type="number"
              value={editFormData.allowances}
              onChange={(e) => setEditFormData({ ...editFormData, allowances: parseFloat(e.target.value) || 0 })}
              required
            />
            <Input
              label="Deductions"
              type="number"
              value={editFormData.deductions}
              onChange={(e) => setEditFormData({ ...editFormData, deductions: parseFloat(e.target.value) || 0 })}
              required
            />
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Net Salary</span>
                <span className="text-2xl font-bold text-primary">
                  ${(editFormData.basicSalary + editFormData.allowances - editFormData.deductions).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setEditingPayroll(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveEdit}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  // Employee View
  const employeePayroll = payrollData.find(p => p.employeeId === employeeId) || payrollData[0]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
        <p className="text-gray-500 mt-1">View your salary breakdown</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Salary Breakdown</h2>
              <p className="text-sm text-gray-500">
                {format(new Date(employeePayroll.month + '-01'), 'MMMM yyyy')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Basic Salary</span>
              <span className="font-bold text-gray-900">
                ${employeePayroll.basicSalary.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Allowances</span>
              <span className="font-bold text-success">
                +${employeePayroll.allowances.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Deductions</span>
              <span className="font-bold text-danger">
                -${employeePayroll.deductions.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-6 bg-primary/5 rounded-lg border-2 border-primary">
              <span className="font-bold text-gray-900 text-lg">Net Salary</span>
              <span className="text-3xl font-bold text-primary">
                ${employeePayroll.netSalary.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-6">Payroll Information</h3>
          <div className="space-y-4">
            <div className="pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Employee ID</p>
              <p className="font-medium text-gray-900">{employeePayroll.employeeId}</p>
            </div>
            <div className="pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Pay Period</p>
              <p className="font-medium text-gray-900">
                {format(new Date(employeePayroll.month + '-01'), 'MMMM yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-success">
                Paid
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Payroll
