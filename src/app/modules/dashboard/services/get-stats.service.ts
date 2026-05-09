import { supabase } from '@/lib/supabase/client'
import { DashboardStats, Period } from '../types/dashboard-stats.types'

async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No autenticado')
  return session.access_token
}

export async function getDashboardStats(period: Period): Promise<DashboardStats> {
  const token = await getToken()

  const res = await fetch(`/api/dashboard/stats?period=${period}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}