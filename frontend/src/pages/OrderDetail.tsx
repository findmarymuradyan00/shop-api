import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, type Order } from '../api/client'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.orders.getOne(id)
      .then(setOrder)
      .catch(() => setError('Order not found'))
  }, [id])

  if (error) return <p className="error">{error}</p>
  if (!order) return <p className="loading">Loading...</p>

  return (
    <div>
      <h1>{order.title}</h1>
      <div className="detail-card">
        <p><strong>Price:</strong> ${order.price}</p>
        <p><strong>Quantity:</strong> {order.quantity}</p>
        {order.description && <p><strong>Description:</strong> {order.description}</p>}
        <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>
      <Link to="/orders" className="back-link">← Back to Orders</Link>
    </div>
  )
}
