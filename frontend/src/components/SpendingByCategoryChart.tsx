import { Chart } from '@moneydash/ui-library'

import { formatMoney } from '../demo/transactions'

import type { CategoryTotal } from '../types/analytics'
import type { JSX } from 'react'

export function SpendingByCategoryChart({ spending }: { spending: CategoryTotal[] }): JSX.Element {
  return (
    <Chart
      title="Расходы по категориям"
      labels={spending.map(({ category }) => category)}
      series={[{ label: 'Расходы', values: spending.map(({ amount }) => amount) }]}
      mode="bar"
      formatValue={formatMoney}
    />
  )
}
