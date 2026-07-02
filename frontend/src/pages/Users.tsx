import { useEffect, useState } from 'react'
import { api, type User } from '../api/client'

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.users.getAll()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
  }, [])

  return (
    <div>
      <h1>Users</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.email}
          </li>
        ))}
      </ul>
      {!users.length && <p>No users found.</p>}
    </div>
  )
}
