import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../../../../../lib/supabase/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer()
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { id } = await params

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}