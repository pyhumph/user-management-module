import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Roles() {
  const { token, user } = useAuth()
  const [roles, setRoles] = useState([])
  const [newRole, setNewRole] = useState('')
  const [message, setMessage] = useState('')

  const fetchRoles = async () => {
    const res = await axios.get('http://localhost:5000/api/roles', {
      headers: { Authorization: `Bearer ${token}` }
    })
    setRoles(res.data)
  }

  useEffect(() => { fetchRoles() }, [])

  const createRole = async () => {
    try {
      await axios.post('http://localhost:5000/api/roles',
        { name: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Role created successfully')
      setNewRole('')
      fetchRoles()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error')
    }
  }

  const deleteRole = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/roles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('Role deleted')
      fetchRoles()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Roles Management</h1>

      {message && (
        <div className="mb-4 bg-green-50 text-green-700 px-4 py-2 rounded text-sm">
          {message}
        </div>
      )}

      {user.role === 'admin' && (
        <div className="flex gap-2 mb-6">
          <input
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="New role name"
            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createRole}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Add Role
          </button>
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600">ID</th>
              <th className="text-left px-4 py-3 text-gray-600">Role Name</th>
              {user.role === 'admin' && (
                <th className="text-left px-4 py-3 text-gray-600">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">#{role.id}</td>
                <td className="px-4 py-3 font-medium capitalize">{role.name}</td>
                {user.role === 'admin' && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteRole(role.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}