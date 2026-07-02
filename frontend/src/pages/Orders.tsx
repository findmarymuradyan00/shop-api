import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, type Order } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  async function load() {
    try {
      const data = await api.orders.getAll()
      setOrders(data)
    } catch {
      setError('Failed to load orders')
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
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.userId === order.userId
  }

  return (
    <div>
      <h1>Orders</h1>
      {token && <button onClick={() => navigate('/orders/new')}>Create Order</button>}
      {error && <p className="error">{error}</p>}
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            <Link to={`/orders/${order._id}`}>
              <strong>{order.title}</strong> — ${order.price} x {order.quantity}
            </Link>
            {isOwner(order) && (
              <>
                <button onClick={() => navigate(`/orders/${order._id}/edit`)}>Edit</button>
                <button onClick={() => handleDelete(order._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {!orders.length && <p>No orders yet.</p>}
    </div>
  )
}
