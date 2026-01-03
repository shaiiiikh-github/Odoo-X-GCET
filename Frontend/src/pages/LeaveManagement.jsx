import { useEffect, useState } from "react"
import { format, differenceInDays } from "date-fns"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import Table from "../components/ui/Table"
import Button from "../components/ui/Button"
import Dialog from "../components/ui/Dialog"

const LeaveManagement = () => {
  const { isAdmin, user } = useAuth()

  const [leaves, setLeaves] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  const [formData, setFormData] = useState({
    type: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  })

  /* =======================
     API FUNCTIONS
  ======================= */

  const fetchMyLeaves = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://127.0.0.1:5000/leave/my-leaves", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    setLeaves(data)
  }

  const fetchPendingLeaves = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://127.0.0.1:5000/leave/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    setLeaves(data)
  }

  const applyLeave = async (payload) => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://127.0.0.1:5000/leave/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      toast.error("Failed to apply leave")
      return
    }

    toast.success("Leave applied successfully")
    fetchMyLeaves()
  }

  const approveLeave = async (id) => {
    const token = localStorage.getItem("token")

    await fetch(`http://127.0.0.1:5000/leave/approve/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    toast.success("Leave approved")
    setConfirmAction(null)
    fetchPendingLeaves()
  }

  const rejectLeave = async (id) => {
    const token = localStorage.getItem("token")

    await fetch(`http://127.0.0.1:5000/leave/reject/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    toast.success("Leave rejected")
    setConfirmAction(null)
    fetchPendingLeaves()
  }

  /* =======================
     EFFECT
  ======================= */

  useEffect(() => {
    if (isAdmin) {
      fetchPendingLeaves()
    } else {
      fetchMyLeaves()
    }
  }, [isAdmin])

  /* =======================
     HANDLERS
  ======================= */

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select dates")
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("End date must be after start date")
      return
    }

    await applyLeave({
      type: formData.type,
      start_date: formData.startDate,
      end_date: formData.endDate,
      reason: formData.reason,
    })

    setFormData({
      type: "Annual Leave",
      startDate: "",
      endDate: "",
      reason: "",
    })

    setIsDialogOpen(false)
  }

  /* =======================
     TABLE COLUMNS
  ======================= */

  const employeeColumns = [
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      header: "Duration",
      cell: ({ row }) =>
        `${differenceInDays(
          new Date(row.original.end_date),
          new Date(row.original.start_date)
        ) + 1} days`,
    },
    {
      header: "Dates",
      cell: ({ row }) =>
        `${format(new Date(row.original.start_date), "MMM dd")} → ${format(
          new Date(row.original.end_date),
          "MMM dd"
        )}`,
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ]

  const adminColumns = [
    {
      accessorKey: "employees.email",
      header: "Employee",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      header: "Dates",
      cell: ({ row }) =>
        `${format(new Date(row.original.start_date), "MMM dd")} → ${format(
          new Date(row.original.end_date),
          "MMM dd"
        )}`,
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="success"
            onClick={() =>
              setConfirmAction({ type: "approve", id: row.original.id })
            }
          >
            Approve
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              setConfirmAction({ type: "reject", id: row.original.id })
            }
          >
            Reject
          </Button>
        </div>
      ),
    },
  ]

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leave Management</h1>

        {!isAdmin && (
          <Button onClick={() => setIsDialogOpen(true)}>
            Apply Leave
          </Button>
        )}
      </div>

      {leaves.length > 0 ? (
        <Table
          data={leaves}
          columns={isAdmin ? adminColumns : employeeColumns}
        />
      ) : (
        <p className="text-gray-500">No leave records found</p>
      )}

      {/* Apply Leave Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
          >
            <option>Annual Leave</option>
            <option>Sick Leave</option>
            <option>Casual Leave</option>
          </select>

          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />

          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />

          <textarea
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />

          <Button type="submit">Submit</Button>
        </form>
      </Dialog>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <Dialog open onClose={() => setConfirmAction(null)}>
          <p className="mb-4">
            Are you sure you want to {confirmAction.type} this leave?
          </p>

          <div className="flex gap-4">
            <Button
              variant="success"
              onClick={() =>
                confirmAction.type === "approve"
                  ? approveLeave(confirmAction.id)
                  : rejectLeave(confirmAction.id)
              }
            >
              Yes
            </Button>

            <Button
              variant="secondary"
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default LeaveManagement
