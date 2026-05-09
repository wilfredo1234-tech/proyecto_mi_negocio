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

// ─── POST — Registrar abono ───────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const user = await getUser(req, supabase)
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const company_id = await getCompanyId(supabase, user.id)
    if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

    const { customer_id, amount } = await req.json()

    if (!customer_id) return NextResponse.json({ error: 'Cliente requerido' }, { status: 400 })
    if (!amount || amount <= 0) return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })

    // 1. Registrar pago en payments
    await supabase
      .from('payments')
      .insert({ company_id, customer_id, amount })

    // 2. Obtener deudas pendientes del cliente ordenadas por fecha
    const { data: debts } = await supabase
      .from('debts')
      .select('id, pending_amount, paid_amount, total_amount')
      .eq('company_id', company_id)
      .eq('customer_id', customer_id)
      .neq('status', 'pagado')
      .order('created_at', { ascending: true })

    // 3. Distribuir el abono entre las deudas (primero la más antigua)
    let remaining = amount

    for (const debt of debts ?? []) {
      if (remaining <= 0) break

      const toApply = Math.min(remaining, debt.pending_amount)
      const newPaid    = debt.paid_amount + toApply
      const newPending = debt.pending_amount - toApply
      const newStatus  = newPending === 0 ? 'pagado' : 'pendiente'

      await supabase
        .from('debts')
        .update({
          paid_amount:    newPaid,
          pending_amount: newPending,
          status:         newStatus,
        })
        .eq('id', debt.id)

      remaining -= toApply
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}