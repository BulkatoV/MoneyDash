import { describe, expect, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { MetricCard } from '../MetricCard/MetricCard'

describe('MetricCard', () => {
  test('показывает заголовок и сумму', () => {
    render(<MetricCard title="Доходы" value="15 000 ₽" />)
    expect(screen.getByRole('heading', { name: 'Доходы' })).toBeInTheDocument()
    expect(screen.getByText('15 000 ₽')).toBeInTheDocument()
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument()
  })

  test.each([
    { change: 12.5, label: '+12.5%', tone: 'positive' },
    { change: -4, label: '-4%', tone: 'negative' },
    { change: 0, label: '0%', tone: 'neutral' }
  ])('показывает изменение $label', ({ change, label, tone }) => {
    render(<MetricCard title="Месячная динамика" value={100} change={change} />)
    expect(screen.getByText(label)).toHaveClass(`metriccard__change--${tone}`)
  })
})
