import { Chart } from '@moneydash/ui-library'

import { formatMoney } from '../demo/transactions'

import type { MonthlyTotals } from '../types/analytics'
import type { JSX } from 'react'

const monthName = new Intl.DateTimeFormat('ru-RU', { month: 'short', timeZone: 'UTC' })

export function MonthlyTotalsChart({ monthly }: { monthly: MonthlyTotals[] }): JSX.Element {
  return (
    <Chart
      title="Доходы и расходы по месяцам"
      labels={monthly.map(({ month }) => monthName.format(new Date(`${month}-01T00:00:00Z`)))}
      series={[
        { label: 'Доходы', values: monthly.map(({ income }) => income) },
        { label: 'Расходы', values: monthly.map(({ expense }) => expense) }
      ]}
      formatValue={formatMoney}
    />
  )
}
