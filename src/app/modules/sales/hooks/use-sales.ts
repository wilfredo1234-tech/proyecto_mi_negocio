import { useEffect, useState } from 'react'
import { Sale } from '../types/sale.types'
import { getSales } from '../services/get-sales.service'

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSales()
      setSales(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return { sales, loading, error, reload: load }
}