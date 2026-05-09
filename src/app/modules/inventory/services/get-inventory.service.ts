import { supabase } from '@/lib/supabase/client'
import { InventoryItem } from '../types/inventory.types'

async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No autenticado')
  return session.access_token
}

export async function getInventory(): Promise<InventoryItem[]> {
  const token = await getToken()

  const res = await fetch('/api/inventory', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}