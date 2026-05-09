import { useEffect, useState } from 'react'

import { getCustomerDebt } from '../services/get-customer-debt.service'
import { CustomerDebtDetail } from '../types/debts.type'

export function useCustomerDebt(customerId: string) {
  const [detail, setDetail] = useState<CustomerDebtDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCustomerDebt(customerId)
      setDetail(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [customerId])

  return { detail, loading, error, reload: load }
}