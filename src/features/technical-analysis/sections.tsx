import type { ReactNode } from 'react'
import { Activity, Gauge, Layers, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart'
import type { TechnicalAnalysisMetric, TechnicalAnalysisPoint, TechnicalAnalysisData } from '@/lib/demo-client/types'
import { formatTechnicalNumber, indicatorPanels, overlayOptions } from '@/features/technical-analysis/utils'

export function TechnicalAnalysisSidebar({
  isLoading,
  availableMetrics,
  selectedMetric,
  metricId,
  setMetricId,
  latest,
  activeOverlays,
  setActiveOverlays,
  activePanels,
  setActivePanels,
}: {
  isLoading: boolean
  availableMetrics: TechnicalAnalysisMetric[]
  selectedMetric: TechnicalAnalysisMetric | undefined
  metricId: string
  setMetricId: (value: string) => void
  latest: TechnicalAnalysisPoint | undefined
  activeOverlays: Record<string, boolean>
  setActiveOverlays: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  activePanels: Record<string, boolean>
  setActivePanels: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}) {
  return (
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
              aria-label="Select technical analysis metric"
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
                {formatTechnicalNumber(latest?.value, { compact: true })}
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
          <SnapshotRow label="Change" value={`${formatTechnicalNumber(latest?.changeAbs)} (${formatTechnicalNumber(latest?.changePct, { percent: true })})`} />
          <SnapshotRow label="RSI" value={formatTechnicalNumber(latest?.rsi)} />
          <SnapshotRow label="MACD" value={formatTechnicalNumber(latest?.macdLine)} />
          <SnapshotRow label="Z-Score" value={formatTechnicalNumber(latest?.zscore)} />
        </div>
      </PanelCard>
    </aside>
  )
}

export function TechnicalAnalysisOverlayChart({
  isLoading,
  selectedMetric,
  latest,
  series,
}: {
  isLoading: boolean
  selectedMetric: TechnicalAnalysisMetric | undefined
  latest: TechnicalAnalysisPoint | undefined
  series: {
    id: string
    name: string
    color?: string
    data: { date: string; value: number | null }[]
  }[]
}) {
  return (
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
            Latest <span style={{ fontFamily: 'var(--font-mono)' }}>{formatTechnicalNumber(latest?.value, { compact: true })}</span>
          </span>
          <span className="rounded-full border px-3 py-1 text-slate-600">
            Change <span style={{ fontFamily: 'var(--font-mono)' }}>{formatTechnicalNumber(latest?.changePct, { percent: true })}</span>
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
  )
}

export function TechnicalAnalysisIndicators({
  isLoading,
  activePanels,
  rsiSeries,
  macdSeries,
  rocSeries,
  zSeries,
}: {
  isLoading: boolean
  activePanels: Record<string, boolean>
  rsiSeries: { date: string; value: number | null }[]
  macdSeries: {
    id: string
    name: string
    color?: string
    data: { date: string; value: number | null }[]
  }[]
  rocSeries: { date: string; value: number | null }[]
  zSeries: { date: string; value: number | null }[]
}) {
  return (
    <>
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
    </>
  )
}

export function TechnicalAnalysisHeaderChips({
  data,
  children,
}: {
  data: TechnicalAnalysisData | null
  children: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-xs font-semibold">
      {children}
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
  )
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
      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/60 ${
        active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </button>
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
