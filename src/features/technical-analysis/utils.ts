import type { TechnicalAnalysisMetric, TechnicalAnalysisPoint } from '@/lib/demo-client/types'

export type OverlayOption = {
  id: string
  label: string
  color: string
  accessor: (point: TechnicalAnalysisPoint) => number
}

export const overlayOptions: OverlayOption[] = [
  { id: 'smaShort', label: 'SMA Short', color: '#f97316', accessor: (point) => point.overlays.smaShort },
  { id: 'smaMid', label: 'SMA Mid', color: '#f59e0b', accessor: (point) => point.overlays.smaMid },
  { id: 'smaLong', label: 'SMA Long', color: '#fbbf24', accessor: (point) => point.overlays.smaLong },
  { id: 'emaShort', label: 'EMA Short', color: '#22c55e', accessor: (point) => point.overlays.emaShort },
  { id: 'emaMid', label: 'EMA Mid', color: '#16a34a', accessor: (point) => point.overlays.emaMid },
  { id: 'emaLong', label: 'EMA Long', color: '#15803d', accessor: (point) => point.overlays.emaLong },
  { id: 'bbUpper', label: 'BB Upper', color: '#38bdf8', accessor: (point) => point.overlays.bbUpper },
  { id: 'bbMid', label: 'BB Mid', color: '#0ea5e9', accessor: (point) => point.overlays.bbMid },
  { id: 'bbLower', label: 'BB Lower', color: '#0284c7', accessor: (point) => point.overlays.bbLower },
]

export const indicatorPanels = [
  { id: 'rsi', label: 'RSI', color: '#f97316' },
  { id: 'macd', label: 'MACD', color: '#6366f1' },
  { id: 'roc', label: 'ROC', color: '#10b981' },
  { id: 'zscore', label: 'Z-Score', color: '#0ea5e9' },
] as const

export function formatTechnicalNumber(value?: number | null, options?: { compact?: boolean; percent?: boolean }) {
  if (value === null || value === undefined) return '--'
  if (options?.percent) return `${value.toFixed(2)}%`
  if (options?.compact) {
    if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}K`
  }
  return value.toLocaleString()
}

export function getSelectedMetric(availableMetrics: TechnicalAnalysisMetric[], metricId: string) {
  return availableMetrics.find((metric) => metric.id === metricId) ?? availableMetrics[0]
}

export function getVisiblePoints(
  points: TechnicalAnalysisPoint[],
  globalTimeframeDays: number | undefined
) {
  if (globalTimeframeDays === undefined) return points
  const weeks = Math.max(4, Math.ceil(globalTimeframeDays / 7))
  return points.slice(-weeks)
}

export function getOverlaySeries(
  selectedMetric: TechnicalAnalysisMetric | undefined,
  points: TechnicalAnalysisPoint[],
  activeOverlays: Record<string, boolean>
) {
  if (!selectedMetric) return []

  return [
    {
      id: 'base',
      name: selectedMetric.label,
      color: '#0f172a',
      data: points.map((point) => ({ date: point.date, value: point.value })),
    },
    ...overlayOptions
      .filter((option) => activeOverlays[option.id])
      .map((option) => ({
        id: option.id,
        name: option.label,
        color: option.color,
        data: points.map((point) => ({ date: point.date, value: option.accessor(point) })),
      })),
  ]
}

export function getIndicatorSeries(points: TechnicalAnalysisPoint[]) {
  return {
    rsiSeries: points.map((point) => ({ date: point.date, value: point.rsi })),
    rocSeries: points.map((point) => ({ date: point.date, value: point.roc })),
    zSeries: points.map((point) => ({ date: point.date, value: point.zscore })),
    macdSeries: [
      { id: 'macd-line', name: 'MACD', color: '#6366f1', data: points.map((point) => ({ date: point.date, value: point.macdLine })) },
      { id: 'macd-signal', name: 'Signal', color: '#f97316', data: points.map((point) => ({ date: point.date, value: point.macdSignal })) },
    ],
  }
}
