import type { AnalyticsFilters, AnalyticsSummary, MonthlyTotals } from '../types/analytics'

interface DemoTransaction {
  date: string
  type: 'income' | 'expense'
  category: string
  amount: number
}

const operations: readonly DemoTransaction[] = [
  { date: '2026-01-05', type: 'income', category: 'Зарплата', amount: 10800000 },
  { date: '2026-01-10', type: 'expense', category: 'Жильё', amount: 3700000 },
  { date: '2026-01-18', type: 'expense', category: 'Продукты', amount: 2650000 },
  { date: '2026-02-05', type: 'income', category: 'Зарплата', amount: 11200000 },
  { date: '2026-02-10', type: 'expense', category: 'Жильё', amount: 3700000 },
  { date: '2026-02-19', type: 'expense', category: 'Транспорт', amount: 940000 },
  { date: '2026-02-26', type: 'expense', category: 'Продукты', amount: 2490000 },
  { date: '2026-03-05', type: 'income', category: 'Зарплата', amount: 12600000 },
  { date: '2026-03-10', type: 'expense', category: 'Жильё', amount: 3700000 },
  { date: '2026-03-21', type: 'expense', category: 'Досуг', amount: 1690000 },
  { date: '2026-04-05', type: 'income', category: 'Зарплата', amount: 11900000 },
  { date: '2026-04-10', type: 'expense', category: 'Жильё', amount: 3700000 },
  { date: '2026-04-18', type: 'expense', category: 'Продукты', amount: 2770000 },
  { date: '2026-04-28', type: 'expense', category: 'Досуг', amount: 1220000 },
  { date: '2026-05-05', type: 'income', category: 'Зарплата', amount: 13400000 },
  { date: '2026-05-10', type: 'expense', category: 'Жильё', amount: 3700000 },
  { date: '2026-05-27', type: 'expense', category: 'Транспорт', amount: 1080000 },
  { date: '2026-06-05', type: 'income', category: 'Зарплата', amount: 14100000 },
  { date: '2026-06-10', type: 'expense', category: 'Жильё', amount: 3700000 },
  { date: '2026-06-17', type: 'expense', category: 'Продукты', amount: 2860000 },
  { date: '2026-06-24', type: 'expense', category: 'Досуг', amount: 1340000 }
]

export const demoCategories = [...new Set(operations.map(item => item.category))].sort((a, b) => a.localeCompare(b, 'ru'))

const rubles = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2, minimumFractionDigits: 0 })

export function formatMoney(kopecks: number): string {
  return rubles.format(kopecks / 100)
}

export function getDemoSummary(filters: AnalyticsFilters): AnalyticsSummary {
  const selected = operations.filter(({ date, category }) => (
    (!filters.from || date >= filters.from) &&
    (!filters.to || date <= filters.to) &&
    (!filters.category || category === filters.category)
  ))
  const months = new Map<string, MonthlyTotals>()
  const categories = new Map<string, number>()
  let income = 0
  let expense = 0

  for (const operation of selected) {
    const month = operation.date.slice(0, 7)
    const monthly = months.get(month) ?? { month, income: 0, expense: 0 }

    monthly[operation.type] += operation.amount
    months.set(month, monthly)

    if (operation.type === 'income') {
      income += operation.amount
    } else {
      expense += operation.amount
      categories.set(operation.category, (categories.get(operation.category) ?? 0) + operation.amount)
    }
  }

  return {
    income,
    expense,
    balance: income - expense,
    monthly: [...months.values()],
    spending: [...categories].map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount)
  }
}
