import { InvoiceData } from '../types/invoice.types'
import { supabase } from '../../../../../lib/supabase/client'

export async function getSaleDetail(saleId: string): Promise<InvoiceData> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No autenticado')

  const res = await fetch(`/api/sales/${saleId}/detail`, {
    headers: { 'Authorization': `Bearer ${session.access_token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}