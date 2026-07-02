import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { token } = useAuth()

  return (
    <div>
      <h1>Dashboard</h1>
      {token ? (
        <p>You are logged in.</p>
      ) : (
        <p>You are browsing as a guest.</p>
      )}
    </div>
  )
}
