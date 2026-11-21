import { MetricCard } from '@moneydash/ui-library'
import { Link, useParams, useSearchParams } from 'react-router'

import { DashboardFilters } from '../components/DashboardFilters'
import { MonthlyTotalsChart } from '../components/MonthlyTotalsChart'
import { SpendingByCategoryChart } from '../components/SpendingByCategoryChart'
import { StatusMessage } from '../components/StatusMessage'
import { demoCategories, formatMoney, getDemoSummary } from '../demo/transactions'

import type { AnalyticsFilters } from '../types/analytics'
import type { JSX } from 'react'

export function DashboardPage(): JSX.Element {
  const { importId } = useParams()
  const [query] = useSearchParams()

  if (importId !== 'demo') {
    return (
      <section className="panel">
        <h1>Набор операций недоступен</h1>
        <p>Откройте демо-дашборд, чтобы посмотреть сводку по примеру.</p>
        <Link className="action" to="/dashboard/demo">Открыть демо-дашборд</Link>
      </section>
    )
  }

  const filters: AnalyticsFilters = {
    from: query.get('from') ?? '',
    to: query.get('to') ?? '',
    category: query.get('category') ?? ''
  }
  const summary = getDemoSummary(filters)

  return (
    <>
      <div className="page-title">
        <h1>Обзор финансов</h1>
        <p>Демонстрационные операции за январь — июнь 2026 года</p>
      </div>
      <DashboardFilters filters={filters} categories={demoCategories} />
      <section aria-labelledby="totals-title">
        <h2 className="visually-hidden" id="totals-title">Итоги</h2>
        <div className="metrics-grid">
          <MetricCard title="Доходы" value={formatMoney(summary.income)} tone="positive" />
          <MetricCard title="Расходы" value={formatMoney(summary.expense)} tone="negative" />
          <MetricCard title="Разница" value={formatMoney(summary.balance)} />
        </div>
      </section>
      {summary.monthly.length > 0 ? (
        <section className="chart-grid" aria-label="Графики финансовых операций">
          <MonthlyTotalsChart monthly={summary.monthly} />
          <SpendingByCategoryChart spending={summary.spending} />
        </section>
      ) : <StatusMessage>По выбранным фильтрам операций нет.</StatusMessage>}
    </>
  )
}
