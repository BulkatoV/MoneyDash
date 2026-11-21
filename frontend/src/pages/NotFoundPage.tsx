import { Link } from 'react-router'

import type { JSX } from 'react'

export function NotFoundPage(): JSX.Element {
  return (
    <section className="panel">
      <h1>Страница не найдена</h1>
      <p>Проверьте адрес или вернитесь к импорту операций.</p>
      <Link className="action" to="/">К импорту</Link>
    </section>
  )
}
