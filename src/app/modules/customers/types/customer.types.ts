export type Customer = {
  id: string
  company_id: string
  name: string
  phone: string | null
  created_at: string
}

export type CreateCustomerInput = {
  name: string
  phone?: string
}

export type UpdateCustomerInput = {
  name?: string
  phone?: string
}