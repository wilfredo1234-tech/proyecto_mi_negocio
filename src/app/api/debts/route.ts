import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

async function getUser(req: NextRequest, supabase: any) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await supabase.auth.getUser(token)
  return user
}

async function getCompanyId(supabase: any, userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', userId)
    .single()
  return data?.company_id ?? null
}

// ─── GET — Resumen deudas por cliente ─────────────────────────
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const user = await getUser(req, supabase)
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const company_id = await getCompanyId(supabase, user.id)
    if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

    // Obtener todas las deudas pendientes agrupadas por cliente
    const { data: debts, error } = await supabase
      .from('debts')
      .select(`
        *,
        customer:customers(id, name, phone)
      `)
      .eq('company_id', company_id)
      .neq('status', 'pagado')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Agrupar por cliente
    const customerMap: Record<string, {
      customer_id: string
      customer_name: string
      customer_phone: string | null
      total_debt: number
      paid_amount: number
      pending_amount: number
      active_debts: number
    }> = {}

    debts?.forEach((debt: any) => {
      const cid = debt.customer_id
      if (!customerMap[cid]) {
        customerMap[cid] = {
          customer_id:    cid,
          customer_name:  debt.customer?.name ?? '—',
          customer_phone: debt.customer?.phone ?? null,
          total_debt:     0,
          paid_amount:    0,
          pending_amount: 0,
          active_debts:   0,
        }
      }
      customerMap[cid].total_debt     += debt.total_amount
      customerMap[cid].paid_amount    += debt.paid_amount
      customerMap[cid].pending_amount += debt.pending_amount
      customerMap[cid].active_debts   += 1
    })

    const result = Object.values(customerMap)
      .sort((a, b) => b.pending_amount - a.pending_amount)

    return NextResponse.json(result)

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}