export type DebtStatus = 'pendiente' | 'pagado' | 'vencido'

export type Debt = {
  id: string
  company_id: string
  customer_id: string
  sale_id: string
  total_amount: number
  paid_amount: number
  pending_amount: number
  status: DebtStatus
  due_date: string | null
  created_at: string
  customer?: {
    id: string
    name: string
    phone: string | null
  }
  sale?: {
    id: string
    total: number
    created_at: string
  }
}

export type CustomerDebtSummary = {
  customer_id: string
  customer_name: string
  customer_phone: string | null
  total_debt: number
  paid_amount: number
  pending_amount: number
  active_debts: number
}

export type CustomerDebtDetail = {
  customer: {
    id: string
    name: string
    phone: string | null
  }
  summary: {
    total_amount: number
    paid_amount: number
    pending_amount: number
    total_revenue: number
    total_cost: number
    total_profit: number
  }
  debts: Debt[]
  products: CustomerDebtProduct[]
  payments: DebtPayment[]
}

export type CustomerDebtProduct = {
  product_id: string
  product_name: string
  total_quantity: number
  total_revenue: number
  total_cost: number
  total_profit: number
}

export type DebtPayment = {
  id: string
  customer_id: string
  amount: number
  created_at: string
}

export type AddPaymentInput = {
  customer_id: string
  amount: number
}