import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../../../../lib/supabase/server'


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

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const user = await getUser(req, supabase)
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const company_id = await getCompanyId(supabase, user.id)
  if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('company_id', company_id)
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const user = await getUser(req, supabase)
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const company_id = await getCompanyId(supabase, user.id)
  if (!company_id) return NextResponse.json({ error: 'Sin empresa' }, { status: 400 })

  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, company_id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}