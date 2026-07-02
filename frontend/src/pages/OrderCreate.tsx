import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function OrderCreate() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await api.orders.create({
        title,
        description: description || undefined,
        price: Number(price),
        quantity: Number(quantity),
      })
      navigate('/orders')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create order')
    }
  }

  return (
    <div>
      <h1>Create Order</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input placeholder="Price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
        <input placeholder="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Create</button>
      </form>
    </div>
  )
}
