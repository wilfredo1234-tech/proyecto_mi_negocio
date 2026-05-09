import { useState } from 'react'
import { CreateCustomerInput } from '../types/customer.types'
import { createCustomer } from '../services/create-customer.service'

export function useCreateCustomer(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (input: CreateCustomerInput) => {
    setLoading(true)
    setError(null)
    try {
      const customer = await createCustomer(input)
      onSuccess?.()
      return customer
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}