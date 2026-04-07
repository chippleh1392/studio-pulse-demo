import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/layout/PageHeader'
import { DateRangeSelector } from '@/components/charts/DateRangeSelector'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { getCreativeData } from '@/lib/demo-client/client'
import type { CreativeCombo, CreativeData, CreativeGroup } from '@/lib/demo-client/types'
import { useGlobalTimeframe } from '@/lib/timeframe/globalTimeframe'

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

function formatDuration(seconds?: number | null): string {
  if (!seconds || seconds <= 0) return '--'
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function normalizeKey(value?: string | null): string {
  return (value || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function toCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function downloadCsv(filename: string, headers: string[], rows: Array<(string | number | null | undefined)[]>) {
  const lines = [headers.join(',')]
  for (const row of rows) lines.push(row.map(toCsvValue).join(','))
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function makeScatterOptions(points: Array<{ name: string; value: number[] }>, color: string): EChartsOption {
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const point = params as { name?: string; value?: Array<number | string> }
        const values = Array.isArray(point.value) ? point.value : []
        const ctr = typeof values[0] === 'number' ? values[0] : 0
        const avdSeconds = typeof values[1] === 'number' ? values[1] : 0
        const count = typeof values[2] === 'number' ? values[2] : 0
        const avgViews = typeof values[3] === 'number' ? values[3] : 0
        return `${point.name ?? 'Unknown'}<br/>CTR: ${ctr.toFixed(2)}%<br/>AVD: ${formatDuration(avdSeconds)}<br/>Videos: ${count}<br/>Avg Views: ${formatNumber(avgViews)}`
      },
    },
    grid: { left: 48, right: 24, top: 24, bottom: 48 },
    xAxis: {
      name: 'CTR (%)',
      nameLocation: 'middle',
      nameGap: 30,
      type: 'value',
      axisLabel: { formatter: '{value}%' },
    },
    yAxis: {
      name: 'AVD (sec)',
      nameLocation: 'middle',
      nameGap: 40,
      type: 'value',
    },
    series: [
      {
        type: 'scatter',
        data: points,
        symbolSize: (val: number[]) => {
          const size = Math.sqrt(val[2]) * 10
          return Math.max(10, Math.min(34, size))
        },
        itemStyle: { color },
      },
    ],
  }
}

type GroupKind = 'theme' | 'thumbnail'

export default function CreativePage() {
  const { globalTimeframeDays, setGlobalTimeframeDays, timeframeLabel, buildPathWithTimeframe } = useGlobalTimeframe()
  const [data, setData] = useState<CreativeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [themeSearch, setThemeSearch] = useState('')
  const [thumbSearch, setThumbSearch] = useState('')
  const [videoSearch, setVideoSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<{ type: GroupKind; key: string } | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    getCreativeData()
      .then((result) => {
        if (isMounted) setData(result)
      })
      .catch(() => {
        if (isMounted) setData(null)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [globalTimeframeDays])

  const filteredThemes = useMemo(() => {
    const term = themeSearch.trim().toLowerCase()
    return (data?.themes ?? []).filter((item) => !term || item.key.toLowerCase().includes(term))
  }, [data?.themes, themeSearch])

  const filteredThumbnails = useMemo(() => {
    const term = thumbSearch.trim().toLowerCase()
    return (data?.thumbnails ?? []).filter((item) => !term || item.key.toLowerCase().includes(term))
  }, [data?.thumbnails, thumbSearch])

  const filteredVideos = useMemo(() => {
    const term = videoSearch.trim().toLowerCase()
    const list = [...(data?.videos ?? [])]
    const filtered = term
      ? list.filter((video) =>
          [video.title, video.videoId, video.theme, video.thumbnailText].join(' ').toLowerCase().includes(term)
        )
      : list
    return filtered.sort((a, b) => b.views - a.views)
  }, [data?.videos, videoSearch])

  const selectedVideos = useMemo(() => {
    if (!selectedGroup || !data?.videos) return []
    const targetKey = normalizeKey(selectedGroup.key)
    return data.videos
      .filter((video) =>
        selectedGroup.type === 'theme'
          ? normalizeKey(video.theme) === targetKey
          : normalizeKey(video.thumbnailText) === targetKey
      )
      .sort((a, b) => b.views - a.views)
  }, [data?.videos, selectedGroup])

  const themeScatterOptions = useMemo(() => {
    const points = (data?.themes ?? []).map((theme) => ({
      name: theme.key,
      value: [theme.avgCtr, theme.avgAvdSeconds, theme.videoCount, theme.avgViews],
    }))
    return makeScatterOptions(points, '#2563eb')
  }, [data?.themes])

  const thumbnailScatterOptions = useMemo(() => {
    const points = (data?.thumbnails ?? []).map((thumb) => ({
      name: thumb.key,
      value: [thumb.avgCtr, thumb.avgAvdSeconds, thumb.videoCount, thumb.avgViews],
    }))
    return makeScatterOptions(points, '#10b981')
  }, [data?.thumbnails])

  const exportVideoCsv = () => {
    if (!data?.videos?.length) return
    downloadCsv(
      'creative-videos.csv',
      ['video_id', 'title', 'publish_date', 'theme', 'thumbnail_text', 'views', 'impressions', 'ctr', 'avd_seconds', 'avp', 'engagement_rate', 'watch_time_minutes'],
      data.videos.map((video) => [
        video.videoId,
        video.title,
        video.publishDate,
        video.theme,
        video.thumbnailText,
        video.views,
        video.impressions,
        video.ctr,
        video.avdSeconds,
        video.avp,
        video.engagementRate,
        video.watchTimeMinutes,
      ])
    )
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

      <div className="grid gap-4 md:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-28 w-full" />)
        ) : (
          <>
            <SummaryCard label="Avg Views" value={formatNumber(data?.summary.avgViews ?? 0)} />
            <SummaryCard label="Avg CTR" value={`${(data?.summary.avgCtr ?? 0).toFixed(2)}%`} />
            <SummaryCard label="Avg AVD" value={formatDuration(data?.summary.avgAvdSeconds)} />
            <SummaryCard label="Videos" value={String(data?.summary.totalVideos ?? 0)} />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Decision Handoff</CardTitle>
          <CardDescription>Use creative patterns here, then drill into the relevant execution surface.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link to={buildPathWithTimeframe('/videos')} className="rounded-lg border p-3 text-sm hover:bg-muted/40">
            <div className="font-medium">Videos</div>
            <div className="mt-1 text-xs text-muted-foreground">Inspect individual packages and detailed metrics.</div>
          </Link>
          <Link to={buildPathWithTimeframe('/breakout')} className="rounded-lg border p-3 text-sm hover:bg-muted/40">
            <div className="font-medium">Breakout</div>
            <div className="mt-1 text-xs text-muted-foreground">Route strong package candidates into breakout review.</div>
          </Link>
          <Link to={buildPathWithTimeframe('/metadata')} className="rounded-lg border p-3 text-sm hover:bg-muted/40">
            <div className="font-medium">Metadata</div>
            <div className="mt-1 text-xs text-muted-foreground">Check whether winning creative patterns are also well-labeled.</div>
          </Link>
          <Link to={buildPathWithTimeframe('/growth')} className="rounded-lg border p-3 text-sm hover:bg-muted/40">
            <div className="font-medium">Growth</div>
            <div className="mt-1 text-xs text-muted-foreground">Validate which creative shifts mattered at the weekly level.</div>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theme Scatter</CardTitle>
            <CardDescription>CTR vs AVD for major theme clusters</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            {isLoading ? <Skeleton className="h-full w-full" /> : <ReactECharts option={themeScatterOptions} style={{ height: '100%', width: '100%' }} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Thumbnail Scatter</CardTitle>
            <CardDescription>CTR vs AVD for the current thumbnail text system</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            {isLoading ? <Skeleton className="h-full w-full" /> : <ReactECharts option={thumbnailScatterOptions} style={{ height: '100%', width: '100%' }} />}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Themes</CardTitle>
                <CardDescription>Theme-level packaging performance</CardDescription>
              </div>
              <Input value={themeSearch} onChange={(event) => setThemeSearch(event.target.value)} placeholder="Search themes" className="h-8 w-48" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="h-12 w-full" />)
            ) : (
              filteredThemes.map((item) => (
                <GroupRow key={`theme-${item.key}`} item={item} onOpen={() => setSelectedGroup({ type: 'theme', key: item.key })} />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Thumbnail Text</CardTitle>
                <CardDescription>Thumbnail message performance</CardDescription>
              </div>
              <Input value={thumbSearch} onChange={(event) => setThumbSearch(event.target.value)} placeholder="Search thumbnail text" className="h-8 w-48" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="h-12 w-full" />)
            ) : (
              filteredThumbnails.map((item) => (
                <GroupRow key={`thumb-${item.key}`} item={item} onOpen={() => setSelectedGroup({ type: 'thumbnail', key: item.key })} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Theme / Thumbnail Combos</CardTitle>
          <CardDescription>Fast scan of the strongest paired packaging systems</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-24 w-full" />)
          ) : (
            (data?.combos ?? []).map((combo) => <ComboCard key={`${combo.theme}-${combo.thumbnailText}`} combo={combo} />)
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>All Creative Videos</CardTitle>
              <CardDescription>Sortable list of video-level creative metadata and performance.</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={videoSearch}
                onChange={(event) => setVideoSearch(event.target.value)}
                placeholder="Search title, id, theme, thumbnail"
                className="h-8 w-72"
              />
              <Button variant="outline" className="h-8" onClick={exportVideoCsv}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, idx) => (
                <Skeleton key={idx} className="h-8 w-full" />
              ))}
            </div>
          ) : filteredVideos.length ? (
            <>
              <div className="mb-2 text-xs text-muted-foreground">Showing {filteredVideos.length} videos</div>
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-[1180px] w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr className="text-xs text-muted-foreground">
                      <th className="px-3 py-2 text-left">Video</th>
                      <th className="px-3 py-2 text-left">Theme</th>
                      <th className="px-3 py-2 text-left">Thumbnail</th>
                      <th className="px-3 py-2 text-right">Views</th>
                      <th className="px-3 py-2 text-right">Impressions</th>
                      <th className="px-3 py-2 text-right">CTR</th>
                      <th className="px-3 py-2 text-right">AVD</th>
                      <th className="px-3 py-2 text-right">AVP</th>
                      <th className="px-3 py-2 text-right">Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVideos.map((video) => (
                      <tr key={video.videoId} className="border-t">
                        <td className="px-3 py-2 min-w-[260px]">
                          <Link to={buildPathWithTimeframe(`/videos/${video.videoId}`)} className="hover:underline">
                            {video.title}
                          </Link>
                          <div className="mt-1 text-[11px] text-muted-foreground">{video.publishDate}</div>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{video.theme}</td>
                        <td className="px-3 py-2 text-muted-foreground">{video.thumbnailText}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{formatNumber(video.views)}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{formatNumber(video.impressions)}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{video.ctr.toFixed(2)}%</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{formatDuration(video.avdSeconds)}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{video.avp.toFixed(1)}%</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{video.engagementRate.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No videos matched this filter.</p>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!selectedGroup} onOpenChange={(open) => !open && setSelectedGroup(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {selectedGroup?.type === 'theme' ? 'Theme' : 'Thumbnail'}: {selectedGroup?.key}
            </SheetTitle>
            <SheetDescription>{selectedVideos.length} related videos sorted by views</SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {selectedVideos.length ? (
              <div className="max-h-[70vh] overflow-y-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="px-3 py-2 text-left">Video</th>
                      <th className="px-3 py-2 text-right">Views</th>
                      <th className="px-3 py-2 text-right">CTR</th>
                      <th className="px-3 py-2 text-right">AVD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVideos.map((video) => (
                      <tr key={video.videoId} className="border-t">
                        <td className="px-3 py-2">
                          <Link to={buildPathWithTimeframe(`/videos/${video.videoId}`)} className="hover:underline">
                            {video.title}
                          </Link>
                        </td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{formatNumber(video.views)}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{video.ctr.toFixed(2)}%</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{formatDuration(video.avdSeconds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No videos found for this group.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function GroupRow({ item, onOpen }: { item: CreativeGroup; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid w-full grid-cols-[1.2fr_80px_90px_80px_80px] gap-3 rounded-lg border p-3 text-left hover:bg-muted/40"
    >
      <div className="min-w-0">
        <div className="truncate font-medium">{item.key}</div>
        <div className="text-xs text-muted-foreground">{item.videoCount} videos</div>
      </div>
      <div className="text-right text-sm text-muted-foreground">{formatNumber(item.avgViews)}</div>
      <div className="text-right text-sm text-muted-foreground">{item.avgCtr.toFixed(2)}%</div>
      <div className="text-right text-sm text-muted-foreground">{formatDuration(item.avgAvdSeconds)}</div>
      <div className="text-right text-sm font-medium">{item.successScore.toFixed(0)}</div>
    </button>
  )
}

function ComboCard({ combo }: { combo: CreativeCombo }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm font-semibold">{combo.theme}</div>
      <div className="mt-1 text-xs text-muted-foreground">{combo.thumbnailText}</div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Views</div>
          <div className="font-medium">{formatNumber(combo.avgViews)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">CTR</div>
          <div className="font-medium">{combo.avgCtr.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  )
}
