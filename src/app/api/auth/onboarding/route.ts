import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../../../../../lib/supabase/server'


export async function POST(req: NextRequest) {
  const { companyName } = await req.json()

  if (!companyName) {
    return NextResponse.json({ error: 'Nombre de empresa requerido' }, { status: 400 })
  }

  const supabase = await createSupabaseServer()

  // Leer el token del header Authorization
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')

  // Verificar el token con Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)

  if (userError || !user) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  // Crear empresa
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert({ name: companyName })
    .select()
    .single()

  if (companyError) {
    return NextResponse.json({ error: companyError.message }, { status: 500 })
  }

  // Crear perfil
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: user.id, company_id: company.id })

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ companyId: company.id }, { status: 201 })
}