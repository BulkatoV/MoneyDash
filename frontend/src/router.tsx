import { AppLayout } from './components/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { ImportPage } from './pages/ImportPage'
import { NotFoundPage } from './pages/NotFoundPage'

import type { RouteObject } from 'react-router'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <ImportPage /> },
      { path: 'dashboard/:importId', element: <DashboardPage /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]
