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

const round = (n: number) => Math.round(n * 1000) / 1000

export async function POST(req: NextRequest) {
  try {
    const supabase   = await createSupabaseServer()
    const user       = await getUser(req, supabase)
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const company_id = await getCompanyId(supabase, user.id)
    if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

    const { customer_id, amount } = await req.json()
    if (!customer_id) return NextResponse.json({ error: 'Cliente requerido' }, { status: 400 })
    if (!amount || amount <= 0) return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })

    // 1. Obtener deudas pendientes con su venta
    const { data: debts } = await supabase
      .from('debts')
      .select('id, pending_amount, paid_amount, total_amount, sale_id')
      .eq('company_id', company_id)
      .eq('customer_id', customer_id)
      .neq('status', 'pagado')
      .order('created_at', { ascending: true })

    if (!debts?.length) {
      return NextResponse.json({ error: 'No hay deudas pendientes' }, { status: 400 })
    }

    // 2. Obtener totales de las ventas para calcular márgenes
    const saleIds = debts.map(d => d.sale_id).filter(Boolean)
    const { data: salesData } = await supabase
      .from('sales')
      .select('id, total, total_cost, total_profit')
      .in('id', saleIds)

    const salesMap: Record<string, { total: number; total_cost: number; total_profit: number }> = {}
    salesData?.forEach(s => { salesMap[s.id] = s })

    // 3. Obtener sale_items de esas ventas para el desglose por producto
    const { data: allSaleItems } = await supabase
      .from('sale_items')
      .select('sale_id, product_id, quantity, total, cost, profit')
      .in('sale_id', saleIds)

    // Agrupar items por sale_id
    const itemsBySale: Record<string, any[]> = {}
    allSaleItems?.forEach(item => {
      if (!itemsBySale[item.sale_id]) itemsBySale[item.sale_id] = []
      itemsBySale[item.sale_id].push(item)
    })

    // 4. Distribuir el abono deuda por deuda
    let remaining   = amount
    let totalProfit = 0
    let totalCost   = 0
    const paymentItemsToInsert: any[] = []

    for (const debt of debts) {
      if (remaining <= 0) break

      const toApply    = Math.min(remaining, debt.pending_amount)
      const newPaid    = debt.paid_amount + toApply
      const newPending = debt.pending_amount - toApply
      const newStatus  = newPending === 0 ? 'pagado' : 'pendiente'

      const sale         = salesMap[debt.sale_id]
      const marginProfit = sale && sale.total > 0 ? sale.total_profit / sale.total : 0
      const marginCost   = sale && sale.total > 0 ? sale.total_cost   / sale.total : 0

      totalProfit += toApply * marginProfit
      totalCost   += toApply * marginCost

      // 5. Calcular payment_items proporcionales por producto
      const items = itemsBySale[debt.sale_id] ?? []
      const saleTotal = sale?.total ?? 0

      items.forEach(item => {
        // proporción de este item sobre el total de la venta
        const itemProportion = saleTotal > 0 ? item.total / saleTotal : 0
        const itemAmount     = round(toApply * itemProportion)
        const itemCost       = round(itemAmount * (item.cost  / (item.total || 1)))
        const itemProfit     = round(itemAmount * (item.profit / (item.total || 1)))

        if (itemAmount > 0) {
          paymentItemsToInsert.push({
            company_id,
            product_id:    item.product_id,
            amount:        itemAmount,
            cost_amount:   itemCost,
            profit_amount: itemProfit,
          })
        }
      })

      // 6. Actualizar deuda
      await supabase
        .from('debts')
        .update({ paid_amount: newPaid, pending_amount: newPending, status: newStatus })
        .eq('id', debt.id)

      remaining -= toApply
    }

    // 7. Registrar pago principal
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        company_id,
        customer_id,
        amount,
        profit_amount: Math.round(totalProfit),
        cost_amount:   Math.round(totalCost),
      })
      .select('id')
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Error al registrar pago' }, { status: 500 })
    }

    // 8. Insertar payment_items con el id del pago
    if (paymentItemsToInsert.length > 0) {
      const itemsWithPaymentId = paymentItemsToInsert.map(item => ({
        ...item,
        payment_id: payment.id,
      }))

      await supabase.from('payment_items').insert(itemsWithPaymentId)
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}