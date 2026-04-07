import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { getGrowthData } from '@/lib/demo-client/client'
import type { GrowthData } from '@/lib/demo-client/types'
import { formatCompactNumber, formatLongNumber } from '@/lib/formatters'

export default function GrowthPage() {
  const [data, setData] = useState<GrowthData | null>(null)

  useEffect(() => {
    let cancelled = false

    getGrowthData()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch(() => {
        if (!cancelled) setData(null)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const maxViews = Math.max(...(data?.weeks.map((week) => week.views) || [1]))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Growth"
        description="Static weekly growth framing for the public portfolio demo."
        contextLabel="Window"
        contextValue={data?.windowLabel || 'Loading demo data'}
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
            <CardDescription>One of the clearest examples of decision-support framing in the public demo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(data?.weeks || []).map((week) => (
              <div key={week.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium text-foreground">{week.label}</div>
                  <div className="text-muted-foreground">
                    {formatLongNumber(week.views)} views · {week.netSubscribers} net subs
                  </div>
                </div>
                <div className="h-3 rounded-full bg-muted">
                  <div
                    className="h-3 rounded-full bg-[linear-gradient(90deg,#6aa6d6_0%,#7c86d7_55%,#9683c9_100%)]"
                    style={{ width: `${Math.max((week.views / maxViews) * 100, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <SummaryRow label="Avg. weekly views" value={data ? formatCompactNumber(data.summary.averageWeeklyViews) : '--'} />
              <SummaryRow label="Avg. net subscribers" value={data ? formatLongNumber(data.summary.averageWeeklyNetSubscribers) : '--'} />
              <SummaryRow label="Best week" value={data ? `${data.summary.bestWeekLabel} · ${formatCompactNumber(data.summary.bestWeekViews)}` : '--'} />
              <SummaryRow label="Consistency" value={data?.summary.consistencyLabel ?? '--'} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Focus Areas</CardTitle>
              <CardDescription>Public-safe narrative layer derived from synthetic weekly patterns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {(data?.focusAreas || []).map((item) => (
                <div key={item.title} className="space-y-1 rounded-xl border border-border/60 bg-background/75 p-3">
                  <div className="font-medium text-foreground">{item.title}</div>
                  <p>{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-b-0 last:pb-0">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
