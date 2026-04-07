import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Activity, Gauge, Layers, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart'
import { DateRangeSelector } from '@/components/charts/DateRangeSelector'
import { PageHeader } from '@/components/layout/PageHeader'
import { getTechnicalAnalysisData } from '@/lib/demo-client/client'
import type {
  TechnicalAnalysisData,
  TechnicalAnalysisMetric,
  TechnicalAnalysisPoint,
} from '@/lib/demo-client/types'
import { useGlobalTimeframe } from '@/lib/timeframe/globalTimeframe'

type OverlayOption = {
  id: string
  label: string
  color: string
  accessor: (point: TechnicalAnalysisPoint) => number
}

const overlayOptions: OverlayOption[] = [
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

const indicatorPanels = [
  { id: 'rsi', label: 'RSI', color: '#f97316' },
  { id: 'macd', label: 'MACD', color: '#6366f1' },
  { id: 'roc', label: 'ROC', color: '#10b981' },
  { id: 'zscore', label: 'Z-Score', color: '#0ea5e9' },
] as const

function formatNumber(value?: number | null, options?: { compact?: boolean; percent?: boolean }) {
  if (value === null || value === undefined) return '--'
  if (options?.percent) return `${value.toFixed(2)}%`
  if (options?.compact) {
    if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}K`
  }
  return value.toLocaleString()
}

function TogglePill({
  label,
  color,
  active,
  onClick,
}: {
  label: string
  color: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
        active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </button>
  )
}

export default function TechnicalAnalysisPage() {
  const { globalTimeframeDays, setGlobalTimeframeDays, timeframeLabel } = useGlobalTimeframe()
  const [data, setData] = useState<TechnicalAnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [metricId, setMetricId] = useState('views')
  const [activeOverlays, setActiveOverlays] = useState<Record<string, boolean>>({
    smaShort: true,
    smaMid: true,
    smaLong: false,
    emaShort: false,
    emaMid: false,
    emaLong: false,
    bbUpper: false,
    bbMid: false,
    bbLower: false,
  })
  const [activePanels, setActivePanels] = useState<Record<string, boolean>>({
    rsi: true,
    macd: true,
    roc: false,
    zscore: false,
  })

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    getTechnicalAnalysisData()
      .then((result) => {
        if (cancelled) return
        setData(result)
        setIsLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setData(null)
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const availableMetrics = data?.metrics ?? []
  const selectedMetric: TechnicalAnalysisMetric | undefined =
    availableMetrics.find((metric) => metric.id === metricId) ?? availableMetrics[0]

  const points = useMemo(() => {
    const all = selectedMetric?.points ?? []
    if (globalTimeframeDays === undefined) return all
    const weeks = Math.max(4, Math.ceil(globalTimeframeDays / 7))
    return all.slice(-weeks)
  }, [globalTimeframeDays, selectedMetric?.points])

  const latest = points[points.length - 1]

  const series = useMemo(() => {
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
  }, [activeOverlays, points, selectedMetric])

  const rsiSeries = points.map((point) => ({ date: point.date, value: point.rsi }))
  const rocSeries = points.map((point) => ({ date: point.date, value: point.roc }))
  const zSeries = points.map((point) => ({ date: point.date, value: point.zscore }))
  const macdSeries = [
    { id: 'macd-line', name: 'MACD', color: '#6366f1', data: points.map((point) => ({ date: point.date, value: point.macdLine })) },
    { id: 'macd-signal', name: 'Signal', color: '#f97316', data: points.map((point) => ({ date: point.date, value: point.macdSignal })) },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="TA Workspace"
        description="Technical trend diagnostics on weekly metrics with overlays and momentum indicators."
        contextLabel="Timeframe"
        contextValue={timeframeLabel}
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2 text-xs font-semibold">
            <DateRangeSelector value={globalTimeframeDays} onChange={setGlobalTimeframeDays} />
            <span className="rounded-full border bg-background px-3 py-1 text-muted-foreground">
              Windows {data?.meta.windows.short ?? '--'}/{data?.meta.windows.mid ?? '--'}/{data?.meta.windows.long ?? '--'}
            </span>
            <span className="rounded-full border bg-background px-3 py-1 text-muted-foreground">
              RSI {data?.meta.rsiPeriod ?? '--'}
            </span>
            <span className="rounded-full border bg-background px-3 py-1 text-muted-foreground">
              MACD {data?.meta.macd.fast ?? '--'}/{data?.meta.macd.slow ?? '--'}/{data?.meta.macd.signal ?? '--'}
            </span>
          </div>
        }
      />

      <div className="flex flex-col gap-6 xl:flex-row">
        <aside className="self-start space-y-4 xl:sticky xl:top-6 xl:w-80 xl:shrink-0">
          <PanelCard icon={<SlidersHorizontal className="h-4 w-4" />} label="Metric">
            {isLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <>
                <select
                  value={selectedMetric?.id ?? metricId}
                  onChange={(event) => setMetricId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
                >
                  {availableMetrics.map((metric) => (
                    <option key={metric.id} value={metric.id}>
                      {metric.label}
                    </option>
                  ))}
                </select>
                <div className="mt-3 text-xs text-slate-500">
                  Latest{' '}
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {formatNumber(latest?.value, { compact: true })}
                  </span>
                </div>
              </>
            )}
          </PanelCard>

          <PanelCard icon={<Layers className="h-4 w-4" />} label="Overlays">
            <div className="mt-4 flex flex-wrap gap-2">
              {overlayOptions.map((option) => (
                <TogglePill
                  key={option.id}
                  label={option.label}
                  color={option.color}
                  active={Boolean(activeOverlays[option.id])}
                  onClick={() => setActiveOverlays((current) => ({ ...current, [option.id]: !current[option.id] }))}
                />
              ))}
            </div>
          </PanelCard>

          <PanelCard icon={<Gauge className="h-4 w-4" />} label="Panels">
            <div className="mt-4 flex flex-wrap gap-2">
              {indicatorPanels.map((panel) => (
                <TogglePill
                  key={panel.id}
                  label={panel.label}
                  color={panel.color}
                  active={Boolean(activePanels[panel.id])}
                  onClick={() => setActivePanels((current) => ({ ...current, [panel.id]: !current[panel.id] }))}
                />
              ))}
            </div>
          </PanelCard>

          <PanelCard icon={<Activity className="h-4 w-4" />} label="Latest Snapshot">
            <div className="mt-4 space-y-3 text-sm">
              <SnapshotRow label="Change" value={`${formatNumber(latest?.changeAbs)} (${formatNumber(latest?.changePct, { percent: true })})`} />
              <SnapshotRow label="RSI" value={formatNumber(latest?.rsi)} />
              <SnapshotRow label="MACD" value={formatNumber(latest?.macdLine)} />
              <SnapshotRow label="Z-Score" value={formatNumber(latest?.zscore)} />
            </div>
          </PanelCard>
        </aside>

        <section className="min-w-0 flex-1 space-y-4">
          <div className="rounded-2xl border bg-white shadow-[0_20px_70px_-55px_rgba(15,23,42,0.45)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  <Sparkles className="h-4 w-4" />
                  Overlay stack
                </div>
                <div className="text-lg font-semibold text-slate-900">
                  {selectedMetric?.label ?? 'Metric'}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full border px-3 py-1 text-slate-600">
                  Latest <span style={{ fontFamily: 'var(--font-mono)' }}>{formatNumber(latest?.value, { compact: true })}</span>
                </span>
                <span className="rounded-full border px-3 py-1 text-slate-600">
                  Change <span style={{ fontFamily: 'var(--font-mono)' }}>{formatNumber(latest?.changePct, { percent: true })}</span>
                </span>
              </div>
            </div>
            <div className="h-[520px] px-4 pb-4 pt-2">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <TimeSeriesChart
                  series={series}
                  grid={{ top: 32, left: 56, right: 24, bottom: 32 }}
                  legend={{ top: 8, left: 16, icon: 'circle' }}
                  areaOpacity={0.12}
                />
              )}
            </div>
          </div>

          {activePanels.rsi && (
            <IndicatorPanel label="RSI" loading={isLoading}>
              <TimeSeriesChart
                data={rsiSeries}
                color="#f97316"
                grid={{ top: 16, left: 56, right: 24, bottom: 28 }}
                yAxis={{ min: 0, max: 100 }}
                areaOpacity={0}
              />
            </IndicatorPanel>
          )}

          {activePanels.macd && (
            <IndicatorPanel label="MACD" loading={isLoading}>
              <TimeSeriesChart
                series={macdSeries}
                grid={{ top: 16, left: 56, right: 24, bottom: 28 }}
                legend={{ top: 4, left: 12, icon: 'circle' }}
                areaOpacity={0}
              />
            </IndicatorPanel>
          )}

          {activePanels.roc && (
            <IndicatorPanel label="ROC" loading={isLoading}>
              <TimeSeriesChart
                data={rocSeries}
                color="#10b981"
                grid={{ top: 16, left: 56, right: 24, bottom: 28 }}
                areaOpacity={0}
              />
            </IndicatorPanel>
          )}

          {activePanels.zscore && (
            <IndicatorPanel label="Z-Score" loading={isLoading}>
              <TimeSeriesChart
                data={zSeries}
                color="#0ea5e9"
                grid={{ top: 16, left: 56, right: 24, bottom: 28 }}
                yAxis={{ min: -3, max: 3 }}
                areaOpacity={0}
              />
            </IndicatorPanel>
          )}
        </section>
      </div>
    </div>
  )
}

function PanelCard({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border bg-white/90 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)]">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {icon}
        {label}
      </div>
      {children}
    </div>
  )
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
        {value}
      </span>
    </div>
  )
}

function IndicatorPanel({
  label,
  loading,
  children,
}: {
  label: string
  loading: boolean
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border bg-white px-4 py-3 shadow-[0_18px_60px_-55px_rgba(15,23,42,0.3)]">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className="h-[210px]">{loading ? <Skeleton className="h-full w-full" /> : children}</div>
    </div>
  )
}
