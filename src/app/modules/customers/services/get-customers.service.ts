import { supabase } from '@/lib/supabase/client'
import { Customer } from '../types/customer.types'

async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No autenticado')
  return session.access_token
}

export async function getCustomers(): Promise<Customer[]> {
  const token = await getToken()

  const res = await fetch('/api/customers', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}