import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { CreateProductPayload } from '../../modules/products/types/product.types'

// ─── Helpers ────────────────────────────────────────────────
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

// ─── GET — Listar productos ──────────────────────────────────
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()

  const user = await getUser(req, supabase)
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const company_id = await getCompanyId(supabase, user.id)
  if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name),
      variants:product_variants(*),
      inventory(stock, variant_id)
    `)
    .eq('company_id', company_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// ─── POST — Crear producto ───────────────────────────────────
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()

  const user = await getUser(req, supabase)
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const company_id = await getCompanyId(supabase, user.id)
  if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

  const body: CreateProductPayload = await req.json()
  if (!body.name) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })

  // 1. Crear producto base
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name: body.name,
      category_id: body.category_id,
      unit: body.unit,
      purchase_price: body.has_variants ? null : body.purchase_price,
      sale_price:     body.has_variants ? null : body.sale_price,
      credit_price:   body.has_variants ? null : (body.credit_price ?? null),
      company_id,
    })
    .select()
    .single()

  if (productError) return NextResponse.json({ error: productError.message }, { status: 500 })

  // 2. Sin variantes → crear inventory directo
  if (!body.has_variants) {
    await supabase.from('inventory').insert({
      company_id,
      product_id: product.id,
      variant_id: null,
      stock:    body.stock ?? 0,
      avg_cost: body.purchase_price ?? 0,
    })
  }

  // 3. Con variantes → crear cada variante + su inventory
  if (body.has_variants && body.variants?.length) {
    for (const variant of body.variants) {
      const { data: createdVariant, error: variantError } = await supabase
        .from('product_variants')
        .insert({
          product_id:     product.id,
          name:           variant.name,
          unit:           variant.unit,
          purchase_price: variant.purchase_price,
          sale_price:     variant.sale_price,
          credit_price:   variant.credit_price ?? null,
          stock:          variant.stock,
          is_active:      true,
        })
        .select()
        .single()

      if (variantError) continue

      await supabase.from('inventory').insert({
        company_id,
        product_id: product.id,
        variant_id: createdVariant.id,
        stock:    variant.stock ?? 0,
        avg_cost: variant.purchase_price ?? 0,
      })
    }
  }

  return NextResponse.json(product, { status: 201 })
}