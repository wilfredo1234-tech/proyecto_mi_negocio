export type AdjustType = 'entrada' | 'salida' | 'correccion'

export type InventoryItem = {
  id: string
  company_id: string
  product_id: string
  variant_id: string | null
  stock: number
  avg_cost: number
  product: {
    id: string
    name: string
    unit: string
    category?: {
      id: string
      name: string
    }
  }
  variant?: {
    id: string
    name: string
    unit: string
  } | null
}

export type AdjustInventoryInput = {
  type: AdjustType
  quantity: number
  note?: string
}