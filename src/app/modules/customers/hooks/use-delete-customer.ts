import { useState } from 'react'
import { deleteCustomer } from '../services/delete-customer.service'

export function useDeleteCustomer(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await deleteCustomer(id)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}