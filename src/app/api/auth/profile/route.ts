import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../../../../../lib/supabase/server'


export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  return NextResponse.json(profile)
}