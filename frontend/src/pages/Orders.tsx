import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, isValidObjectId, type Order } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  async function load() {
    try {
      const data = await api.orders.getAll()
      setOrders(data)
    } catch {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this order?')) return
    try {
      await api.orders.delete(id)
      setOrders(prev => prev.filter(o => o._id !== id))
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  function isOwner(order: Order): boolean {
    if (!token) return false
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(atob(base64))
      return payload.userId === order.userId
    } catch {
      return false
    }
  }

  return (
    <div>
      <h1>Orders</h1>
      {token && <button onClick={() => navigate('/orders/new')}>Create Order</button>}
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <ul>
            {orders.map(order => (
              <li key={order._id}>
                {isValidObjectId(order._id) ? (
                  <Link to={`/orders/${order._id}`}>
                    <strong>{order.title}</strong> — ${order.price} x {order.quantity}
                  </Link>
                ) : (
                  <span><strong>{order.title}</strong> — ${order.price} x {order.quantity}</span>
                )}
                {isOwner(order) && isValidObjectId(order._id) && (
                  <>
                    <button onClick={() => navigate(`/orders/${order._id}/edit`)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(order._id!)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {!orders.length && <p className="empty-state">No orders yet.</p>}
        </>
      )}
    </div>
  )
}
