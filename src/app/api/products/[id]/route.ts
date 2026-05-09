import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

async function getUser(req: NextRequest, supabase: any) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await supabase.auth.getUser(token)
  return user
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer()
  const { id } = await params

  const user = await getUser(req, supabase)
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data: variants } = await supabase
    .from('product_variants')
    .select('id')
    .eq('product_id', id)

  const variantIds = variants?.map((v: any) => v.id) ?? []

  if (variantIds.length > 0) {
    await supabase.from('sale_items').delete().in('variant_id', variantIds)
  }

  await supabase.from('sale_items').delete().eq('product_id', id)
  await supabase.from('inventory').delete().eq('product_id', id)
  await supabase.from('product_variants').delete().eq('product_id', id)

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}