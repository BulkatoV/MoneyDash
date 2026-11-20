import { expect, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { Chart } from '../Chart/Chart'

const labels = ['Январь', 'Февраль']
const series = [{ label: 'Доходы', values: [10, 20] }, { label: 'Расходы', values: [7, 9] }]

test('показывает две линии, точки и легенду', () => {
  render(<Chart title="Динамика" labels={labels} series={series} />)

  const plot = screen.getByRole('img', { name: 'Динамика' })

  expect(plot.querySelectorAll('polyline')).toHaveLength(2)
  expect(plot.querySelectorAll('circle')).toHaveLength(4)
  expect(screen.getByRole('list', { name: 'Ряды данных' })).toHaveTextContent('Расходы')
})

test('показывает столбцы и подсказки', () => {
  render(<Chart title="Расходы" labels={labels} series={[series[1]]} mode="bar" />)

  const plot = screen.getByRole('img', { name: 'Расходы' })

  expect(plot.querySelectorAll('rect')).toHaveLength(2)
  expect(plot.querySelector('rect title')).toHaveTextContent('Январь · Расходы: 7')
})

test('показывает пустое состояние', () => {
  render(<Chart title="Расходы" labels={[]} series={[]} />)
  expect(screen.getByText('Нет данных для отображения')).toBeInTheDocument()
})
