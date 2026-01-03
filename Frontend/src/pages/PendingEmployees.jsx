import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const PendingEmployees = () => {
  const [employees, setEmployees] = useState([])

  const fetchPending = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://127.0.0.1:5000/admin/pending-employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    setEmployees(data)
  }

  const approveEmployee = async (id) => {
    const token = localStorage.getItem("token")

    await fetch(`http://127.0.0.1:5000/admin/approve-employee/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    toast.success("Employee approved")
    fetchPending()
  }

  useEffect(() => {
    fetchPending()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pending Employees</h1>

      {employees.length === 0 ? (
        <p>No pending employees 🎉</p>
      ) : (
        employees.map(emp => (
          <div key={emp.id} className="flex justify-between items-center bg-gray-100 p-4 mb-3 rounded">
            <div>
              <p className="font-medium">{emp.email}</p>
              <p className="text-sm text-gray-500">{emp.role}</p>
            </div>
            <button
              onClick={() => approveEmployee(emp.id)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default PendingEmployees
