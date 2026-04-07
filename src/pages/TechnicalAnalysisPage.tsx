import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { getTechnicalAnalysisData } from '@/lib/demo-client/client'
import type { TechnicalAnalysisData } from '@/lib/demo-client/types'

export default function TechnicalAnalysisPage() {
  const [data, setData] = useState<TechnicalAnalysisData | null>(null)

  useEffect(() => {
    let cancelled = false

    getTechnicalAnalysisData()
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technical Analysis"
        description={data?.rating.summary || 'Static TradingView-style framing for synthetic creator performance.'}
        contextLabel="Window"
        contextValue={data?.timeframeLabel || 'Loading demo data'}
      />

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Rating</CardTitle>
            <CardDescription>High-level directional read for the synthetic recent window.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Overall</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-emerald-950">
                {data?.rating.label || '--'}
              </div>
              <div className="mt-1 text-sm text-emerald-800">
                Score {data?.rating.score ?? '--'} / 100
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              {(data?.supportLevels || []).map((level) => (
                <div key={level.label} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/75 px-3 py-2">
                  <span>{level.label}</span>
                  <span className="font-medium text-foreground">{level.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signal Stack</CardTitle>
              <CardDescription>The public version keeps the product framing while simplifying the underlying evidence model.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(data?.signals || []).map((signal) => (
                <div key={signal.name} className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold tracking-tight">{signal.name}</div>
                    <div className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                      {signal.status}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{signal.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Action Bias</CardTitle>
              <CardDescription>Decision-oriented recommendations derived from the synthetic scorecard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {(data?.actionBias || []).map((item) => (
                <div key={item} className="rounded-xl border border-border/60 bg-background/75 p-3">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
