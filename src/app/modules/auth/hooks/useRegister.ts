import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../../lib/supabase/client'


export function useRegister() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      // Llamamos al API route para crear el usuario
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Login en el cliente también para tener la sesión en el navegador
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw new Error(signInError.message)

      router.push('/onboarding')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { register, loading, error }
}