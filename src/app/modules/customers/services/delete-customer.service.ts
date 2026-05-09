import { supabase } from '@/lib/supabase/client'

async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No autenticado')
  return session.access_token
}

export async function deleteCustomer(id: string): Promise<void> {
  const token = await getToken()

  const res = await fetch(`/api/customers/${id}/delete`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
}