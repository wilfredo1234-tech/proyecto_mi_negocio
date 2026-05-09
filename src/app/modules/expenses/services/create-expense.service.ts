import { supabase } from '@/lib/supabase/client'
import { CreateExpenseInput, Expense } from '../types/expense.types'

async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No autenticado')
  return session.access_token
}

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const token = await getToken()

  const res = await fetch('/api/expenses', {
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