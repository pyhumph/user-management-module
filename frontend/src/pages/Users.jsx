import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Users() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '', email: '', password: '', role_id: ''
  })

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    setUsers(res.data)
  }

  const fetchRoles = async () => {
    const res = await axios.get('http://localhost:5000/api/roles', {
      headers: { Authorization: `Bearer ${token}` }
    })
    setRoles(res.data)
  }

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const createUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/users', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('User created successfully')
      setNewUser({ name: '', email: '', password: '', role_id: '' })
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error')
    }
  }

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('User deleted')
      fetchUsers()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error')
    }
  }

  const updateRole = async (userId, roleId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${userId}/role`,
        { role_id: roleId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Role updated')
      fetchUsers()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {message && (
        <div className="mb-4 bg-green-50 text-green-700 px-4 py-2 rounded text-sm">
          {message}
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-6 grid grid-cols-2 gap-3">
          <input
            placeholder="Full name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newUser.role_id}
            onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select role</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button
            onClick={createUser}
            className="col-span-2 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
          >
            Create User
          </button>
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600">Name</th>
              <th className="text-left px-4 py-3 text-gray-600">Email</th>
              <th className="text-left px-4 py-3 text-gray-600">Role</th>
              <th className="text-left px-4 py-3 text-gray-600">Created</th>
              <th className="text-left px-4 py-3 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={roles.find(r => r.name === user.role)?.id || ''}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs focus:outline-none"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}