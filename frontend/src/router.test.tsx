import { expect, test } from '@jest/globals'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, useRoutes } from 'react-router'

import { routes } from './router'

import type { JSX } from 'react'

function TestRoutes(): JSX.Element | null {
  return useRoutes(routes)
}

test.each([
  { path: '/', title: 'Импорт операций' },
  { path: '/dashboard/demo', title: 'Обзор финансов' },
  { path: '/dashboard/missing', title: 'Набор операций недоступен' },
  { path: '/missing', title: 'Страница не найдена' }
])('показывает страницу $path', ({ path, title }) => {
  render(<MemoryRouter initialEntries={[path]}><TestRoutes /></MemoryRouter>)
  expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
})

test('отображает карточку и графики из UI-библиотеки', () => {
  render(<MemoryRouter initialEntries={['/dashboard/demo']}><TestRoutes /></MemoryRouter>)
  expect(screen.getByRole('heading', { name: 'Разница' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: 'Доходы и расходы по месяцам' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: 'Расходы по категориям' })).toBeInTheDocument()
})

test('показывает имя выбранного CSV и убирает его после очистки поля', () => {
  render(<MemoryRouter><TestRoutes /></MemoryRouter>)

  const input = screen.getByLabelText('Файл с операциями')
  const file = new File(['date,type,category,amount'], 'operations.csv', { type: 'text/csv' })

  fireEvent.change(input, { target: { files: [file] } })
  expect(screen.getByRole('status')).toHaveTextContent('Выбран файл «operations.csv».')

  fireEvent.change(input, { target: { files: [] } })
  expect(screen.queryByRole('status')).not.toBeInTheDocument()

  fireEvent.change(input, { target: { files: null } })
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

function expectTotal(title: string, amount: string): void {
  const totals = within(screen.getByRole('region', { name: 'Итоги' }))
  const card = totals.getByRole('heading', { name: title }).closest('article')

  expect(card?.textContent?.replace(/\s/g, '')).toBe(`${title}${amount}₽`)
}

test('пересчитывает сводку по периоду и категории, проверяет даты и сбрасывает фильтры', () => {
  render(<MemoryRouter initialEntries={['/dashboard/demo']}><TestRoutes /></MemoryRouter>)

  fireEvent.change(screen.getByLabelText('Дата начала'), { target: { value: '2026-02-10' } })
  fireEvent.change(screen.getByLabelText('Дата окончания'), { target: { value: '2026-03-10' } })
  fireEvent.change(screen.getByLabelText('Категория'), { target: { value: 'Жильё' } })
  fireEvent.click(screen.getByRole('button', { name: 'Применить' }))
  expectTotal('Доходы', '0')
  expectTotal('Расходы', '74000')
  expectTotal('Разница', '-74000')

  fireEvent.change(screen.getByLabelText('Дата начала'), { target: { value: '2026-03-11' } })
  fireEvent.click(screen.getByRole('button', { name: 'Применить' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Дата начала должна быть раньше')
  expectTotal('Расходы', '74000')

  fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }))
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(screen.getByLabelText('Дата начала')).toHaveValue('')
  expect(screen.getByLabelText('Дата окончания')).toHaveValue('')
  expect(screen.getByLabelText('Категория')).toHaveValue('')
  expectTotal('Доходы', '740000')
})

test('показывает нулевые итоги и сообщение для пустой выборки', () => {
  render(<MemoryRouter initialEntries={['/dashboard/demo?from=2026-12-01']}><TestRoutes /></MemoryRouter>)

  expectTotal('Доходы', '0')
  expectTotal('Расходы', '0')
  expectTotal('Разница', '0')
  expect(screen.getByRole('status')).toHaveTextContent('По выбранным фильтрам операций нет.')
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})

test('восстанавливает полную сводку при отправке формы с отсутствующими полями', () => {
  render(<MemoryRouter initialEntries={['/dashboard/demo?to=2026-01-31']}><TestRoutes /></MemoryRouter>)
  expectTotal('Доходы', '108000')

  const dateFrom = screen.getByLabelText<HTMLInputElement>('Дата начала')
  const dateTo = screen.getByLabelText<HTMLInputElement>('Дата окончания')
  const category = screen.getByLabelText<HTMLSelectElement>('Категория')

  dateFrom.disabled = true
  dateTo.disabled = true
  category.disabled = true
  fireEvent.click(screen.getByRole('button', { name: 'Применить' }))

  expectTotal('Доходы', '740000')
  expect(screen.getByLabelText('Дата окончания')).toHaveValue('')
})
