import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, ArrowUpDown, Filter, Search, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAsyncResource } from '@/hooks/use-async-resource'
import { getVideosData } from '@/lib/demo-client/client'
import type { DemoVideo } from '@/lib/demo-client/types'

type VideoTypeFilter = 'all' | 'videos' | 'live'
type SortKey = 'publishedAt' | 'views' | 'watchHours' | 'ctr' | 'avdSeconds' | 'score'
type SortDirection = 'asc' | 'desc'

const tierColors: Record<DemoVideo['tier'], string> = {
  Excellent: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  Good: 'bg-blue-500/10 text-blue-600 border-blue-200',
  Average: 'bg-amber-500/10 text-amber-600 border-amber-200',
  Poor: 'bg-red-500/10 text-red-600 border-red-200',
}

function formatAvd(seconds: number): string {
  const totalSeconds = Math.max(0, Math.round(seconds))
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: value >= 100000 ? 1 : 0,
  }).format(value)
}

function formatLongNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

function buildFilteredSummary(items: DemoVideo[]) {
  const totalViews = items.reduce((sum, video) => sum + video.views, 0)
  const totalWatchHours = items.reduce((sum, video) => sum + video.watchHours, 0)
  const weightedCtrNumerator = items.reduce((sum, video) => sum + video.ctr * video.impressions, 0)
  const weightedCtrDenominator = items.reduce((sum, video) => sum + video.impressions, 0)
  const avgAvdSeconds = items.length
    ? items.reduce((sum, video) => sum + video.avdSeconds, 0) / items.length
    : 0
  const avgApv = items.length ? items.reduce((sum, video) => sum + video.avp, 0) / items.length : 0
  const avgScore = items.length ? items.reduce((sum, video) => sum + video.score, 0) / items.length : 0

  return {
    totalViews,
    totalWatchHours,
    weightedCtr: weightedCtrDenominator > 0 ? weightedCtrNumerator / weightedCtrDenominator : 0,
    avgAvdSeconds,
    avgApv,
    avgScore,
  }
}

function VideoThumbnail({ video }: { video: DemoVideo }) {
  return (
    <div className="flex h-[74px] w-[132px] items-end overflow-hidden rounded-lg border border-slate-200 bg-[linear-gradient(160deg,#d6e7f4_0%,#bfcee7_48%,#b8a9d8_100%)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
      <div className="rounded bg-white/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700 backdrop-blur-sm">
        {video.thumbnailLabel}
      </div>
    </div>
  )
}

export default function VideosPage() {
  const { data, isLoading } = useAsyncResource('videos', getVideosData)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [videoTypeFilter, setVideoTypeFilter] = useState<VideoTypeFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('publishedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(searchInput.trim().toLowerCase())
    }, 200)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  const displayedVideos = useMemo(() => {
    let items = data?.items ?? []

    if (videoTypeFilter === 'videos') items = items.filter((video) => !video.isLive)
    if (videoTypeFilter === 'live') items = items.filter((video) => video.isLive)

    if (searchQuery) {
      items = items.filter((video) =>
        [video.title, video.format, video.theme, video.summary]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery)
      )
    }

    return [...items].sort((left, right) => {
      const modifier = sortDirection === 'asc' ? 1 : -1
      if (sortKey === 'publishedAt') {
        return left.publishedAt.localeCompare(right.publishedAt) * modifier
      }
      return (left[sortKey] - right[sortKey]) * modifier
    })
  }, [data?.items, searchQuery, sortDirection, sortKey, videoTypeFilter])

  const filteredSummary = useMemo(() => buildFilteredSummary(displayedVideos), [displayedVideos])
  const bestVideo = displayedVideos[0] ?? null

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDirection('desc')
  }

  const getSortIcon = (columnKey: SortKey) => {
    if (sortKey !== columnKey) return <ArrowUpDown className="ml-1 inline h-3 w-3 text-muted-foreground" />
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 inline h-3 w-3" />
    )
  }

  const getAriaSort = (columnKey: SortKey): 'ascending' | 'descending' | 'none' =>
    sortKey === columnKey ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'

  const hasActiveFilters = videoTypeFilter !== 'all' || Boolean(searchQuery)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Videos"
        description="Filter, sort, and compare video-level performance."
        contextLabel="Mode"
        contextValue="Diagnose"
      />

      {!isLoading && displayedVideos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
          <MetricCard label="Filtered Videos" value={String(displayedVideos.length)} />
          <MetricCard label="Total Views" value={formatLongNumber(filteredSummary.totalViews)} />
          <MetricCard label="Watch Time (hrs)" value={formatLongNumber(Math.round(filteredSummary.totalWatchHours))} />
          <MetricCard label="Weighted CTR" value={formatPercent(filteredSummary.weightedCtr)} />
          <MetricCard label="Avg AVD" value={formatAvd(filteredSummary.avgAvdSeconds)} />
          <MetricCard label="Avg APV" value={formatPercent(filteredSummary.avgApv)} />
          <MetricCard label="Avg Score" value={filteredSummary.avgScore.toFixed(0)} />
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <CardTitle>Video Library</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Static demo data, real app list mechanics.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search titles, themes, formats..."
                  className="h-9 w-64 pl-9"
                />
              </div>
              <div className="flex items-center rounded-md border text-sm">
                {(['all', 'videos', 'live'] as VideoTypeFilter[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setVideoTypeFilter(type)}
                    aria-pressed={videoTypeFilter === type}
                    className={`px-3 py-2 capitalize ${
                      videoTypeFilter === type ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    {type === 'all' ? 'All' : type === 'videos' ? 'Videos' : 'Live'}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchInput('')
                  setSearchQuery('')
                  setVideoTypeFilter('all')
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {videoTypeFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-sm text-primary">
                  {videoTypeFilter === 'videos' ? 'VOD only' : 'Live only'}
                  <button
                    type="button"
                    onClick={() => setVideoTypeFilter('all')}
                    aria-label={`Remove ${videoTypeFilter === 'videos' ? 'VOD only' : 'Live only'} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-sm text-primary">
                  Search: {searchQuery}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('')
                      setSearchQuery('')
                    }}
                    aria-label="Clear search filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {!isLoading && bestVideo && (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-900">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                Best current signal
              </div>
              <div className="mt-2 text-base font-semibold">{bestVideo.title}</div>
              <p className="mt-1 text-sm text-emerald-800">{bestVideo.summary}</p>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <caption className="sr-only">Video performance table with sortable metrics.</caption>
              <colgroup>
                <col className="w-[150px]" />
                <col className="w-[32%]" />
                <col className="w-[110px]" />
                <col className="w-[90px]" />
                <col className="w-[110px]" />
                <col className="w-[80px]" />
                <col className="w-[80px]" />
                <col className="w-[90px]" />
              </colgroup>
              <thead className="border-b bg-muted/50 text-sm font-medium">
                <tr>
                  <th scope="col" className="p-4 text-left">
                    <span className="sr-only">Thumbnail</span>
                  </th>
                  <th scope="col" className="p-4 text-left">
                    Title
                  </th>
                  <th scope="col" aria-sort={getAriaSort('publishedAt')} className="p-4 text-left">
                    <button type="button" onClick={() => handleSort('publishedAt')} className="text-left">
                      Published{getSortIcon('publishedAt')}
                    </button>
                  </th>
                  <th scope="col" aria-sort={getAriaSort('views')} className="p-4 text-left">
                    <button type="button" onClick={() => handleSort('views')} className="text-left">
                      Views{getSortIcon('views')}
                    </button>
                  </th>
                  <th scope="col" aria-sort={getAriaSort('watchHours')} className="p-4 text-left">
                    <button type="button" onClick={() => handleSort('watchHours')} className="text-left">
                      Watch Time{getSortIcon('watchHours')}
                    </button>
                  </th>
                  <th scope="col" aria-sort={getAriaSort('ctr')} className="p-4 text-left">
                    <button type="button" onClick={() => handleSort('ctr')} className="text-left">
                      CTR{getSortIcon('ctr')}
                    </button>
                  </th>
                  <th scope="col" aria-sort={getAriaSort('avdSeconds')} className="p-4 text-left">
                    <button type="button" onClick={() => handleSort('avdSeconds')} className="text-left">
                      AVD{getSortIcon('avdSeconds')}
                    </button>
                  </th>
                  <th scope="col" aria-sort={getAriaSort('score')} className="p-4 text-left">
                    <button type="button" onClick={() => handleSort('score')} className="text-left">
                      Score{getSortIcon('score')}
                    </button>
                  </th>
                </tr>
              </thead>

              {isLoading ? (
                <tbody>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <tr key={`video-skeleton-${index}`} className="border-b last:border-b-0">
                      <td className="p-4">
                        <Skeleton className="h-[74px] w-[132px] rounded-lg" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-5 w-full" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-14" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-10" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-5 w-14" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : displayedVideos.length > 0 ? (
                <tbody>
                  {displayedVideos.map((video) => (
                    <tr key={video.id} className="border-b last:border-b-0">
                      <td className="p-4 align-middle">
                        <Link to={`/videos/${video.id}`} className="block">
                          <VideoThumbnail video={video} />
                        </Link>
                      </td>
                      <th scope="row" className="min-w-0 p-4 text-left align-middle font-normal">
                        <Link to={`/videos/${video.id}`} className="truncate font-medium text-primary hover:underline">
                          {video.title}
                        </Link>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{video.format}</span>
                          <span>·</span>
                          <span>{video.theme}</span>
                          {video.isLive && (
                            <span className="rounded border border-red-200 bg-red-500/10 px-1.5 py-0.5 font-semibold uppercase text-red-600">
                              Live
                            </span>
                          )}
                        </div>
                      </th>
                      <td className="p-4 align-middle">{formatDate(video.publishedAt)}</td>
                      <td className="p-4 align-middle">{formatLongNumber(video.views)}</td>
                      <td className="p-4 align-middle">{formatCompactNumber(Math.round(video.watchHours))}</td>
                      <td className="p-4 align-middle">{formatPercent(video.ctr)}</td>
                      <td className="p-4 align-middle">{formatAvd(video.avdSeconds)}</td>
                      <td className="p-4 align-middle">
                        <span className={`rounded border px-2 py-0.5 text-xs font-medium ${tierColors[video.tier]}`}>
                          {video.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No videos match the current filters.
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
