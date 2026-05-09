export type Expense = {
  id: string
  company_id: string
  description: string
  amount: number
  created_at: string
}

export type CreateExpenseInput = {
  description: string
  amount: number
}