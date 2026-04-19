import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAsyncResource } from '@/hooks/use-async-resource'
import { getGrowthData } from '@/lib/demo-client/client'
import {
  GrowthAnomalies,
  GrowthCharts,
  GrowthFocusAreas,
  GrowthKpiGrid,
  GrowthSummaryCard,
  GrowthWeeklyPerformance,
} from '@/features/growth/sections'
import {
  getAnomalyWeeks,
  getLatestWeek,
  getSummaryLines,
  getViewsChartData,
  getWowChartData,
  getWowWeeks,
} from '@/features/growth/utils'

export default function GrowthPage() {
  const { data, isLoading } = useAsyncResource('growth', getGrowthData)
  const [wowTimeframe, setWowTimeframe] = useState<number>(12)

  const weeks = data?.weeks ?? []
  const wowWeeks = useMemo(() => getWowWeeks(weeks, wowTimeframe), [weeks, wowTimeframe])
  const latestWeek = useMemo(() => getLatestWeek(data ?? null), [data])
  const viewsChartData = useMemo(() => getViewsChartData(weeks), [weeks])
  const wowChartData = useMemo(() => getWowChartData(wowWeeks), [wowWeeks])
  const anomalies = useMemo(() => getAnomalyWeeks(weeks), [weeks])
  const summaryLines = useMemo(() => getSummaryLines(latestWeek, anomalies), [anomalies, latestWeek])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Growth Analysis"
        description="Weekly momentum, anomalies, and release-cohort performance."
        contextLabel="Scope"
        contextValue="Full history"
      />

      {!isLoading && <GrowthSummaryCard summaryLines={summaryLines} />}
      <GrowthKpiGrid data={data ?? null} latestWeek={latestWeek} isLoading={isLoading} />
      <GrowthCharts
        isLoading={isLoading}
        viewsChartData={viewsChartData}
        wowChartData={wowChartData}
        wowTimeframe={wowTimeframe}
        onWowTimeframeChange={setWowTimeframe}
      />
      <GrowthWeeklyPerformance isLoading={isLoading} weeks={weeks} data={data ?? null} />
      {!isLoading && <GrowthAnomalies anomalies={anomalies} />}
      {!isLoading && <GrowthFocusAreas data={data ?? null} />}
    </div>
  )
}
