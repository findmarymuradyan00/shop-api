import { FormEvent, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api, isValidObjectId, type Order } from '../api/client'

export default function OrderEdit() {
  const { id } = useParams<{ id: string }>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isValidObjectId(id)) {
      setError('Invalid order ID')
      return
    }
    api.orders.getOne(id).then((order: Order) => {
      setTitle(order.title)
      setDescription(order.description || '')
      setPrice(String(order.price))
      setQuantity(String(order.quantity))
    }).catch(() => {
      setError('Order not found')
    })
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!isValidObjectId(id)) {
      setError('Invalid order ID')
      return
    }
    try {
      await api.orders.update(id, {
        title,
        description: description || undefined,
        price: Number(price),
        quantity: Number(quantity),
      })
      navigate('/orders')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
    }
  }

  if (error && !title) return <p className="error">{error}</p>

  return (
    <div>
      <h1>Edit Order</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input placeholder="Price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
        <input placeholder="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Update</button>
      </form>
    </div>
  )
}
