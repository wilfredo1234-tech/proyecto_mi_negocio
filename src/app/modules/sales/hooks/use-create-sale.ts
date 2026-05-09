import { useState } from 'react'
import { CreateSaleInput } from '../types/sale.types'
import { createSale } from '../services/create-sale.service'

export function useCreateSale(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (input: CreateSaleInput) => {
    setLoading(true)
    setError(null)
    try {
      const sale = await createSale(input)
      onSuccess?.()
      return sale
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}