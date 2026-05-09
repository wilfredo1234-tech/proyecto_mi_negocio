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

  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}