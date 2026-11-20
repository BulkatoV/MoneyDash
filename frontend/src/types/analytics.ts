export interface AnalyticsFilters {
  from: string
  to: string
  category: string
}

export interface MonthlyTotals {
  month: string
  income: number
  expense: number
}

export interface CategoryTotal {
  category: string
  amount: number
}

export interface AnalyticsSummary {
  income: number
  expense: number
  balance: number
  monthly: MonthlyTotals[]
  spending: CategoryTotal[]
}
