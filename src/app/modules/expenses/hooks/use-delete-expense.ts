import { useState } from 'react'
import { deleteExpense } from '../services/delete-expense.service'

export function useDeleteExpense(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await deleteExpense(id)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}