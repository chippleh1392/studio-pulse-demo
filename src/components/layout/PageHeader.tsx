import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  contextLabel?: string
  contextValue?: string
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  contextLabel,
  contextValue,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {contextLabel && contextValue && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{contextLabel}:</span> {contextValue}
          </div>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

