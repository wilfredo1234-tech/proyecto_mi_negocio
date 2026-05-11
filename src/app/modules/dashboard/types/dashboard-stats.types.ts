export type Period = 'today' | 'week' | 'month'

export type StatCards = {
  totalSales:    number
  totalRevenue:  number
  totalProfit:   number
  totalCost:     number
  totalExpenses: number
}

export type CreditCards = {
  totalSales:   number
  totalRevenue: number
  totalProfit:  number
  totalCost:    number
}

export type DailySale = {
  date:   string
  total:  number
  profit: number
}

export type TopProduct = {
  product_id:     string
  product_name:   string
  total_quantity: number
  total_revenue:  number
}

export type ProductProfit = {
  product_id:     string
  product_name:   string
  total_quantity: number
  total_revenue:  number
  total_cost:     number
  total_profit:   number
}

export type StockAlert = {
  id:           string
  product_name: string
  variant_name: string | null
  stock:        number
  unit:         string
}

export type MonthSummary = {
  totalRevenue:  number
  totalProfit:   number
  totalExpenses: number
  netProfit:     number
}

export type DashboardStats = {
  period:        Period
  cards:         StatCards
  creditCards:   CreditCards   // ← nuevo
  dailySales:    DailySale[]
  topProducts:   TopProduct[]
  productProfits: ProductProfit[]
  stockAlerts:   StockAlert[]
  monthSummary:  MonthSummary
}