const BASE_URL = '/api'

export interface User {
  _id: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  _id: string
  userId: string
  title: string
  description?: string
  price: number
  quantity: number
  createdAt: string
  updatedAt: string
}

function getToken(): string | null {
  return localStorage.getItem('token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const text = await res.text()
    let message: string
    try {
      const err = JSON.parse(text)
      message = err.message || err.error || text
    } catch {
      message = text || `HTTP ${res.status}`
    }
    throw new Error(message)
  }

  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text)
}

export const api = {
  auth: {
    register: (data: { email: string; password: string }) =>
      request<User>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<string>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },
  users: {
    getAll: () => request<User[]>('/users'),
    getOne: (id: string) => request<User>(`/users/${id}`),
    update: (id: string, data: Partial<{ email: string; password: string }>) =>
      request<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<User>(`/users/${id}`, { method: 'DELETE' }),
  },
  orders: {
    getAll: () => request<Order[]>('/orders'),
    getOne: (id: string) => request<Order>(`/orders/${id}`),
    create: (data: { title: string; description?: string; price: number; quantity: number }) =>
      request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ title: string; description?: string; price: number; quantity: number }>) =>
      request<Order>(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<Order>(`/orders/${id}`, { method: 'DELETE' }),
  },
}
