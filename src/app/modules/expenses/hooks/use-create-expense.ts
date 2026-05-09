import { useState } from 'react'
import { CreateExpenseInput } from '../types/expense.types'
import { createExpense } from '../services/create-expense.service'

export function useCreateExpense(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (input: CreateExpenseInput) => {
    setLoading(true)
    setError(null)
    try {
      const expense = await createExpense(input)
      onSuccess?.()
      return expense
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}