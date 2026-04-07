import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DateRangeSelector } from '@/components/charts/DateRangeSelector'
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart'
import { PageHeader } from '@/components/layout/PageHeader'
import { getDashboardData } from '@/lib/demo-client/client'
import type { DashboardData } from '@/lib/demo-client/types'
import { useGlobalTimeframe } from '@/lib/timeframe/globalTimeframe'
import { formatCompactNumber, formatLongNumber } from '@/lib/formatters'

function getVisiblePoints(weeklyTrend: DashboardData['weeklyTrend'], days: number | undefined) {
  if (weeklyTrend.length === 0) return weeklyTrend
  if (days === undefined) return weeklyTrend

  const weeks = Math.max(1, Math.ceil(days / 7))
  return weeklyTrend.slice(-weeks)
}

export default function OverviewPage() {
  const { globalTimeframeDays, setGlobalTimeframeDays, timeframeLabel } = useGlobalTimeframe()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    getDashboardData()
      .then((data) => {
        if (cancelled) return
        setDashboardData(data)
        setIsLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setDashboardData(null)
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

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
        description="Channel health, headline KPIs, and core trendlines."
        contextLabel="Timeframe"
        contextValue={timeframeLabel}
        actions={<DateRangeSelector value={globalTimeframeDays} onChange={setGlobalTimeframeDays} />}
      />

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
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Views Over Time</CardTitle>
          <DateRangeSelector value={globalTimeframeDays} onChange={setGlobalTimeframeDays} />
        </CardHeader>
        <CardContent className="h-[300px]">
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
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Watch Time Over Time</CardTitle>
            <DateRangeSelector value={globalTimeframeDays} onChange={setGlobalTimeframeDays} />
          </CardHeader>
          <CardContent className="h-[300px]">
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
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Subscribers Over Time</CardTitle>
            <DateRangeSelector value={globalTimeframeDays} onChange={setGlobalTimeframeDays} />
          </CardHeader>
          <CardContent className="h-[300px]">
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
            />
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
