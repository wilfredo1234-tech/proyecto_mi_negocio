import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../../../../../lib/supabase/server'


export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
  }

  const supabase = await createSupabaseServer()

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Token existe pero sin company_id todavía — va al onboarding
  return NextResponse.json({ userId: data.user?.id }, { status: 201 })
}