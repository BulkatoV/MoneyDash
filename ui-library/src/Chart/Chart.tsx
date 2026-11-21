import './Chart.css'

import type { JSX } from 'react'

export interface ChartSeries {
  label: string
  values: readonly number[]
}

export interface ChartProps {
  title: string
  labels: readonly string[]
  series: readonly ChartSeries[]
  mode?: 'line' | 'bar'
  formatValue?: (value: number) => string
}

const colors = ['#168371', '#b85c43', '#4b6793']
const numberFormat = new Intl.NumberFormat('ru-RU')
const width = 600
const height = 264
const left = 84
const right = 24
const top = 18
const bottom = 42
const plotWidth = width - left - right
const plotHeight = height - top - bottom

function scaleStep(maximum: number): number {
  const roughStep = maximum / 4 || 1
  const magnitude = 10 ** Math.floor(Math.log10(roughStep))
  const unit = [1, 2, 5, 10].find(value => value * magnitude >= roughStep) ?? 10

  return unit * magnitude
}

export function Chart({ title, labels, series, mode = 'line', formatValue = numberFormat.format }: ChartProps): JSX.Element {
  if (labels.length === 0 || series.length === 0) {
    return <figure className="chart"><figcaption>{title}</figcaption><p>Нет данных для отображения</p></figure>
  }

  const largest = series.reduce((maximum, item) => item.values.reduce((value, next) => Math.max(value, next), maximum), 0)
  const step = scaleStep(largest)
  const tickCount = Math.max(1, Math.ceil(largest / step))
  const plotBottom = height - bottom
  const slot = plotWidth / labels.length
  const barWidth = Math.min(48, slot * .65 / series.length)
  const xFor = (index: number): number => left + slot * (index + .5)
  const yFor = (value: number): number => plotBottom - value / (tickCount * step) * plotHeight

  return (
    <figure className="chart">
      <figcaption>{title}</figcaption>
      {series.length > 1 && (
        <ul className="chart__legend" aria-label="Ряды данных">
          {series.map((item, index) => (
            <li key={item.label}><span style={{ background: colors[index % colors.length] }} />{item.label}</li>
          ))}
        </ul>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} className="chart__svg" role="img" aria-label={title}>
        {Array.from({ length: tickCount + 1 }, (_, index) => {
          const value = index * step
          const y = yFor(value)

          return (
            <g key={index}>
              <line x1={left} y1={y} x2={width - right} y2={y} className="chart__grid" />
              <text x={left - 10} y={y + 4} textAnchor="end">{formatValue(value)}</text>
            </g>
          )
        })}
        {labels.map((label, index) => (
          <text key={label} x={xFor(index)} y={height - 12} textAnchor="middle">{label}</text>
        ))}
        {series.map((item, seriesIndex) => {
          const color = colors[seriesIndex % colors.length]
          const points = labels.map((label, index) => ({ label, x: xFor(index), y: yFor(item.values[index] ?? 0), value: item.values[index] ?? 0 }))

          return (
            <g key={item.label}>
              {mode === 'line' && <polyline points={points.map(({ x, y }) => `${x},${y}`).join(' ')} fill="none" stroke={color} strokeWidth="3" />}
              {points.map(point => {
                const tip = `${point.label} · ${item.label}: ${formatValue(point.value)}`

                return mode === 'line' ? (
                  <circle key={point.label} cx={point.x} cy={point.y} r="5" fill={color}><title>{tip}</title></circle>
                ) : (
                  <rect key={point.label} x={point.x + (seriesIndex - series.length / 2) * barWidth} y={point.y} width={barWidth} height={plotBottom - point.y} rx="3" fill={color}><title>{tip}</title></rect>
                )
              })}
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
