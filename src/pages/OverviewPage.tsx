import { Suspense, lazy, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb, Sparkles, Video } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DateRangeSelector } from '@/components/charts/DateRangeSelector'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAsyncResource } from '@/hooks/use-async-resource'
import { getDashboardData } from '@/lib/demo-client/client'
import type { DashboardData } from '@/lib/demo-client/types'
import { useGlobalTimeframe } from '@/lib/timeframe/globalTimeframe'
import { formatCompactNumber, formatLongNumber } from '@/lib/formatters'

const TimeSeriesChart = lazy(() =>
  import('@/components/charts/TimeSeriesChart').then((module) => ({
    default: module.TimeSeriesChart,
  }))
)

function getVisiblePoints(weeklyTrend: DashboardData['weeklyTrend'], days: number | undefined) {
  if (weeklyTrend.length === 0) return weeklyTrend
  if (days === undefined) return weeklyTrend

  const weeks = Math.max(1, Math.ceil(days / 7))
  return weeklyTrend.slice(-weeks)
}

function ChartFallback() {
  return <Skeleton className="h-full w-full rounded-xl" />
}

export default function OverviewPage() {
  const { globalTimeframeDays, setGlobalTimeframeDays, timeframeLabel, buildPathWithTimeframe } =
    useGlobalTimeframe()
  const { data: dashboardData, isLoading } = useAsyncResource('dashboard', getDashboardData)

  const filteredTrend = useMemo(
    () => getVisiblePoints(dashboardData?.weeklyTrend ?? [], globalTimeframeDays),
    [dashboardData?.weeklyTrend, globalTimeframeDays]
  )

  const viewsSeries = filteredTrend.map((point) => ({ date: point.label, value: point.views }))
  const watchSeries = filteredTrend.map((point) => ({ date: point.label, value: point.watchHours }))
  const subscriberSeries = filteredTrend.map((point) => ({ date: point.label, value: point.subscribers }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Channel health, headline KPIs, and the shortest path from a public demo to a real product story."
        contextLabel="Timeframe"
        contextValue={timeframeLabel}
        actions={<DateRangeSelector value={globalTimeframeDays} onChange={setGlobalTimeframeDays} />}
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-sky-200/80 bg-[linear-gradient(135deg,rgba(222,242,255,0.95)_0%,rgba(235,241,255,0.96)_48%,rgba(245,234,255,0.94)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <CardHeader className="pb-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-300/70 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-900/80">
              Public Demo Tour
            </div>
            <CardTitle className="text-2xl tracking-tight text-slate-900">
              Start with the headline signal, then follow the strongest question.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="max-w-2xl text-sm leading-6 text-slate-700">
              This build is intentionally synthetic, but the workflow is real: check the channel read, open the
              strongest trend, then move into the route that explains the behavior behind it.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <TourLink
                to={buildPathWithTimeframe('/videos')}
                icon={Video}
                title="Inspect Videos"
                detail="Open the sortable library when one metric needs package-level context."
              />
              <TourLink
                to={buildPathWithTimeframe('/creative')}
                icon={Sparkles}
                title="Read Creative"
                detail="Look for repeatable title, hook, and thumbnail patterns."
              />
              <TourLink
                to={buildPathWithTimeframe('/insights')}
                icon={Lightbulb}
                title="Zoom Out"
                detail="Use cross-video patterns when the issue is bigger than one upload."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Demo Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-3 py-2.5">
              <span>Data posture</span>
              <span className="font-medium text-foreground">Synthetic only</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-3 py-2.5">
              <span>Navigation model</span>
              <span className="font-medium text-foreground">Route-scoped analytics</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-3 py-2.5">
              <span>Best use</span>
              <span className="font-medium text-foreground">Product walkthroughs</span>
            </div>
            <p className="pt-1 text-xs leading-5">
              External viewers should be able to understand the product shape without seeing a single private
              export, credential, or operational workflow.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={`kpi-skeleton-${index}`}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          : (dashboardData?.headlineMetrics ?? []).map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.display}</div>
                  <p className="text-xs text-muted-foreground">{metric.context}</p>
                  <p className="mt-2 text-sm font-medium text-emerald-700">{metric.changeLabel}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Suspense fallback={<ChartFallback />}>
            <TimeSeriesChart
              series={[
                {
                  id: 'views',
                  name: 'Views',
                  color: '#3b82f6',
                  data: viewsSeries,
                },
              ]}
              loading={isLoading}
              title=""
              ariaLabel={`Views over time, ${timeframeLabel}`}
            />
          </Suspense>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Watch Time Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Suspense fallback={<ChartFallback />}>
              <TimeSeriesChart
                series={[
                  {
                    id: 'watch-time',
                    name: 'Watch Time (hours)',
                    color: '#22c55e',
                    data: watchSeries,
                  },
                ]}
                loading={isLoading}
                title=""
                ariaLabel={`Watch time over time, ${timeframeLabel}`}
              />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscribers Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Suspense fallback={<ChartFallback />}>
              <TimeSeriesChart
                series={[
                  {
                    id: 'subscribers',
                    name: 'Net Subscribers',
                    color: '#f59e0b',
                    data: subscriberSeries,
                  },
                ]}
                loading={isLoading}
                title=""
                ariaLabel={`Net subscribers over time, ${timeframeLabel}`}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Performance Read</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {(dashboardData?.storyHighlights ?? []).map((item) => (
              <div key={item.title} className="space-y-1 rounded-xl border border-border/60 bg-background/75 p-4">
                <p className="font-medium text-foreground">{item.title}</p>
                <p>{item.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span>Recent window</span>
              <span className="font-medium text-foreground">
                {dashboardData?.trendWindowLabel ?? '--'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span>Visible view total</span>
              <span className="font-medium text-foreground">
                {dashboardData ? formatCompactNumber(filteredTrend.reduce((sum, point) => sum + point.views, 0)) : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span>Visible watch hours</span>
              <span className="font-medium text-foreground">
                {dashboardData ? formatCompactNumber(filteredTrend.reduce((sum, point) => sum + point.watchHours, 0)) : '--'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Visible net subscribers</span>
              <span className="font-medium text-foreground">
                {dashboardData ? formatLongNumber(filteredTrend.reduce((sum, point) => sum + point.subscribers, 0)) : '--'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TourLink({
  to,
  icon: Icon,
  title,
  detail,
}: {
  to: string
  icon: typeof Video
  title: string
  detail: string
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-white/70 bg-white/70 p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
          <Icon className="h-4 w-4" />
        </span>
        <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
      </div>
      <div className="mt-4 space-y-1">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-xs leading-5 text-slate-600">{detail}</p>
      </div>
    </Link>
  )
}
