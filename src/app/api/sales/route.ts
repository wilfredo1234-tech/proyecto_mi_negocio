import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { CreateSaleInput } from '../../modules/sales/types/sale.types'

// ─── Helpers ─────────────────────────────────────────────────
const round = (n: number) => Math.round(n * 1000) / 1000

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

// ─── GET — Listar ventas ──────────────────────────────────────
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()

  const user = await getUser(req, supabase)
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const company_id = await getCompanyId(supabase, user.id)
  if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      customer:customers(id, name)
    `)
    .eq('company_id', company_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// ─── POST — Crear venta ───────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const user = await getUser(req, supabase)
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const company_id = await getCompanyId(supabase, user.id)
    if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

    const body: CreateSaleInput = await req.json()

    if (!body.items?.length) {
      return NextResponse.json({ error: 'La venta debe tener al menos un producto' }, { status: 400 })
    }

    // ── Calcular totales ──────────────────────────────────────
    const saleItems = body.items.map(item => {
      const quantity = round(
        item.input_mode === 'money'
          ? item.total / item.sale_price
          : item.quantity
      )

      const total = round(
        item.input_mode === 'money'
          ? item.total
          : item.quantity * item.sale_price
      )

      const cost   = round(quantity * item.purchase_price)
      const profit = round(total - cost)

      return {
        product_id:     item.product_id,
        variant_id:     item.variant_id,
        quantity,
        sale_price:     item.sale_price,
        purchase_price: item.purchase_price,
        total,
        cost,
        profit,
      }
    })

    const total_sale   = round(saleItems.reduce((acc, i) => acc + i.total, 0))
    const total_cost   = round(saleItems.reduce((acc, i) => acc + i.cost, 0))
    const total_profit = round(saleItems.reduce((acc, i) => acc + i.profit, 0))

    // ── Crear cabecera de venta ───────────────────────────────
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        company_id,
        customer_id:    body.customer_id,
        payment_method: body.payment_method,
        total:          total_sale,
        total_cost,
        total_profit,
      })
      .select()
      .single()

    if (saleError) return NextResponse.json({ error: saleError.message }, { status: 500 })

    // ── Crear items de la venta ───────────────────────────────
    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems.map(item => ({ ...item, sale_id: sale.id })))

    if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

    // ── Descontar stock en inventory ──────────────────────────
    for (const item of saleItems) {
      if (item.variant_id) {
        const { data: inv } = await supabase
          .from('inventory')
          .select('id, stock')
          .eq('variant_id', item.variant_id)
          .single()

        if (inv) {
          await supabase
            .from('inventory')
            .update({ stock: round(inv.stock - item.quantity) })
            .eq('id', inv.id)
        }
      } else {
        const { data: inv } = await supabase
          .from('inventory')
          .select('id, stock')
          .eq('product_id', item.product_id)
          .eq('company_id', company_id)
          .is('variant_id', null)
          .single()

        if (inv) {
          await supabase
            .from('inventory')
            .update({ stock: round(inv.stock - item.quantity) })
            .eq('id', inv.id)
        }
      }
    }

    // ── Si es crédito → crear deuda automáticamente ───────────
    if (body.payment_method === 'credito' && body.customer_id) {
      await supabase.from('debts').insert({
        company_id,
        customer_id:    body.customer_id,
        sale_id:        sale.id,
        total_amount:   total_sale,
        paid_amount:    0,
        pending_amount: total_sale,
        status:         'pendiente',
      })
    }

    return NextResponse.json(sale, { status: 201 })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}