import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { AdjustInventoryInput } from '@/src/app/modules/inventory/types/inventory.types'

const round = (n: number) => Math.round(n * 1000) / 1000

async function getUser(req: NextRequest, supabase: any) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await supabase.auth.getUser(token)
  return user
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer()

  const user = await getUser(req, supabase)
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body: AdjustInventoryInput = await req.json()

  if (!body.type) return NextResponse.json({ error: 'Tipo requerido' }, { status: 400 })
  if (body.quantity === undefined || body.quantity < 0) {
    return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 })
  }

  const quantity = round(body.quantity)

  const { data: inv, error: fetchError } = await supabase
    .from('inventory')
    .select('id, stock')
    .eq('id', id)
    .single()

  if (fetchError || !inv) {
    return NextResponse.json({ error: 'Inventario no encontrado' }, { status: 404 })
  }

  let newStock: number

  switch (body.type) {
    case 'entrada':
      newStock = round(inv.stock + quantity)
      break
    case 'salida':
      newStock = round(inv.stock - quantity)
      if (newStock < 0) {
        return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 })
      }
      break
    case 'correccion':
      newStock = quantity
      break
    default:
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('inventory')
    .update({ stock: newStock })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, stock: newStock })
}