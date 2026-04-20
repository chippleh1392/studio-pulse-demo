import { Link } from 'react-router-dom'
import type { EChartsOption } from 'echarts'
import { ArrowRight, Download, Layers3, Sparkles, SwatchBook, Video } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ReactEChartsCore, echarts } from '@/lib/echarts/core'
import type { CreativeCombo, CreativeGroup, CreativeVideo } from '@/lib/demo-client/types'
import type { GroupKind } from '@/features/creative/utils'
import { formatDuration, formatNumber } from '@/features/creative/utils'

export function CreativeSummaryGrid({
  isLoading,
  summary,
}: {
  isLoading: boolean
  summary?: {
    avgViews: number
    avgCtr: number
    avgAvdSeconds: number
    totalVideos: number
  }
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-28 w-full" />)
      ) : (
        <>
          <SummaryCard label="Avg Views" value={formatNumber(summary?.avgViews ?? 0)} />
          <SummaryCard label="Avg CTR" value={`${(summary?.avgCtr ?? 0).toFixed(2)}%`} />
          <SummaryCard label="Avg AVD" value={formatDuration(summary?.avgAvdSeconds)} />
          <SummaryCard label="Videos" value={String(summary?.totalVideos ?? 0)} />
        </>
      )}
    </div>
  )
}

export function CreativeDecisionHandoff({
  buildPathWithTimeframe,
}: {
  buildPathWithTimeframe: (path: string) => string
}) {
  return (
    <Card className="border-pink-200/70 bg-[linear-gradient(135deg,rgba(255,240,246,0.96)_0%,rgba(255,247,239,0.96)_100%)]">
      <CardHeader className="pb-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-pink-300/70 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-pink-950/80">
          Creative Workflow
        </div>
        <CardTitle className="text-2xl tracking-tight text-slate-900">
          Turn packaging patterns into the next concrete action.
        </CardTitle>
        <CardDescription className="max-w-3xl text-slate-700">
          This page is for creative system reads, not just one-off wins. Use the scans below to spot repeatable
          themes, thumbnails, and pairings, then jump to the route that can validate or operationalize the idea.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
        <CreativeJumpCard
          to={buildPathWithTimeframe('/videos')}
          icon={Video}
          title="Inspect Videos"
          detail="Inspect individual packages and detailed performance context."
        />
        <CreativeJumpCard
          to={buildPathWithTimeframe('/breakout')}
          icon={Sparkles}
          title="Route To Breakout"
          detail="Send strong creative systems into high-upside candidate review."
        />
        <CreativeJumpCard
          to={buildPathWithTimeframe('/metadata')}
          icon={SwatchBook}
          title="Check Metadata"
          detail="Validate whether winning packages are also tagged and framed clearly."
        />
        <CreativeJumpCard
          to={buildPathWithTimeframe('/growth')}
          icon={Layers3}
          title="Validate In Growth"
          detail="See whether creative shifts actually changed weekly momentum."
        />
      </CardContent>
    </Card>
  )
}

export function CreativeScatterGrid({
  isLoading,
  themeScatterOptions,
  thumbnailScatterOptions,
}: {
  isLoading: boolean
  themeScatterOptions: EChartsOption
  thumbnailScatterOptions: EChartsOption
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ScatterCard
        title="Theme Scatter"
        description="CTR vs AVD for major theme clusters"
        isLoading={isLoading}
        option={themeScatterOptions}
      />
      <ScatterCard
        title="Thumbnail Scatter"
        description="CTR vs AVD for the current thumbnail text system"
        isLoading={isLoading}
        option={thumbnailScatterOptions}
      />
    </div>
  )
}

export function CreativeGroupTables({
  isLoading,
  themeSearch,
  onThemeSearchChange,
  thumbSearch,
  onThumbSearchChange,
  filteredThemes,
  filteredThumbnails,
  onOpenGroup,
}: {
  isLoading: boolean
  themeSearch: string
  onThemeSearchChange: (value: string) => void
  thumbSearch: string
  onThumbSearchChange: (value: string) => void
  filteredThemes: CreativeGroup[]
  filteredThumbnails: CreativeGroup[]
  onOpenGroup: (group: { type: GroupKind; key: string }) => void
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <CreativeGroupCard
        title="Themes"
        description="Theme-level packaging performance"
        searchValue={themeSearch}
        searchPlaceholder="Search themes"
        onSearchChange={onThemeSearchChange}
        isLoading={isLoading}
        items={filteredThemes}
        onOpen={(key) => onOpenGroup({ type: 'theme', key })}
        rowPrefix="theme"
      />
      <CreativeGroupCard
        title="Thumbnail Text"
        description="Thumbnail message performance"
        searchValue={thumbSearch}
        searchPlaceholder="Search thumbnail text"
        onSearchChange={onThumbSearchChange}
        isLoading={isLoading}
        items={filteredThumbnails}
        onOpen={(key) => onOpenGroup({ type: 'thumbnail', key })}
        rowPrefix="thumb"
      />
    </div>
  )
}

export function CreativeCombosSection({
  isLoading,
  combos,
}: {
  isLoading: boolean
  combos: CreativeCombo[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Theme / Thumbnail Combos</CardTitle>
        <CardDescription>Fast scan of the strongest paired packaging systems</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-24 w-full" />)
        ) : (
          combos.map((combo) => <ComboCard key={`${combo.theme}-${combo.thumbnailText}`} combo={combo} />)
        )}
      </CardContent>
    </Card>
  )
}

export function CreativeVideosSection({
  isLoading,
  videoSearch,
  onVideoSearchChange,
  filteredVideos,
  onExportCsv,
  buildPathWithTimeframe,
}: {
  isLoading: boolean
  videoSearch: string
  onVideoSearchChange: (value: string) => void
  filteredVideos: CreativeVideo[]
  onExportCsv: () => void
  buildPathWithTimeframe: (path: string) => string
}) {
  return (
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
              onChange={(event) => onVideoSearchChange(event.target.value)}
              placeholder="Search title, id, theme, thumbnail"
              className="h-8 w-72"
              aria-label="Search creative videos"
              type="search"
            />
            <Button variant="outline" className="h-8" onClick={onExportCsv}>
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
                    <th scope="col" className="px-3 py-2 text-left">Video</th>
                    <th scope="col" className="px-3 py-2 text-left">Theme</th>
                    <th scope="col" className="px-3 py-2 text-left">Thumbnail</th>
                    <th scope="col" className="px-3 py-2 text-right">Views</th>
                    <th scope="col" className="px-3 py-2 text-right">Impressions</th>
                    <th scope="col" className="px-3 py-2 text-right">CTR</th>
                    <th scope="col" className="px-3 py-2 text-right">AVD</th>
                    <th scope="col" className="px-3 py-2 text-right">AVP</th>
                    <th scope="col" className="px-3 py-2 text-right">Engagement</th>
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
  )
}

export function CreativeGroupDetailSheet({
  selectedGroup,
  selectedVideos,
  onOpenChange,
  buildPathWithTimeframe,
}: {
  selectedGroup: { type: GroupKind; key: string } | null
  selectedVideos: CreativeVideo[]
  onOpenChange: (open: boolean) => void
  buildPathWithTimeframe: (path: string) => string
}) {
  return (
    <Sheet open={!!selectedGroup} onOpenChange={onOpenChange}>
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
                    <th scope="col" className="px-3 py-2 text-left">Video</th>
                    <th scope="col" className="px-3 py-2 text-right">Views</th>
                    <th scope="col" className="px-3 py-2 text-right">CTR</th>
                    <th scope="col" className="px-3 py-2 text-right">AVD</th>
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
  )
}

function ScatterCard({
  title,
  description,
  isLoading,
  option,
}: {
  title: string
  description: string
  isLoading: boolean
  option: EChartsOption
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ReactEChartsCore echarts={echarts} option={option} style={{ height: '100%', width: '100%' }} />
        )}
      </CardContent>
    </Card>
  )
}

function CreativeGroupCard({
  title,
  description,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  isLoading,
  items,
  onOpen,
  rowPrefix,
}: {
  title: string
  description: string
  searchValue: string
  searchPlaceholder: string
  onSearchChange: (value: string) => void
  isLoading: boolean
  items: CreativeGroup[]
  onOpen: (key: string) => void
  rowPrefix: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 w-48"
            aria-label={searchPlaceholder}
            type="search"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="h-12 w-full" />)
        ) : (
          <>
            <div
              aria-hidden="true"
              className="grid grid-cols-[1.2fr_80px_90px_80px_80px] gap-3 px-3 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              <span>Group</span>
              <span className="text-right">Avg Views</span>
              <span className="text-right">Avg CTR</span>
              <span className="text-right">Avg AVD</span>
              <span className="text-right">Score</span>
            </div>
            {items.map((item) => (
              <GroupRow key={`${rowPrefix}-${item.key}`} item={item} onOpen={() => onOpen(item.key)} />
            ))}
          </>
        )}
      </CardContent>
    </Card>
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
  const rowLabel = `${item.key}, ${item.videoCount} videos, avg views ${formatNumber(item.avgViews)}, avg CTR ${item.avgCtr.toFixed(2)}%, avg AVD ${formatDuration(item.avgAvdSeconds)}, score ${item.successScore.toFixed(0)}`
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={rowLabel}
      className="grid w-full grid-cols-[1.2fr_80px_90px_80px_80px] gap-3 rounded-lg border p-3 text-left hover:bg-muted/40 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <div className="min-w-0">
        <div className="truncate font-medium">{item.key}</div>
        <div className="text-xs text-muted-foreground">{item.videoCount} videos</div>
      </div>
      <div className="text-right text-sm tabular-nums text-muted-foreground">{formatNumber(item.avgViews)}</div>
      <div className="text-right text-sm tabular-nums text-muted-foreground">{item.avgCtr.toFixed(2)}%</div>
      <div className="text-right text-sm tabular-nums text-muted-foreground">{formatDuration(item.avgAvdSeconds)}</div>
      <div className="text-right text-sm font-medium tabular-nums">{item.successScore.toFixed(0)}</div>
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

function CreativeJumpCard({
  to,
  icon: Icon,
  title,
  detail,
}: {
  to: string
  icon: typeof Video
  title: string
  detail: string
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-white/70 bg-white/78 p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Icon className="h-4 w-4" />
        </span>
        <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
      </div>
      <p className="mt-4 font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p>
    </Link>
  )
}
