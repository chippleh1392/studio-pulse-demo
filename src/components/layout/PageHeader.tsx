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
    <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(247,250,252,0.92)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] md:flex-row md:items-start md:justify-between">
      <div className="space-y-2">
        {contextLabel && contextValue && (
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/90">
            <span>{contextLabel}</span>
            <span className="text-primary/45">•</span>
            <span>{contextValue}</span>
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 md:justify-end">{actions}</div>}
    </div>
  )
}
