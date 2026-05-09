import { supabase } from "../../../../../lib/supabase/client"


async function getToken() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No autenticado')
  return session.access_token
}

export async function fetchCategories() {
  const token = await getToken()
  const res = await fetch('/api/categories', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function createCategory(name: string) {
  const token = await getToken()
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export async function deleteCategory(id: string) {
  const token = await getToken()
  const res = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}