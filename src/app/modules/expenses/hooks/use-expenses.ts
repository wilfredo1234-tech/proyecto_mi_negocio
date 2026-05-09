import { useEffect, useState } from 'react'
import { Expense } from '../types/expense.types'
import { getExpenses } from '../services/get-expenses.service'

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getExpenses()
      setExpenses(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return { expenses, loading, error, reload: load }
}