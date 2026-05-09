import { useEffect, useState } from 'react'

import { getDebts } from '../services/get-debts.service'
import { CustomerDebtSummary } from '../types/debts.type'

export function useDebts() {
  const [debts, setDebts] = useState<CustomerDebtSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getDebts()
      setDebts(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return { debts, loading, error, reload: load }
}