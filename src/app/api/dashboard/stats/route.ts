import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { Period } from '@/src/app/modules/dashboard/types/dashboard-stats.types'

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

function getDateRange(period: Period) {
  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  switch (period) {
    case 'today':
      return { start: today.toISOString(), end: new Date(today.getTime() + 86400000).toISOString() }
    case 'week': {
      const start = new Date(today)
      start.setDate(today.getDate() - 6)
      return { start: start.toISOString(), end: new Date(today.getTime() + 86400000).toISOString() }
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start: start.toISOString(), end: new Date(today.getTime() + 86400000).toISOString() }
    }
  }
}

function getMonthRange() {
  const now   = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end   = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return { start: start.toISOString(), end: end.toISOString() }
}

export async function GET(req: NextRequest) {
  try {
    const supabase   = await createSupabaseServer()
    const user       = await getUser(req, supabase)
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const company_id = await getCompanyId(supabase, user.id)
    if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

    const period         = (req.nextUrl.searchParams.get('period') ?? 'today') as Period
    const { start, end } = getDateRange(period)
    const month          = getMonthRange()

    // ── Ventas del período ────────────────────────────────────
    const { data: sales } = await supabase
      .from('sales')
      .select('id, total, total_cost, total_profit, payment_method, created_at')
      .eq('company_id', company_id)
      .gte('created_at', start)
      .lt('created_at', end)

    // ── Separar contado vs crédito ────────────────────────────
    const cashSales   = sales?.filter(s => s.payment_method !== 'credito') ?? []
    const creditSales = sales?.filter(s => s.payment_method === 'credito') ?? []

    // ── Gastos del período ────────────────────────────────────
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('company_id', company_id)
      .gte('created_at', start)
      .lt('created_at', end)

    // ── Pagos recibidos de deudas en el período ───────────────
    const { data: debtPayments } = await supabase
      .from('payments')
      .select('amount, profit_amount, cost_amount')
      .eq('company_id', company_id)
      .gte('created_at', start)
      .lt('created_at', end)

    const paymentsRevenue = debtPayments?.reduce((acc, p) => acc + p.amount,               0) ?? 0
    const paymentsProfit  = debtPayments?.reduce((acc, p) => acc + (p.profit_amount ?? 0), 0) ?? 0
    const paymentsCost    = debtPayments?.reduce((acc, p) => acc + (p.cost_amount   ?? 0), 0) ?? 0

    // ── Stat cards — contado + abonos recibidos ───────────────
    const cards = {
      totalSales:    cashSales.length,
      totalRevenue:  cashSales.reduce((acc, s) => acc + s.total,        0) + paymentsRevenue,
      totalProfit:   cashSales.reduce((acc, s) => acc + s.total_profit, 0) + paymentsProfit,
      totalCost:     cashSales.reduce((acc, s) => acc + s.total_cost,   0) + paymentsCost,
      totalExpenses: expenses?.reduce((acc, e) => acc + e.amount,       0) ?? 0,
    }

    // ── Credit cards — pendiente de cobro ─────────────────────
   // ── Credit cards — lo que realmente queda pendiente ───────
const creditSaleIds = creditSales.map(s => s.id).filter(Boolean)

let pendingDebts: any[] = []
if (creditSaleIds.length > 0) {
  const { data: debtsData } = await supabase
    .from('debts')
    .select('pending_amount, total_amount, sale_id')
    .eq('company_id', company_id)
    .in('sale_id', creditSaleIds)
  pendingDebts = debtsData ?? []
}

// Para profit y cost pendiente calculamos proporcionalmente
// pending_amount / total_amount * total_profit de la venta
const salesMapForCredit: Record<string, any> = {}
creditSales.forEach(s => { salesMapForCredit[s.id] = s })

const creditCards = {
  totalSales:   creditSales.length,
  totalRevenue: pendingDebts.reduce((acc, d) => acc + d.pending_amount, 0),
  totalProfit:  pendingDebts.reduce((acc, d) => {
    const sale = salesMapForCredit[d.sale_id]
    if (!sale || !sale.total) return acc
    const proportion = d.pending_amount / sale.total
    return acc + sale.total_profit * proportion
  }, 0),
  totalCost: pendingDebts.reduce((acc, d) => {
    const sale = salesMapForCredit[d.sale_id]
    if (!sale || !sale.total) return acc
    const proportion = d.pending_amount / sale.total
    return acc + sale.total_cost * proportion
  }, 0),
}

    // ── Ventas diarias — solo contado ─────────────────────────
    const { data: allSales } = await supabase
      .from('sales')
      .select('total, total_profit, payment_method, created_at')
      .eq('company_id', company_id)
      .gte('created_at', getDateRange('week').start)
      .lt('created_at', end)

    const dailyMap: Record<string, { total: number; profit: number }> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dailyMap[d.toISOString().split('T')[0]] = { total: 0, profit: 0 }
    }

    allSales?.filter(s => s.payment_method !== 'credito').forEach(sale => {
      const key = sale.created_at.split('T')[0]
      if (dailyMap[key]) {
        dailyMap[key].total  += sale.total
        dailyMap[key].profit += sale.total_profit
      }
    })

    const dailySales = Object.entries(dailyMap).map(([date, values]) => ({ date, ...values }))

    // ── productMap: base con sale_items de contado ────────────
    const cashSaleIds = cashSales.map(s => s.id)
    let saleItems: any[] = []

    if (cashSaleIds.length > 0) {
      const { data: items } = await supabase
        .from('sale_items')
        .select('product_id, quantity, total, cost, profit')
        .in('sale_id', cashSaleIds)
      saleItems = items ?? []
    }

    // ── payment_items del período (abonos de crédito) ─────────
    // Obtenemos los payment_ids del período para luego buscar sus items
    const { data: periodPayments } = await supabase
      .from('payments')
      .select('id')
      .eq('company_id', company_id)
      .gte('created_at', start)
      .lt('created_at', end)

    const paymentIds = periodPayments?.map(p => p.id) ?? []
    let paymentItems: any[] = []

    if (paymentIds.length > 0) {
      const { data: pItems } = await supabase
        .from('payment_items')
        .select('product_id, amount, cost_amount, profit_amount')
        .in('payment_id', paymentIds)
      paymentItems = pItems ?? []
    }

    // ── Obtener nombres de productos ──────────────────────────
    const allProductIds = [
      ...new Set([
        ...saleItems.map(i => i.product_id),
        ...paymentItems.map(i => i.product_id),
      ])
    ]

    const productNames: Record<string, string> = {}
    if (allProductIds.length > 0) {
      const { data: products } = await supabase
        .from('products')
        .select('id, name')
        .in('id', allProductIds)
      products?.forEach(p => { productNames[p.id] = p.name })
    }

    // ── Construir productMap sumando contado + abonos ─────────
    const productMap: Record<string, {
      product_name:   string
      total_quantity: number
      total_revenue:  number
      total_cost:     number
      total_profit:   number
    }> = {}

    // Sumar sale_items de contado
    saleItems.forEach(item => {
      if (!productMap[item.product_id]) {
        productMap[item.product_id] = {
          product_name:   productNames[item.product_id] ?? 'Desconocido',
          total_quantity: 0,
          total_revenue:  0,
          total_cost:     0,
          total_profit:   0,
        }
      }
      productMap[item.product_id].total_quantity += item.quantity
      productMap[item.product_id].total_revenue  += item.total
      productMap[item.product_id].total_cost     += item.cost
      productMap[item.product_id].total_profit   += item.profit
    })

    // Sumar payment_items de abonos de crédito
    paymentItems.forEach(item => {
      if (!productMap[item.product_id]) {
        productMap[item.product_id] = {
          product_name:   productNames[item.product_id] ?? 'Desconocido',
          total_quantity: 0,
          total_revenue:  0,
          total_cost:     0,
          total_profit:   0,
        }
      }
      // quantity no se suma porque ya se contó al momento de la venta
      productMap[item.product_id].total_revenue += item.amount
      productMap[item.product_id].total_cost    += item.cost_amount
      productMap[item.product_id].total_profit  += item.profit_amount
    })

    const topProducts = Object.entries(productMap)
      .map(([product_id, values]) => ({ product_id, ...values }))
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 5)

    const productProfits = Object.entries(productMap)
      .map(([product_id, values]) => ({ product_id, ...values }))
      .sort((a, b) => b.total_profit - a.total_profit)

    // ── Alertas de stock ──────────────────────────────────────
    const { data: inventory } = await supabase
      .from('inventory')
      .select(`id, stock, product:products(id, name, unit), variant:product_variants(id, name, unit)`)
      .eq('company_id', company_id)
      .lte('stock', 5)

    const stockAlerts = (inventory ?? []).map((inv: any) => ({
      id:           inv.id,
      product_name: inv.product?.name ?? '—',
      variant_name: inv.variant?.name ?? null,
      stock:        inv.stock,
      unit:         inv.variant?.unit ?? inv.product?.unit ?? 'und',
    }))

    // ── Resumen del mes — solo contado + abonos ───────────────
    const { data: monthSales } = await supabase
      .from('sales')
      .select('total, total_profit, total_cost, payment_method')
      .eq('company_id', company_id)
      .gte('created_at', month.start)
      .lt('created_at', month.end)

    const { data: monthExpenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('company_id', company_id)
      .gte('created_at', month.start)
      .lt('created_at', month.end)

    const { data: monthPayments } = await supabase
      .from('payments')
      .select('amount, profit_amount, cost_amount')
      .eq('company_id', company_id)
      .gte('created_at', month.start)
      .lt('created_at', month.end)

    const monthCashSales  = monthSales?.filter(s => s.payment_method !== 'credito') ?? []
    const monthPayRevenue = monthPayments?.reduce((acc, p) => acc + p.amount,               0) ?? 0
    const monthPayProfit  = monthPayments?.reduce((acc, p) => acc + (p.profit_amount ?? 0), 0) ?? 0
    const monthRevenue    = monthCashSales.reduce((acc, s) => acc + s.total,        0) + monthPayRevenue
    const monthProfit     = monthCashSales.reduce((acc, s) => acc + s.total_profit, 0) + monthPayProfit
    const monthExpTotal   = monthExpenses?.reduce((acc, e) => acc + e.amount,       0) ?? 0

    const monthSummary = {
      totalRevenue:  monthRevenue,
      totalProfit:   monthProfit,
      totalExpenses: monthExpTotal,
      netProfit:     monthRevenue - monthExpTotal,
    }

    return NextResponse.json({
      period,
      cards,
      creditCards,
      dailySales,
      topProducts,
      productProfits,
      stockAlerts,
      monthSummary,
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}