export type InvoiceItem = {
  product_name: string
  variant_name: string | null
  quantity: number
  unit: string
  unit_price: number
  total: number
  show_unit_price: boolean  // true si es kg, lb, g, lt, ml
}

export type InvoiceData = {
  sale_id: string
  date: string
  time: string
  payment_method: 'efectivo' | 'transferencia' | 'credito'
  customer_name: string | null
  items: InvoiceItem[]
  total: number
  is_credit: boolean
  pending_amount: number | null
}