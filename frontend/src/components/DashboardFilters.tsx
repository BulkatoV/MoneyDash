import { useState } from 'react'
import { useSearchParams } from 'react-router'

import { StatusMessage } from './StatusMessage'

import type { AnalyticsFilters } from '../types/analytics'
import type { FormEvent, JSX } from 'react'

interface DashboardFiltersProps {
  filters: AnalyticsFilters
  categories: readonly string[]
}

export function DashboardFilters({ filters, categories }: DashboardFiltersProps): JSX.Element {
  const [query, setQuery] = useSearchParams()
  const [error, setError] = useState(false)

  function applyFilters(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const fields = new FormData(event.currentTarget)
    const from = String(fields.get('from') ?? '')
    const to = String(fields.get('to') ?? '')
    const category = String(fields.get('category') ?? '')

    if (from && to && from > to) {
      setError(true)

      return
    }

    const nextQuery = new URLSearchParams()

    for (const [key, value] of Object.entries({ from, to, category })) {
      if (value) {
        nextQuery.set(key, value)
      }
    }

    setError(false)
    setQuery(nextQuery)
  }

  function resetFilters(): void {
    setError(false)
    setQuery({})
  }

  return (
    <form className="filters" key={query.toString()} onSubmit={applyFilters} onReset={resetFilters}>
      <label>Дата начала<input name="from" type="date" defaultValue={filters.from} /></label>
      <label>Дата окончания<input name="to" type="date" defaultValue={filters.to} /></label>
      <label>Категория
        <select name="category" defaultValue={filters.category}>
          <option value="">Все категории</option>
          {categories.map(category => <option key={category}>{category}</option>)}
        </select>
      </label>
      <div className="filter-actions">
        <button className="action" type="submit">Применить</button>
        <button className="action action--quiet" type="reset">Сбросить</button>
      </div>
      {error && <StatusMessage error>Дата начала должна быть раньше даты окончания или совпадать с ней.</StatusMessage>}
    </form>
  )
}
