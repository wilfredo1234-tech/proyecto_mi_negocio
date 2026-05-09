import { supabase } from '@/lib/supabase/client'
import { CreateCustomerInput, Customer } from '../types/customer.types'

async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No autenticado')
  return session.access_token
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  const token = await getToken()

  const res = await fetch('/api/customers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}