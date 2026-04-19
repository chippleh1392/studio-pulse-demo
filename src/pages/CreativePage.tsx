import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DateRangeSelector } from '@/components/charts/DateRangeSelector'
import { useAsyncResource } from '@/hooks/use-async-resource'
import { getCreativeData } from '@/lib/demo-client/client'
import { useGlobalTimeframe } from '@/lib/timeframe/globalTimeframe'
import {
  CreativeCombosSection,
  CreativeDecisionHandoff,
  CreativeGroupDetailSheet,
  CreativeGroupTables,
  CreativeScatterGrid,
  CreativeSummaryGrid,
  CreativeVideosSection,
} from '@/features/creative/sections'
import {
  exportCreativeVideosCsv,
  filterCreativeGroups,
  filterCreativeVideos,
  getSelectedCreativeVideos,
  getScatterPoints,
  makeScatterOptions,
  type GroupKind,
} from '@/features/creative/utils'

export default function CreativePage() {
  const { globalTimeframeDays, setGlobalTimeframeDays, timeframeLabel, buildPathWithTimeframe } = useGlobalTimeframe()
  const { data, isLoading } = useAsyncResource('creative', getCreativeData)
  const [themeSearch, setThemeSearch] = useState('')
  const [thumbSearch, setThumbSearch] = useState('')
  const [videoSearch, setVideoSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<{ type: GroupKind; key: string } | null>(null)

  const filteredThemes = useMemo(() => {
    return filterCreativeGroups(data?.themes ?? [], themeSearch)
  }, [data?.themes, themeSearch])

  const filteredThumbnails = useMemo(() => {
    return filterCreativeGroups(data?.thumbnails ?? [], thumbSearch)
  }, [data?.thumbnails, thumbSearch])

  const filteredVideos = useMemo(() => {
    return filterCreativeVideos(data?.videos ?? [], videoSearch)
  }, [data?.videos, videoSearch])

  const selectedVideos = useMemo(() => {
    return getSelectedCreativeVideos(data?.videos ?? [], selectedGroup)
  }, [data?.videos, selectedGroup])

  const themeScatterOptions = useMemo(() => {
    return makeScatterOptions(getScatterPoints(data?.themes), '#2563eb')
  }, [data?.themes])

  const thumbnailScatterOptions = useMemo(() => {
    return makeScatterOptions(getScatterPoints(data?.thumbnails), '#10b981')
  }, [data?.thumbnails])

  const exportVideoCsv = () => {
    exportCreativeVideosCsv(data?.videos ?? [])
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Creative Insights"
        description="Cross-video theme and thumbnail pattern analysis for packaging decisions."
        contextLabel="Timeframe"
        contextValue={timeframeLabel}
        actions={<DateRangeSelector value={globalTimeframeDays} onChange={setGlobalTimeframeDays} />}
      />

      <CreativeSummaryGrid isLoading={isLoading} summary={data?.summary} />
      <CreativeDecisionHandoff buildPathWithTimeframe={buildPathWithTimeframe} />
      <CreativeScatterGrid
        isLoading={isLoading}
        themeScatterOptions={themeScatterOptions}
        thumbnailScatterOptions={thumbnailScatterOptions}
      />
      <CreativeGroupTables
        isLoading={isLoading}
        themeSearch={themeSearch}
        onThemeSearchChange={setThemeSearch}
        thumbSearch={thumbSearch}
        onThumbSearchChange={setThumbSearch}
        filteredThemes={filteredThemes}
        filteredThumbnails={filteredThumbnails}
        onOpenGroup={setSelectedGroup}
      />
      <CreativeCombosSection isLoading={isLoading} combos={data?.combos ?? []} />
      <CreativeVideosSection
        isLoading={isLoading}
        videoSearch={videoSearch}
        onVideoSearchChange={setVideoSearch}
        filteredVideos={filteredVideos}
        onExportCsv={exportVideoCsv}
        buildPathWithTimeframe={buildPathWithTimeframe}
      />
      <CreativeGroupDetailSheet
        selectedGroup={selectedGroup}
        selectedVideos={selectedVideos}
        onOpenChange={(open) => !open && setSelectedGroup(null)}
        buildPathWithTimeframe={buildPathWithTimeframe}
      />
    </div>
  )
}
