import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../../lib/supabase/client'

export function useLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      // Login directo con Supabase cliente
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw new Error('Credenciales incorrectas')
      if (!data.session) throw new Error('No se pudo iniciar sesión')

      // Verificar si tiene empresa
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', data.user.id)
        .single()

      router.refresh()

      if (profile?.company_id) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}