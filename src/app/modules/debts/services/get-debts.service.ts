import { supabase } from '@/lib/supabase/client'
import { CustomerDebtSummary } from '../types/debts.type'


async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No autenticado')
  return session.access_token
}

export async function getDebts(): Promise<CustomerDebtSummary[]> {
  const token = await getToken()

  const res = await fetch('/api/debts', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}