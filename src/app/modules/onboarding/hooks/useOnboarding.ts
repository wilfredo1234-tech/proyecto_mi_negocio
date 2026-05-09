import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCompany } from '../services/onboardingService'

export function useOnboarding() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (companyName: string) => {
    setLoading(true)
    setError(null)
    try {
      await createCompany(companyName)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}