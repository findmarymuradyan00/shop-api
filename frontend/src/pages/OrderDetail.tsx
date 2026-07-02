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
  if (!order) return <p>Loading...</p>

  return (
    <div>
      <h1>{order.title}</h1>
      <p>Price: ${order.price}</p>
      <p>Quantity: {order.quantity}</p>
      {order.description && <p>Description: {order.description}</p>}
      <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
      <Link to="/orders">Back to Orders</Link>
    </div>
  )
}
