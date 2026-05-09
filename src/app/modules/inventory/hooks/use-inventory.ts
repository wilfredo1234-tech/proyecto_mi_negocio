import { useEffect, useState } from 'react'
import { InventoryItem } from '../types/inventory.types'
import { getInventory } from '../services/get-inventory.service'

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getInventory()
      setInventory(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return { inventory, loading, error, reload: load }
}