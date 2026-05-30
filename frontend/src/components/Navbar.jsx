import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg">UserMgmt</span>
        <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
        {user.role === 'admin' && (
          <Link to="/users" className="text-sm hover:underline">Users</Link>
        )}
        {(user.role === 'admin' || user.role === 'manager') && (
          <Link to="/roles" className="text-sm hover:underline">Roles</Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {user.name} 
          <span className="ml-2 bg-blue-500 px-2 py-0.5 rounded text-xs capitalize">
            {user.role}
          </span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm bg-blue-800 px-3 py-1 rounded hover:bg-blue-900"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}