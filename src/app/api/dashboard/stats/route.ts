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
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (period) {
    case 'today':
      return {
        start: today.toISOString(),
        end:   new Date(today.getTime() + 86400000).toISOString(),
      }
    case 'week': {
      const start = new Date(today)
      start.setDate(today.getDate() - 6)
      return {
        start: start.toISOString(),
        end:   new Date(today.getTime() + 86400000).toISOString(),
      }
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return {
        start: start.toISOString(),
        end:   new Date(today.getTime() + 86400000).toISOString(),
      }
    }
  }
}

function getMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return { start: start.toISOString(), end: end.toISOString() }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const user = await getUser(req, supabase)
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const company_id = await getCompanyId(supabase, user.id)
    if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

    const period = (req.nextUrl.searchParams.get('period') ?? 'today') as Period
    const { start, end } = getDateRange(period)
    const month = getMonthRange()

    // ── Ventas del período ────────────────────────────────────
    const { data: sales } = await supabase
      .from('sales')
      .select('id, total, total_cost, total_profit, created_at')
      .eq('company_id', company_id)
      .gte('created_at', start)
      .lt('created_at', end)

    // ── Gastos del período ────────────────────────────────────
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('company_id', company_id)
      .gte('created_at', start)
      .lt('created_at', end)

    // ── Stat cards ────────────────────────────────────────────
    const cards = {
      totalSales:    sales?.length ?? 0,
      totalRevenue:  sales?.reduce((acc, s) => acc + s.total, 0) ?? 0,
      totalProfit:   sales?.reduce((acc, s) => acc + s.total_profit, 0) ?? 0,
      totalExpenses: expenses?.reduce((acc, e) => acc + e.amount, 0) ?? 0,
    }

    // ── Ventas diarias (últimos 7 días) ───────────────────────
    const { data: allSales } = await supabase
      .from('sales')
      .select('total, total_profit, created_at')
      .eq('company_id', company_id)
      .gte('created_at', getDateRange('week').start)
      .lt('created_at', end)

    const dailyMap: Record<string, { total: number; profit: number }> = {}

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      dailyMap[key] = { total: 0, profit: 0 }
    }

    allSales?.forEach(sale => {
      const key = sale.created_at.split('T')[0]
      if (dailyMap[key]) {
        dailyMap[key].total  += sale.total
        dailyMap[key].profit += sale.total_profit
      }
    })

    const dailySales = Object.entries(dailyMap).map(([date, values]) => ({
      date,
      ...values,
    }))

    // ── Items vendidos del período ────────────────────────────
    const saleIds = sales?.map(s => s.id) ?? []

    let saleItems: any[] = []

    if (saleIds.length > 0) {
      const { data: items } = await supabase
        .from('sale_items')
        .select('product_id, quantity, total, cost, profit')
        .in('sale_id', saleIds)

      saleItems = items ?? []
    }

    // ── Top productos más vendidos ────────────────────────────
    const productMap: Record<string, {
      product_name: string
      total_quantity: number
      total_revenue: number
      total_cost: number
      total_profit: number
    }> = {}

    // Obtener nombres de productos
    const productIds = [...new Set(saleItems.map(i => i.product_id))]

    let productNames: Record<string, string> = {}

    if (productIds.length > 0) {
      const { data: products } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds)

      products?.forEach(p => { productNames[p.id] = p.name })
    }

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
      .select(`
        id, stock,
        product:products(id, name, unit),
        variant:product_variants(id, name, unit)
      `)
      .eq('company_id', company_id)
      .lte('stock', 5)

    const stockAlerts = (inventory ?? []).map((inv: any) => ({
  id:           inv.id,
  product_name: inv.product?.name ?? '—',
  variant_name: inv.variant?.name ?? null,
  stock:        inv.stock,
  unit:         inv.variant?.unit ?? inv.product?.unit ?? 'und',
}))?? []

    // ── Resumen del mes ───────────────────────────────────────
    const { data: monthSales } = await supabase
      .from('sales')
      .select('total, total_profit')
      .eq('company_id', company_id)
      .gte('created_at', month.start)
      .lt('created_at', month.end)

    const { data: monthExpenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('company_id', company_id)
      .gte('created_at', month.start)
      .lt('created_at', month.end)

    const monthRevenue  = monthSales?.reduce((acc, s) => acc + s.total, 0) ?? 0
    const monthExpTotal = monthExpenses?.reduce((acc, e) => acc + e.amount, 0) ?? 0

    const monthSummary = {
      totalRevenue:  monthRevenue,
      totalExpenses: monthExpTotal,
      netProfit:     monthRevenue - monthExpTotal,
    }

    return NextResponse.json({
      period,
      cards,
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