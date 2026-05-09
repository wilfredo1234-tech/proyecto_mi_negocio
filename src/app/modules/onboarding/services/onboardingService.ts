import { supabase } from "../../../../../lib/supabase/client"


export async function createCompany(companyName: string) {
  // Obtenemos el token de la sesión actual del navegador
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error('No hay sesión activa')

  const res = await fetch('/api/auth/onboarding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,  // ← token aquí
    },
    body: JSON.stringify({ companyName }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}