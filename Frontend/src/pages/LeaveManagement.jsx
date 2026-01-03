import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { mockLeaveRequests, mockEmployees } from '../data/mockData'
import { Plus, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const LeaveManagement = () => {
  const { isAdmin, user } = useAuth()
  const employeeId = 2
  const employee = mockEmployees.find(e => e.id === employeeId)
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [formData, setFormData] = useState({
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    
    if (start > end) {
      toast.error('End date must be after start date')
      return
    }
    
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1

    const newRequest = {
      id: leaveRequests.length + 1,
      employeeId,
      employeeName: employee?.name || 'Employee',
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      status: 'pending',
      appliedDate: format(new Date(), 'yyyy-MM-dd'),
    }

    setLeaveRequests([...leaveRequests, newRequest])
    setIsDialogOpen(false)
    setFormData({ type: 'Annual Leave', startDate: '', endDate: '', reason: '' })
    toast.success('Leave request submitted successfully!')
  }

  const handleApprove = (id) => {
    setConfirmAction({ type: 'approve', id })
  }

  const handleReject = (id) => {
    setConfirmAction({ type: 'reject', id })
  }

  const confirmApprove = () => {
    setLeaveRequests(leaveRequests.map(l => l.id === confirmAction.id ? { ...l, status: 'approved' } : l))
    toast.success('Leave request approved!')
    setConfirmAction(null)
  }

  const confirmReject = () => {
    setLeaveRequests(leaveRequests.map(l => l.id === confirmAction.id ? { ...l, status: 'rejected' } : l))
    toast.success('Leave request rejected!')
    setConfirmAction(null)
  }

  if (isAdmin) {
    const adminColumns = [
      {
        accessorKey: 'employeeName',
        header: 'Employee',
        cell: ({ row }) => <span className="font-medium">{row.original.employeeName}</span>,
      },
      {
        accessorKey: 'type',
        header: 'Type',
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        cell: ({ row }) => format(new Date(row.original.startDate), 'MMM dd, yyyy'),
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        cell: ({ row }) => format(new Date(row.original.endDate), 'MMM dd, yyyy'),
      },
      {
        accessorKey: 'days',
        header: 'Days',
        cell: ({ row }) => `${row.original.days} ${row.original.days === 1 ? 'day' : 'days'}`,
      },
      {
        accessorKey: 'reason',
        header: 'Reason',
        cell: ({ row }) => <span className="text-gray-600">{row.original.reason}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === 'approved' ? 'success' :
              row.original.status === 'pending' ? 'warning' :
              'danger'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          if (row.original.status !== 'pending') return <span className="text-gray-400">-</span>
          return (
            <div className="flex gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => handleApprove(row.original.id)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleReject(row.original.id)}
              >
                Reject
              </Button>
            </div>
          )
        },
      },
    ]

    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1">Review and manage employee leave requests</p>
        </div>
        <Card>
          {leaveRequests.length > 0 ? (
            <Table data={leaveRequests} columns={adminColumns} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="text-lg font-medium">No leave requests</p>
              <p className="text-sm mt-1">Leave requests will appear here</p>
            </div>
          )}
        </Card>

        <Modal
          open={confirmAction !== null}
          onOpenChange={() => setConfirmAction(null)}
          title={confirmAction?.type === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to {confirmAction?.type === 'approve' ? 'approve' : 'reject'} this leave request?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setConfirmAction(null)}>
                Cancel
              </Button>
              <Button
                variant={confirmAction?.type === 'approve' ? 'success' : 'danger'}
                onClick={confirmAction?.type === 'approve' ? confirmApprove : confirmReject}
              >
                {confirmAction?.type === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  // Employee View
  const employeeLeaves = leaveRequests.filter(l => l.employeeId === employeeId)

  const employeeColumns = [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <span className="font-medium">{row.original.type}</span>,
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => format(new Date(row.original.startDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => format(new Date(row.original.endDate), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'days',
      header: 'Days',
      cell: ({ row }) => `${row.original.days} ${row.original.days === 1 ? 'day' : 'days'}`,
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => <span className="text-gray-600">{row.original.reason}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === 'approved' ? 'success' :
            row.original.status === 'pending' ? 'warning' :
            'danger'
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1">Apply for leave and track your requests</p>
        </div>
        <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
          <Plus size={18} className="mr-2" />
          Apply for Leave
        </Button>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Leave History</h2>
        {employeeLeaves.length > 0 ? (
          <Table data={[...employeeLeaves].reverse()} columns={employeeColumns} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-lg font-medium">No leave requests</p>
            <p className="text-sm mt-1">Click "Apply for Leave" to submit a new request</p>
          </div>
        )}
      </Card>

      <Modal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Apply for Leave"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Leave Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
            </select>
          </div>
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reason
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              placeholder="Enter reason for leave..."
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default LeaveManagement
