import { useMemo, useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  ChevronRight,
  Minus,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAsyncResource } from '@/hooks/use-async-resource'
import { getGrowthData } from '@/lib/demo-client/client'
import type { GrowthWeek } from '@/lib/demo-client/types'

const WOW_TIMEFRAME_OPTIONS = [
  { label: '4w', value: 4 },
  { label: '8w', value: 8 },
  { label: '12w', value: 12 },
  { label: 'All', value: 0 },
] as const

const tierColors: Record<GrowthWeek['tier'], string> = {
  Excellent: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Good: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  Average: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Poor: 'bg-red-500/10 text-red-600 border-red-500/20',
}

const momentumColors: Record<GrowthWeek['momentumTrend'], string> = {
  'Strong Positive': 'text-emerald-600',
  Positive: 'text-green-500',
  Neutral: 'text-gray-500',
  Negative: 'text-orange-500',
}

function formatNumber(value?: number | null): string {
  if (value === undefined || value === null) return '--'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toLocaleString()
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function TierBadge({ tier }: { tier: GrowthWeek['tier'] }) {
  return (
    <span className={`rounded-full border px-2 py-1 text-xs font-medium ${tierColors[tier]}`}>
      {tier}
    </span>
  )
}

function TrendArrow({ value }: { value?: number | null }) {
  if (value === null || value === undefined) return <span className="text-muted-foreground">--</span>
  const isPositive = value > 0
  const isNegative = value < 0
  const Icon = isPositive ? ArrowUp : isNegative ? ArrowDown : Minus
  const color = isPositive ? 'text-emerald-600' : isNegative ? 'text-red-600' : 'text-gray-500'
  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>
      <Icon className="h-4 w-4" />
      <span>{Math.abs(value).toFixed(1)}%</span>
    </span>
  )
}

function MomentumGauge({ score, trend }: { score?: number; trend?: GrowthWeek['momentumTrend'] }) {
  if (score === undefined || trend === undefined) {
    return <div className="flex h-32 items-center justify-center text-muted-foreground">Insufficient data</div>
  }

  const rotation = (score / 100) * 180 - 90

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-32 overflow-hidden">
        <div className="absolute inset-0 rounded-t-full border-8 border-gray-200" />
        <div
          className="absolute inset-0 rounded-t-full border-8"
          style={{
            borderColor: score >= 60 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444',
            clipPath: `polygon(0 100%, 0 0, ${score}% 0, ${score}% 100%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-14 w-1 origin-bottom rounded-full bg-gray-800"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />
        <div className="absolute bottom-0 left-1/2 h-3 w-3 translate-y-1/2 -translate-x-1/2 rounded-full bg-gray-800" />
      </div>
      <div className="mt-2 text-center">
        <div className="text-2xl font-bold">{score}</div>
        <div className={`text-sm ${momentumColors[trend]}`}>{trend}</div>
      </div>
    </div>
  )
}

export default function GrowthPage() {
  const { data, isLoading } = useAsyncResource('growth', getGrowthData)
  const [wowTimeframe, setWowTimeframe] = useState<number>(12)

  const weeks = data?.weeks ?? []
  const wowWeeks = useMemo(() => (wowTimeframe > 0 ? weeks.slice(-wowTimeframe) : weeks), [weeks, wowTimeframe])
  const latestWeek = weeks[weeks.length - 1]
  const viewsChartData = weeks.map((week) => ({ date: week.periodStart, value: week.views }))
  const wowChartData = wowWeeks.map((week) => ({ date: week.periodStart, value: week.wowChange }))
  const anomalies = weeks.filter((week) => week.anomaly)
  const summaryLines = latestWeek
    ? [
        `Latest week delivered ${formatNumber(latestWeek.views)} views across ${latestWeek.releaseCount} release(s).`,
        latestWeek.wowChange !== null
          ? `Week-over-week change is ${latestWeek.wowChange > 0 ? '+' : ''}${latestWeek.wowChange.toFixed(1)}%.`
          : 'Week-over-week comparison is unavailable.',
        `Momentum is currently ${latestWeek.momentumTrend.toLowerCase()}.`,
        anomalies.length > 0 ? `${anomalies.length} anomaly week(s) detected in the visible history.` : 'No anomaly weeks in the visible history.',
      ]
    : []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Growth Analysis"
        description="Weekly momentum, anomalies, and release-cohort performance."
        contextLabel="Scope"
        contextValue="Full history"
      />

      {!isLoading && summaryLines.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">What Changed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            {summaryLines.map((line, index) => (
              <div key={`summary-line-${index}`}>- {line}</div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <KpiCard
          icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
          label="This Week"
          loading={isLoading}
          body={
            latestWeek ? (
              <>
                <div className="text-2xl font-bold">{formatNumber(latestWeek.views)}</div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendArrow value={latestWeek.wowChange} />
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </>
            ) : null
          }
        />
        <KpiCard
          icon={<Zap className="h-4 w-4 text-yellow-500" />}
          label="Momentum"
          loading={isLoading}
          body={
            latestWeek ? (
              <>
                <div className="text-2xl font-bold">{latestWeek.momentumScore}</div>
                <div className={`text-sm ${momentumColors[latestWeek.momentumTrend]}`}>{latestWeek.momentumTrend}</div>
              </>
            ) : null
          }
        />
        <KpiCard
          icon={<Target className="h-4 w-4 text-purple-500" />}
          label="Performance"
          loading={isLoading}
          body={latestWeek ? <div className="mt-1"><TierBadge tier={latestWeek.tier} /></div> : null}
        />
        <KpiCard
          icon={
            data?.summary.wowTrendDirection === 'increasing' ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : data?.summary.wowTrendDirection === 'decreasing' ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <Minus className="h-4 w-4 text-gray-500" />
            )
          }
          label="Views Trend"
          loading={isLoading}
          body={
            data ? (
              <>
                <div className="text-2xl font-bold capitalize">{data.summary.wowTrendDirection}</div>
                <div className="text-sm text-muted-foreground">{data.summary.consistencyLabel}</div>
              </>
            ) : null
          }
        />
        <KpiCard
          icon={<Calendar className="h-4 w-4 text-sky-500" />}
          label="Avg Weekly Views"
          loading={isLoading}
          body={data ? <div className="text-2xl font-bold">{formatNumber(data.summary.averageWeeklyViews)}</div> : null}
        />
        <KpiCard
          icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
          label="Anomalies"
          loading={isLoading}
          body={data ? <div className="text-2xl font-bold">{data.summary.anomalyCount}</div> : null}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Views Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {isLoading ? <Skeleton className="h-full w-full" /> : <TimeSeriesChart data={viewsChartData} color="#3b82f6" title="" />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Week-over-Week Change</CardTitle>
            <div className="flex flex-wrap gap-2 pt-2">
              {WOW_TIMEFRAME_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setWowTimeframe(option.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    wowTimeframe === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="h-[320px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <TimeSeriesChart
                data={wowChartData}
                color="#6366f1"
                areaOpacity={0}
                showSymbol={true}
                symbolSize={7}
                valueFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`}
                yAxis={{ type: 'value', axisLabel: { formatter: (value: number) => `${value}%` } }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
            <p className="text-sm text-muted-foreground">Synthetic weekly table modeled after the real week-by-week workspace.</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={`growth-row-${index}`} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="w-[6%] py-3 px-1"></th>
                      <th className="w-[22%] py-3 px-3 text-left font-medium">Week</th>
                      <th className="w-[18%] py-3 px-3 text-right font-medium">Views</th>
                      <th className="w-[18%] py-3 px-3 text-right font-medium">WoW</th>
                      <th className="w-[15%] py-3 px-3 text-center font-medium">Tier</th>
                      <th className="w-[21%] py-3 px-3 text-right font-medium">Views vs Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...weeks].reverse().map((week) => (
                      <tr key={week.yearWeek} className={`border-b hover:bg-muted/40 ${week.anomaly ? 'bg-amber-50/60' : ''}`}>
                        <td className="py-3 px-1 text-center">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </td>
                        <td className="py-3 px-3 text-left">
                          <div className="font-medium">{formatDate(week.periodStart)}</div>
                          <div className="text-xs text-muted-foreground">{week.yearWeek}</div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="font-medium">{formatNumber(week.views)}</div>
                          {week.isPartial && week.projectedViews && (
                            <div className="text-xs text-muted-foreground">pace: {formatNumber(week.projectedViews)}</div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <TrendArrow value={week.wowChange} />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <TierBadge tier={week.tier} />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <TrendArrow value={week.vsAverage} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Momentum Gauge
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div className="flex flex-col items-center">
                <MomentumGauge score={data?.summary.currentMomentumScore} trend={data?.summary.currentMomentumTrend} />
                <div className="mt-6 w-full space-y-2 text-sm">
                  <SummaryRow label="Avg Weekly Views" value={formatNumber(data?.summary.averageWeeklyViews)} />
                  <SummaryRow label="Best Week" value={`${data?.summary.bestWeekLabel ?? '--'} · ${formatNumber(data?.summary.bestWeekViews)}`} />
                  <SummaryRow label="Anomalies" value={String(data?.summary.anomalyCount ?? 0)} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!isLoading && anomalies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Anomaly Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {anomalies.map((week) => (
                <div
                  key={week.yearWeek}
                  className={`rounded-lg border p-3 ${
                    week.anomaly?.type === 'spike'
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {week.anomaly?.type === 'spike' ? (
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{formatDate(week.periodStart)}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{week.anomaly?.reason}</div>
                  <div className="mt-2 text-xs">
                    <span className="rounded-full bg-white/80 px-2 py-0.5 font-medium">{week.anomaly?.severity} severity</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && data && (
        <div className="grid gap-4 lg:grid-cols-3">
          {data.focusAreas.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.detail}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function KpiCard({
  icon,
  label,
  loading,
  body,
}: {
  icon: ReactNode
  label: string
  loading: boolean
  body: ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>{loading ? <Skeleton className="h-8 w-20" /> : body}</CardContent>
    </Card>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
