import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  return NextResponse.json({ success: true })
}