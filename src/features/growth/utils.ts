import type { GrowthData, GrowthWeek } from '@/lib/demo-client/types'

export const WOW_TIMEFRAME_OPTIONS = [
  { label: '4w', value: 4 },
  { label: '8w', value: 8 },
  { label: '12w', value: 12 },
  { label: 'All', value: 0 },
] as const

export const tierColors: Record<GrowthWeek['tier'], string> = {
  Excellent: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Good: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  Average: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Poor: 'bg-red-500/10 text-red-600 border-red-500/20',
}

export const momentumColors: Record<GrowthWeek['momentumTrend'], string> = {
  'Strong Positive': 'text-emerald-600',
  Positive: 'text-green-500',
  Neutral: 'text-gray-500',
  Negative: 'text-orange-500',
}

export function formatGrowthNumber(value?: number | null): string {
  if (value === undefined || value === null) return '--'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toLocaleString()
}

export function formatGrowthDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function getWowWeeks(weeks: GrowthWeek[], timeframe: number) {
  return timeframe > 0 ? weeks.slice(-timeframe) : weeks
}

export function getAnomalyWeeks(weeks: GrowthWeek[]) {
  return weeks.filter((week) => week.anomaly)
}

export function getViewsChartData(weeks: GrowthWeek[]) {
  return weeks.map((week) => ({ date: week.periodStart, value: week.views }))
}

export function getWowChartData(weeks: GrowthWeek[]) {
  return weeks.map((week) => ({ date: week.periodStart, value: week.wowChange }))
}

export function getSummaryLines(latestWeek: GrowthWeek | undefined, anomalies: GrowthWeek[]) {
  if (!latestWeek) return []

  return [
    `Latest week delivered ${formatGrowthNumber(latestWeek.views)} views across ${latestWeek.releaseCount} release(s).`,
    latestWeek.wowChange !== null
      ? `Week-over-week change is ${latestWeek.wowChange > 0 ? '+' : ''}${latestWeek.wowChange.toFixed(1)}%.`
      : 'Week-over-week comparison is unavailable.',
    `Momentum is currently ${latestWeek.momentumTrend.toLowerCase()}.`,
    anomalies.length > 0
      ? `${anomalies.length} anomaly week(s) detected in the visible history.`
      : 'No anomaly weeks in the visible history.',
  ]
}

export function getLatestWeek(data: GrowthData | null) {
  const weeks = data?.weeks ?? []
  return weeks[weeks.length - 1]
}
