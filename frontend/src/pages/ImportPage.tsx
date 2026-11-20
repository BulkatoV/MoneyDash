import { Link } from 'react-router'

import { CsvUploadForm } from '../components/CsvUploadForm'

import type { JSX } from 'react'

export function ImportPage(): JSX.Element {
  return (
    <>
      <div className="page-title">
        <h1>Импорт операций</h1>
        <p>Здесь можно выбрать CSV с доходами и расходами или посмотреть дашборд на примере.</p>
      </div>
      <div className="import-grid">
        <section className="panel" aria-labelledby="import-title">
          <h2 id="import-title">Выбор файла</h2>
          <CsvUploadForm />
          <Link className="action" to="/dashboard/demo">Открыть демо-дашборд</Link>
        </section>
        <aside className="panel format" aria-labelledby="format-title">
          <h2 id="format-title">Формат CSV</h2>
          <dl>
            <div><dt><code>date</code></dt><dd>Дата в формате YYYY-MM-DD</dd></div>
            <div><dt><code>type</code></dt><dd>Доход (income) или расход (expense)</dd></div>
            <div><dt><code>category</code></dt><dd>Категория операции</dd></div>
            <div><dt><code>amount</code></dt><dd>Положительная сумма в рублях</dd></div>
            <div><dt><code>description</code></dt><dd>Описание по желанию</dd></div>
          </dl>
        </aside>
      </div>
    </>
  )
}
