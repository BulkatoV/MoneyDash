import type { JSX, ReactNode } from 'react'

interface StatusMessageProps {
  children: ReactNode
  error?: boolean
}

export function StatusMessage({ children, error = false }: StatusMessageProps): JSX.Element {
  return <p className={`status${error ? ' status--error' : ''}`} role={error ? 'alert' : 'status'}>{children}</p>
}
