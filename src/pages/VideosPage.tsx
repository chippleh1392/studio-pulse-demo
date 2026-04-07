import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { getVideosData } from '@/lib/demo-client/client'
import type { DemoVideo, VideosData } from '@/lib/demo-client/types'
import { formatCompactNumber, formatDate, formatLongNumber, formatPercent } from '@/lib/formatters'

export default function VideosPage() {
  const [data, setData] = useState<VideosData | null>(null)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'score' | 'views' | 'ctr'>('score')

  useEffect(() => {
    let cancelled = false

    getVideosData()
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

  let visibleItems = data?.items || []

  if (query.trim()) {
    const needle = query.trim().toLowerCase()
    visibleItems = visibleItems.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.format.toLowerCase().includes(needle) ||
        item.theme.toLowerCase().includes(needle)
    )
  }

  visibleItems = [...visibleItems].sort((left, right) => {
    if (sortBy === 'views') return right.views - left.views
    if (sortBy === 'ctr') return right.ctr - left.ctr
    return right.score - left.score
  })

  const bestVideo: DemoVideo | null = visibleItems[0] ?? null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Videos"
        description="Synthetic video list demonstrating the intended list, sort, and packaging-analysis surface."
        contextLabel="Visible items"
        contextValue={String(visibleItems.length)}
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Video Table Direction</CardTitle>
            <CardDescription>Phase 2 keeps the route static while restoring useful list mechanics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter by title, format, or theme"
                className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as 'score' | 'views' | 'ctr')}
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              >
                <option value="score">Sort by score</option>
                <option value="views">Sort by views</option>
                <option value="ctr">Sort by CTR</option>
              </select>
            </div>

            <div className="space-y-3">
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/70 bg-background/85 p-4 shadow-[0_1px_2px_rgba(15,18,26,0.03)]"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <div className="text-base font-semibold tracking-tight">{item.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(item.publishedAt)} · {item.format} · {item.theme}
                      </div>
                    </div>
                    <div className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                      Score {item.score}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
                    <MetricCell label="Views" value={formatLongNumber(item.views)} />
                    <MetricCell label="Watch Hours" value={formatCompactNumber(item.watchHours)} />
                    <MetricCell label="CTR" value={formatPercent(item.ctr)} />
                    <MetricCell label="Avg. View Duration" value={`${item.avdMinutes.toFixed(1)} min`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demo Summary</CardTitle>
            <CardDescription>Static route-level payloads preserve product intent without backend complexity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <SummaryRow label="Videos in sample" value={String(data?.summary.totalVideos ?? 0)} />
            <SummaryRow label="Top format" value={data?.summary.topFormat ?? '--'} />
            <SummaryRow label="Strongest theme" value={data?.summary.strongestTheme ?? '--'} />
            <SummaryRow label="Median CTR" value={data ? formatPercent(data.summary.medianCtr) : '--'} />

            {bestVideo && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-900">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                  Best current signal
                </div>
                <div className="mt-2 text-base font-semibold">{bestVideo.title}</div>
                <p className="mt-1 text-sm text-emerald-800">
                  Highest visible {sortBy} in the current filtered set with a {bestVideo.format.toLowerCase()} package.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-xl border border-border/60 bg-card/80 p-3">
      <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
      <div className="text-base font-semibold tracking-tight">{value}</div>
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
