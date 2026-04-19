import { useMemo, useState } from 'react'
import { DateRangeSelector } from '@/components/charts/DateRangeSelector'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAsyncResource } from '@/hooks/use-async-resource'
import { getTechnicalAnalysisData } from '@/lib/demo-client/client'
import { useGlobalTimeframe } from '@/lib/timeframe/globalTimeframe'
import {
  TechnicalAnalysisHeaderChips,
  TechnicalAnalysisIndicators,
  TechnicalAnalysisOverlayChart,
  TechnicalAnalysisSidebar,
} from '@/features/technical-analysis/sections'
import {
  getIndicatorSeries,
  getOverlaySeries,
  getSelectedMetric,
  getVisiblePoints,
} from '@/features/technical-analysis/utils'

export default function TechnicalAnalysisPage() {
  const { globalTimeframeDays, setGlobalTimeframeDays, timeframeLabel } = useGlobalTimeframe()
  const { data, isLoading } = useAsyncResource(
    'technical-analysis',
    getTechnicalAnalysisData
  )
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

  const availableMetrics = data?.metrics ?? []
  const selectedMetric = getSelectedMetric(availableMetrics, metricId)

  const points = useMemo(() => {
    return getVisiblePoints(selectedMetric?.points ?? [], globalTimeframeDays)
  }, [globalTimeframeDays, selectedMetric?.points])

  const latest = points[points.length - 1]

  const series = useMemo(() => {
    return getOverlaySeries(selectedMetric, points, activeOverlays)
  }, [activeOverlays, points, selectedMetric])

  const { rsiSeries, rocSeries, zSeries, macdSeries } = useMemo(() => getIndicatorSeries(points), [points])

  return (
    <div className="space-y-6">
      <PageHeader
        title="TA Workspace"
        description="Technical trend diagnostics on weekly metrics with overlays and momentum indicators."
        contextLabel="Timeframe"
        contextValue={timeframeLabel}
        actions={
          <TechnicalAnalysisHeaderChips data={data ?? null}>
            <DateRangeSelector value={globalTimeframeDays} onChange={setGlobalTimeframeDays} />
          </TechnicalAnalysisHeaderChips>
        }
      />

      <div className="flex flex-col gap-6 xl:flex-row">
        <TechnicalAnalysisSidebar
          isLoading={isLoading}
          availableMetrics={availableMetrics}
          selectedMetric={selectedMetric}
          metricId={metricId}
          setMetricId={setMetricId}
          latest={latest}
          activeOverlays={activeOverlays}
          setActiveOverlays={setActiveOverlays}
          activePanels={activePanels}
          setActivePanels={setActivePanels}
        />

        <section className="min-w-0 flex-1 space-y-4">
          <TechnicalAnalysisOverlayChart
            isLoading={isLoading}
            selectedMetric={selectedMetric}
            latest={latest}
            series={series}
          />
          <TechnicalAnalysisIndicators
            isLoading={isLoading}
            activePanels={activePanels}
            rsiSeries={rsiSeries}
            macdSeries={macdSeries}
            rocSeries={rocSeries}
            zSeries={zSeries}
          />
        </section>
      </div>
    </div>
  )
}
