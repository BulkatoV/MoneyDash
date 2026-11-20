import './MetricCard.css'

import type { JSX } from 'react'

export interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  tone?: 'positive' | 'negative' | 'neutral'
}

export function MetricCard({ title, value, change, tone = 'neutral' }: MetricCardProps): JSX.Element {
  const changeTone = change === undefined || change === 0 ? 'neutral' : change > 0 ? 'positive' : 'negative'
  const changeLabel = change === undefined ? '' : `${change > 0 ? '+' : ''}${change}%`

  return (
    <article className={`metriccard metriccard--${tone}`}>
      <h3 className="metriccard__title">{title}</h3>
      <p className="metriccard__value">{value}</p>
      {change !== undefined && <p className={`metriccard__change metriccard__change--${changeTone}`}>{changeLabel}</p>}
    </article>
  )
}
