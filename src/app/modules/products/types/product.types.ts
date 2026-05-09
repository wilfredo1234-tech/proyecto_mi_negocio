export type Category = {
  id: string
  name: string
  company_id: string
  created_at: string
}

export type ProductVariant = {
  id?: string
  product_id?: string
  name: string
  unit: string
  purchase_price: number
  sale_price: number
  credit_price: number | null 
  stock: number
  is_active: boolean
}

export type Product = {
  id: string
  company_id: string
  name: string
  category_id: string | null
  unit: string
  purchase_price: number | null
  sale_price: number | null
  credit_price: number | null 
  created_at: string
  category?: Category
  variants?: ProductVariant[]
  stock?: number
}

export type CreateProductPayload = {
  name: string
  category_id: string | null
  unit: string
  has_variants: boolean
  // Si no tiene variantes
  purchase_price?: number
  sale_price?: number
  credit_price?: number | null
  stock?: number
  // Si tiene variantes
  variants?: Omit<ProductVariant, 'id' | 'product_id'>[]
}