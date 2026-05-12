import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

const UNITS_WITH_PRICE = ['kg', 'lb', 'g', 'lt', 'ml']

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer()

    const user = await getUser(req, supabase)
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const company_id = await getCompanyId(supabase, user.id)
    if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

    const { id } = await params

    // 1. Obtener venta
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select(`
        *,
        customer:customers(id, name)
      `)
      .eq('id', id)
      .eq('company_id', company_id)
      .single()

    if (saleError || !sale) {
      return NextResponse.json({ error: 'Venta no encontrada' }, { status: 404 })
    }

    // 2. Obtener items de la venta
    const { data: saleItems } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', id)

    // 3. Obtener nombres de productos y variantes
    const productIds = [...new Set(saleItems?.map((i: any) => i.product_id) ?? [])]
    const variantIds = [...new Set(saleItems?.map((i: any) => i.variant_id).filter(Boolean) ?? [])]

    let productNames: Record<string, { name: string; unit: string }> = {}
    let variantNames: Record<string, { name: string; unit: string }> = {}

    if (productIds.length > 0) {
      const { data: products } = await supabase
        .from('products')
        .select('id, name, unit')
        .in('id', productIds)

      products?.forEach((p: any) => {
        productNames[p.id] = { name: p.name, unit: p.unit }
      })
    }

    if (variantIds.length > 0) {
      const { data: variants } = await supabase
        .from('product_variants')
        .select('id, name, unit')
        .in('id', variantIds)

      variants?.forEach((v: any) => {
        variantNames[v.id] = { name: v.name, unit: v.unit }
      })
    }

    // 4. Obtener deuda si es crédito
    let pendingAmount: number | null = null

    if (sale.payment_method === 'credito') {
      const { data: debt } = await supabase
        .from('debts')
        .select('pending_amount')
        .eq('sale_id', id)
        .single()

      pendingAmount = debt?.pending_amount ?? null
    }

    // 5. Armar items de la factura
    const items = (saleItems ?? []).map((item: any) => {
      const product  = productNames[item.product_id]
      const variant  = item.variant_id ? variantNames[item.variant_id] : null
      const unit     = variant?.unit ?? product?.unit ?? 'und'
      const showUnitPrice = UNITS_WITH_PRICE.includes(unit)

      return {
        product_name:   product?.name ?? '—',
        variant_name:   variant?.name ?? null,
        quantity:       item.quantity,
        unit,
        unit_price:     item.sale_price,
        total:          item.total,
        show_unit_price: showUnitPrice,
      }
    })

    // 6. Formatear fecha y hora
    const date = new Date(sale.created_at.replace(' ', 'T'))
    const formattedDate = new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)

    const formattedTime = new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date)

    return NextResponse.json({
      sale_id:        sale.id,
      date:           formattedDate,
      time:           formattedTime,
      payment_method: sale.payment_method,
      customer_name:  sale.customer?.name ?? null,
      items,
      total:          sale.total,
      is_credit:      sale.payment_method === 'credito',
      pending_amount: pendingAmount,
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}