export type PaymentMethod = 'efectivo' | 'transferencia' | 'credito'

export type SaleItem = {
  id: string
  sale_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  sale_price: number
  purchase_price: number
  total: number
  cost: number
  profit: number
}

export type SaleItemInput = {
  product_id: string
  variant_id: string | null
  product_name: string
  variant_name: string | null
  unit: string
  original_sale_price: number   // ← nuevo: precio contado, nunca cambia
  sale_price: number            // ← precio activo según método
  credit_price: number | null
  purchase_price: number
  quantity: number
  total: number
  input_mode: 'quantity' | 'money'
}

export type CreateSaleInput = {
  customer_id: string | null
  payment_method: PaymentMethod
  items: SaleItemInput[]
}

export type Sale = {
  id: string
  company_id: string
  customer_id: string | null
  payment_method: PaymentMethod
  total: number
  total_cost: number
  total_profit: number
  created_at: string
  customer?: {
    id: string
    name: string
  }
}