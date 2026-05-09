
import { supabase } from '../../../../../lib/supabase/client'
import { CreateProductPayload } from '../types/product.types'

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No autenticado')
  return session.access_token
}

export async function fetchProducts() {
  const token = await getToken()
  const res = await fetch('/api/products', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function createProduct(payload: CreateProductPayload) {
  const token = await getToken()
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function updateProduct(id: string, payload: Partial<CreateProductPayload>) {
  const token = await getToken()
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function deleteProduct(id: string) {
  const token = await getToken()
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}