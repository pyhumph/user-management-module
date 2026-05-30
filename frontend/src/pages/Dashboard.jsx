import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  const accessMap = {
    admin: ['View Users', 'Create Users', 'Delete Users', 'View Roles', 'Create Roles', 'Assign Roles'],
    manager: ['View Roles'],
    user: ['View own profile only']
  }

  const access = accessMap[user.role] || []

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Welcome, {user.name}
      </h1>
      <p className="text-gray-500 mb-8">
        You are logged in as 
        <span className="ml-1 font-semibold capitalize text-blue-600">
          {user.role}
        </span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Role</p>
          <p className="text-xl font-bold text-blue-800 capitalize">{user.role}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Email</p>
          <p className="text-sm font-bold text-green-800">{user.email}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">User ID</p>
          <p className="text-xl font-bold text-purple-800">#{user.id}</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold text-gray-700 mb-4">
          Your Access Permissions
        </h2>
        <ul className="space-y-2">
          {access.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-green-500 font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}