import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  children?: ReactNode
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 px-6 py-16 text-center">
      <p className="text-sm font-medium text-neutral-900">{title}</p>
      {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}
