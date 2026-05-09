import { useState } from 'react'

import { addPayment } from '../services/add-payment.service'
import { AddPaymentInput } from '../types/debts.type'

export function useAddPayment(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pay = async (input: AddPaymentInput) => {
    setLoading(true)
    setError(null)
    try {
      await addPayment(input)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { pay, loading, error }
}