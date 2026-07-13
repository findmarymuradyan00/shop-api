import { useEffect, useState } from 'react'
import { api, type User } from '../api/client'

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.users.getAll()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1>Users</h1>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <ul>
            {users.map(user => (
              <li key={user._id}>
                {user.email}
              </li>
            ))}
          </ul>
          {!users.length && <p className="empty-state">No users found.</p>}
        </>
      )}
    </div>
  )
}
