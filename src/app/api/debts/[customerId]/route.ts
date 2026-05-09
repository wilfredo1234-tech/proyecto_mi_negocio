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

// ─── GET — Detalle deuda por cliente ──────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const supabase = await createSupabaseServer()

    const user = await getUser(req, supabase)
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const company_id = await getCompanyId(supabase, user.id)
    if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

    const { customerId } = await params

    // 1. Info del cliente
    const { data: customer } = await supabase
      .from('customers')
      .select('id, name, phone')
      .eq('id', customerId)
      .single()

    if (!customer) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })

    // 2. Deudas del cliente
    const { data: debts } = await supabase
      .from('debts')
      .select(`*, sale:sales(id, total, created_at)`)
      .eq('company_id', company_id)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })

    // 3. Pagos del cliente
    const { data: payments } = await supabase
      .from('payments')
      .select('id, customer_id, amount, created_at')
      .eq('company_id', company_id)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })

    // 4. Ventas a crédito del cliente con sus items
    const saleIds = debts?.map((d: any) => d.sale_id) ?? []

    let saleItems: any[] = []

    if (saleIds.length > 0) {
      const { data: items } = await supabase
        .from('sale_items')
        .select('product_id, quantity, total, cost, profit')
        .in('sale_id', saleIds)

      saleItems = items ?? []
    }

    // 5. Nombres de productos
    const productIds = [...new Set(saleItems.map((i: any) => i.product_id))]
    let productNames: Record<string, string> = {}

    if (productIds.length > 0) {
      const { data: products } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds)

      products?.forEach((p: any) => { productNames[p.id] = p.name })
    }

    // 6. Agrupar productos
    const productMap: Record<string, {
      product_name: string
      total_quantity: number
      total_revenue: number
      total_cost: number
      total_profit: number
    }> = {}

    saleItems.forEach((item: any) => {
      if (!productMap[item.product_id]) {
        productMap[item.product_id] = {
          product_name:   productNames[item.product_id] ?? '—',
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

    const products = Object.entries(productMap).map(([product_id, values]) => ({
      product_id,
      ...values,
    }))

    // 7. Resumen financiero
    const totalAmount   = debts?.reduce((acc: number, d: any) => acc + d.total_amount, 0) ?? 0
    const paidAmount    = debts?.reduce((acc: number, d: any) => acc + d.paid_amount, 0) ?? 0
    const pendingAmount = debts?.reduce((acc: number, d: any) => acc + d.pending_amount, 0) ?? 0
    const totalRevenue  = saleItems.reduce((acc, i) => acc + i.total, 0)
    const totalCost     = saleItems.reduce((acc, i) => acc + i.cost, 0)
    const totalProfit   = saleItems.reduce((acc, i) => acc + i.profit, 0)

    return NextResponse.json({
      customer,
      summary: {
        total_amount:   totalAmount,
        paid_amount:    paidAmount,
        pending_amount: pendingAmount,
        total_revenue:  totalRevenue,
        total_cost:     totalCost,
        total_profit:   totalProfit,
      },
      debts:    debts ?? [],
      products,
      payments: payments ?? [],
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}