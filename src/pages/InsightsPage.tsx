import { useAsyncResource } from '@/hooks/use-async-resource'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Globe2, Sparkles, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/layout/PageHeader'
import { getInsightsData } from '@/lib/demo-client/client'
import { useGlobalTimeframe } from '@/lib/timeframe/globalTimeframe'

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function DiversityBadge({ index }: { index?: number }) {
  if (index == null) return null
  let color = 'bg-red-100 text-red-800'
  let label = 'Concentrated'

  if (index >= 70) {
    color = 'bg-green-100 text-green-800'
    label = 'Highly Diverse'
  } else if (index >= 40) {
    color = 'bg-yellow-100 text-yellow-800'
    label = 'Moderate'
  }

  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>{label}</span>
}

function ProgressBar({ value, color = 'bg-blue-500' }: { value: number; color?: string }) {
  const percentage = Math.min(value, 100)
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }} />
    </div>
  )
}

export default function InsightsPage() {
  const { buildPathWithTimeframe, timeframeLabel } = useGlobalTimeframe()
  const { data, isLoading } = useAsyncResource('insights', getInsightsData)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Channel Insights"
        description="Cross-video patterns for traffic diversity, subscriber behavior, timing, and title quality."
        contextLabel="Timeframe"
        contextValue={timeframeLabel}
      />

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-cyan-200/70 bg-[linear-gradient(135deg,rgba(231,249,255,0.98)_0%,rgba(239,245,255,0.96)_52%,rgba(247,241,255,0.95)_100%)]">
          <CardHeader className="pb-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/70 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-950/80">
              Cross-Video Read
            </div>
            <CardTitle className="text-2xl tracking-tight text-slate-900">
              Use this page when the question is bigger than one upload.
            </CardTitle>
            <CardDescription className="max-w-2xl text-slate-700">
              This surface is for pattern recognition: where traffic comes from, who retains better, when viewers
              show up, and what title structures are showing up repeatedly.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <InsightFocus icon={Globe2} title="Reach" detail="Traffic mix, geography, and device distribution." />
            <InsightFocus icon={TrendingUp} title="Behavior" detail="Subscriber advantage and timing patterns." />
            <InsightFocus icon={Sparkles} title="Packaging" detail="Title systems and recurring keyword structure." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Best Next Moves</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InsightJump
              to={buildPathWithTimeframe('/growth')}
              title="Momentum question"
              detail="Open Growth if the issue is timing, week-over-week change, or anomaly follow-up."
            />
            <InsightJump
              to={buildPathWithTimeframe('/creative')}
              title="Packaging question"
              detail="Open Creative if the pattern points to thumbnails, hooks, or title systems."
            />
            <InsightJump
              to={buildPathWithTimeframe('/videos')}
              title="Specific video question"
              detail="Open Videos if you already know the candidate and need concrete package-level context."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Decision Handoff</CardTitle>
          <CardDescription>Use this page for fast triage, then jump to the best page for execution.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link to={buildPathWithTimeframe('/growth')} className="rounded-lg border p-3 text-sm hover:bg-muted/40">
            <div className="font-medium">Growth</div>
            <div className="mt-1 text-xs text-muted-foreground">Weekly momentum and anomaly follow-up.</div>
          </Link>
          <Link to={buildPathWithTimeframe('/creative')} className="rounded-lg border p-3 text-sm hover:bg-muted/40">
            <div className="font-medium">Creative</div>
            <div className="mt-1 text-xs text-muted-foreground">Theme and thumbnail pattern deep dive.</div>
          </Link>
          <Link to={buildPathWithTimeframe('/breakout')} className="rounded-lg border p-3 text-sm hover:bg-muted/40">
            <div className="font-medium">Breakout</div>
            <div className="mt-1 text-xs text-muted-foreground">Candidate scoring for high-upside videos.</div>
          </Link>
          <Link to={buildPathWithTimeframe('/videos')} className="rounded-lg border p-3 text-sm hover:bg-muted/40">
            <div className="font-medium">Videos</div>
            <div className="mt-1 text-xs text-muted-foreground">Video-level diagnosis and package context.</div>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} className="h-28 w-full" />)
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Traffic Diversity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{data?.summary.trafficDiversityIndex ?? '--'}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                  <DiversityBadge index={data?.summary.trafficDiversityIndex} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{data?.summary.trafficSourceCount ?? '--'} traffic sources</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Subscriber Retention Advantage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${(data?.summary.subscriberRetentionAdvantage ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(data?.summary.subscriberRetentionAdvantage ?? 0) > 0 ? '+' : ''}
                  {data?.summary.subscriberRetentionAdvantage ?? '--'}%
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{data?.subscriberComparison.summary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Geographic Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.summary.geographicCountryCount ?? '--'}</div>
                <p className="mt-2 text-xs text-muted-foreground">Top country: {data?.summary.topCountryPercentage ?? '--'}% of views</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where channel views are coming from.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="h-8 w-full" />)}</div>
            ) : (
              <div className="space-y-3">
                {(data?.trafficSources ?? []).map((source) => (
                  <div key={source.sourceName} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{source.sourceName}</span>
                      <span className="text-muted-foreground">{formatNumber(source.totalViews)} ({source.percentage.toFixed(1)}%)</span>
                    </div>
                    <ProgressBar value={source.percentage} color={source.color} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>What devices viewers use most often.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-8 w-full" />)}</div>
            ) : (
              <div className="space-y-3">
                {(data?.devices ?? []).map((device) => (
                  <div key={device.deviceName} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{device.deviceName}</span>
                      <span className="text-muted-foreground">{formatNumber(device.totalViews)} ({device.percentage.toFixed(1)}%)</span>
                    </div>
                    <ProgressBar value={device.percentage} color={device.color} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscriber Performance</CardTitle>
            <CardDescription>How subscribers compare to non-subscribers.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="mb-1 text-xs text-muted-foreground">Subscribers</p>
                    <p className="font-semibold">{formatNumber(data?.subscriberComparison.subscriberViews ?? 0)} views</p>
                    <p className="text-sm text-muted-foreground">Avg: {formatDuration(data?.subscriberComparison.subscriberAvgViewDurationSeconds ?? 0)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="mb-1 text-xs text-muted-foreground">Non-Subscribers</p>
                    <p className="font-semibold">{formatNumber(data?.subscriberComparison.nonSubscriberViews ?? 0)} views</p>
                    <p className="text-sm text-muted-foreground">Avg: {formatDuration(data?.subscriberComparison.nonSubscriberAvgViewDurationSeconds ?? 0)}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Subscriber share: </span>
                  <span className="font-medium">{data?.subscriberComparison.subscriberViewPercentage.toFixed(1)}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Geographic distribution of viewers.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} className="h-8 w-full" />)}</div>
            ) : (
              <div className="space-y-3">
                {(data?.countries ?? []).map((country) => (
                  <div key={country.countryName} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{country.countryName}</span>
                      <span className="text-muted-foreground">{formatNumber(country.totalViews)} ({country.percentage.toFixed(1)}%)</span>
                    </div>
                    <ProgressBar value={country.percentage} color="bg-emerald-500" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audience Timing</CardTitle>
          <CardDescription>Views by day of week.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 7 }).map((_, idx) => <Skeleton key={idx} className="h-8 w-full" />)}</div>
          ) : (
            <div className="space-y-3">
              {(data?.dayOfWeek ?? []).map((day) => (
                <div key={day.day} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{day.day}</span>
                    <span className="text-muted-foreground">{formatNumber(day.views)} ({day.percentage.toFixed(1)}%)</span>
                  </div>
                  <ProgressBar value={day.percentage} color="bg-slate-500" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Title Analysis</CardTitle>
          <CardDescription>Snapshot of title patterns. Use Creative for deeper package analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, idx) => <Skeleton key={idx} className="h-12 w-full" />)}</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <MiniStat label="Avg Word Count" value={data?.titleAnalysis.avgWordCount.toFixed(1) ?? '--'} />
                <MiniStat label="Use Emojis" value={`${data?.titleAnalysis.emojiPct ?? 0}%`} />
                <MiniStat label="Questions" value={`${data?.titleAnalysis.questionPct ?? 0}%`} />
                <MiniStat label="Use Numbers" value={`${data?.titleAnalysis.numbersPct ?? 0}%`} />
              </div>

              <div>
                <h4 className="mb-3 text-sm font-medium">Top Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {(data?.titleAnalysis.topKeywords ?? []).map((item) => (
                    <span key={item.keyword} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                      {item.keyword} ({item.count})
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-medium">Title Structure Types</h4>
                <div className="space-y-2">
                  {(data?.titleAnalysis.structureTypes ?? []).map((item) => (
                    <div key={item.structure} className="flex items-center gap-3">
                      <span className="w-32 text-sm capitalize">{item.structure.replace('_', ' ')}</span>
                      <ProgressBar value={item.percentage} color="bg-purple-500" />
                      <span className="w-20 text-sm text-muted-foreground">{item.count} ({item.percentage.toFixed(0)}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-medium">Sample Titles</h4>
                <div className="space-y-2">
                  {(data?.titleAnalysis.sampleTitles ?? []).map((title) => (
                    <div key={title.videoId} className="rounded-lg border p-3 text-sm">
                      <p className="font-medium">{title.title}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{title.lengthWords} words</span>
                        {title.hasEmoji && <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs">emoji</span>}
                        {title.hasQuestionMark && <span className="rounded bg-blue-100 px-2 py-0.5 text-xs">question</span>}
                        {title.hasNumbers && <span className="rounded bg-green-100 px-2 py-0.5 text-xs">number</span>}
                        <span className="rounded bg-purple-100 px-2 py-0.5 text-xs capitalize">{title.structureType.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  )
}

function InsightFocus({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof Compass
  title: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-4 text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p>
    </div>
  )
}

function InsightJump({ to, title, detail }: { to: string; title: string; detail: string }) {
  return (
    <Link
      to={to}
      className="group block rounded-2xl border border-border/70 bg-background/75 p-4 text-sm transition hover:-translate-y-0.5 hover:bg-muted/35"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-foreground">{title}</p>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <p className="mt-2 text-muted-foreground">{detail}</p>
    </Link>
  )
}
