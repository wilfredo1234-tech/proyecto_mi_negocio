import { useState } from 'react'
import { AdjustInventoryInput } from '../types/inventory.types'
import { adjustInventory } from '../services/adjust-inventory.service'

export function useAdjustInventory(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const adjust = async (id: string, input: AdjustInventoryInput) => {
    setLoading(true)
    setError(null)
    try {
      await adjustInventory(id, input)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { adjust, loading, error }
}