import { Link, NavLink, Outlet } from 'react-router'

import type { JSX } from 'react'

export function AppLayout(): JSX.Element {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" to="/" aria-label="MoneyDash, главная">
            <span className="brand__icon" aria-hidden="true"><i /><i /><i /></span>
            MoneyDash
          </Link>
          <nav aria-label="Основная навигация">
            <NavLink to="/" end>Импорт</NavLink>
            <NavLink to="/dashboard/demo">Дашборд</NavLink>
          </nav>
        </div>
      </header>
      <main className="workspace"><Outlet /></main>
    </>
  )
}
