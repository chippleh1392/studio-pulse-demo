import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, RefreshCw, Tags, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAsyncResource } from '@/hooks/use-async-resource'
import { getMetadataData } from '@/lib/demo-client/client'

function scoreClass(score: number): string {
  if (score >= 85) return 'text-emerald-600'
  if (score >= 65) return 'text-amber-600'
  return 'text-red-600'
}

function severityClass(severity: 'warning' | 'critical'): string {
  return severity === 'critical'
    ? 'bg-red-500/10 text-red-700 border-red-200'
    : 'bg-amber-500/10 text-amber-700 border-amber-200'
}

export default function MetadataPage() {
  const { data, isLoading, reload } = useAsyncResource('metadata', getMetadataData)
  const [issuesOnly, setIssuesOnly] = useState(true)

  const visibleVideos = useMemo(() => {
    if (!data?.videos) return []
    if (!issuesOnly) return data.videos
    return data.videos.filter((video) => video.issueCount > 0)
  }, [data?.videos, issuesOnly])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Metadata QA"
        description="Audit title, description, tags, creative fields, and niche alignment."
        contextLabel="Niche"
        contextValue={data?.channel.nicheSummary || 'Synthetic demo niche'}
        actions={
          <Button variant="outline" size="sm" onClick={reload} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-28 w-full" />)
        ) : (
          <>
            <SummaryCard
              label="Metadata Score"
              value={data ? data.summary.avgMetadataScore.toFixed(1) : '--'}
              valueClass={scoreClass(data?.summary.avgMetadataScore ?? 0)}
              sublabel="Channel average"
            />
            <SummaryCard
              label="Niche Alignment"
              value={data ? data.summary.avgNicheAlignmentScore.toFixed(1) : '--'}
              valueClass={scoreClass(data?.summary.avgNicheAlignmentScore ?? 0)}
              sublabel="Video metadata average"
            />
            <SummaryCard
              label="Videos With Issues"
              value={String(data?.summary.videosWithIssues ?? 0)}
              sublabel={`${(data?.summary.issueRatePct ?? 0).toFixed(1)}% of audited videos`}
            />
            <SummaryCard
              label="Critical Issues"
              value={String(data?.summary.videosWithCriticalIssues ?? 0)}
              valueClass={(data?.summary.videosWithCriticalIssues ?? 0) > 0 ? 'text-red-600' : 'text-emerald-600'}
              sublabel={`${(data?.summary.criticalIssueRatePct ?? 0).toFixed(1)}% critical issue rate`}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Niche Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <p className="text-muted-foreground">{data?.channel.nicheSummary}</p>
                <KeywordGroup title="Configured target keywords" keywords={data?.channel.targetKeywords ?? []} tone="green" />
                {(data?.channel.avoidKeywords.length ?? 0) > 0 && (
                  <KeywordGroup title="Avoid keywords" keywords={data?.channel.avoidKeywords ?? []} tone="red" />
                )}
                {(data?.channel.observedKeywords.length ?? 0) > 0 && (
                  <KeywordGroup title="Observed metadata keywords" keywords={(data?.channel.observedKeywords ?? []).slice(0, 18)} tone="slate" />
                )}
                <div className="text-xs text-muted-foreground">
                  Channel keyword alignment:{' '}
                  <span className="font-medium">{(data?.channel.channelAlignmentScore ?? 0).toFixed(1)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Top Metadata Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : data?.issues.length ? (
              <div className="space-y-2">
                {data.issues.map((issue) => (
                  <div key={issue.code} className="flex items-start justify-between gap-3 rounded-md border p-2 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium">{issue.label}</div>
                      <div className="font-mono text-xs text-muted-foreground">{issue.code}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded border px-2 py-0.5 text-xs ${severityClass(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <span className="text-sm font-semibold">{issue.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                No issues detected.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              Video Metadata Audit
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIssuesOnly((prev) => !prev)}>
              {issuesOnly ? 'Show all videos' : 'Only videos with issues'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="h-14 w-full" />
              ))}
            </div>
          ) : !visibleVideos.length ? (
            <div className="text-sm text-muted-foreground">No videos matched this filter.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <div className="min-w-[980px] divide-y">
                <div className="grid grid-cols-[1.7fr_120px_120px_90px_120px_1fr] gap-3 bg-muted/50 p-3 text-xs uppercase tracking-wide text-muted-foreground">
                  <div>Video</div>
                  <div>Meta Score</div>
                  <div>Alignment</div>
                  <div>Tags</div>
                  <div>Creative</div>
                  <div>Issues</div>
                </div>
                {visibleVideos.map((video) => (
                  <div key={video.videoId} className="grid grid-cols-[1.7fr_120px_120px_90px_120px_1fr] gap-3 items-start p-3 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium">{video.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {video.publishedAt} · {video.views.toLocaleString()} views
                      </div>
                    </div>
                    <div className={`font-semibold ${scoreClass(video.metadataScore)}`}>{video.metadataScore.toFixed(1)}</div>
                    <div className={`font-semibold ${scoreClass(video.nicheAlignmentScore)}`}>{video.nicheAlignmentScore.toFixed(1)}</div>
                    <div>{video.tagCount}</div>
                    <div className="text-xs text-muted-foreground">
                      {video.theme ? 'theme' : 'no theme'} / {video.thumbnailText ? 'thumb text' : 'no thumb text'}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {video.issues.length ? (
                        video.issues.map((issue) => (
                          <span key={`${video.videoId}-${issue.code}`} className={`rounded border px-2 py-0.5 text-[11px] ${severityClass(issue.severity)}`}>
                            {issue.code}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-700">clean</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  sublabel,
  valueClass = '',
}: {
  label: string
  value: string
  sublabel: string
  valueClass?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueClass}`}>{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
      </CardContent>
    </Card>
  )
}

function KeywordGroup({
  title,
  keywords,
  tone,
}: {
  title: string
  keywords: string[]
  tone: 'green' | 'red' | 'slate'
}) {
  const toneClass =
    tone === 'green'
      ? 'bg-emerald-500/5 border-emerald-200 text-emerald-700'
      : tone === 'red'
        ? 'bg-red-500/5 border-red-200 text-red-700'
        : 'bg-slate-500/5 border-slate-300 text-slate-700'

  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span key={`${title}-${keyword}`} className={`rounded-full border px-2 py-0.5 text-xs ${toneClass}`}>
            {keyword}
          </span>
        ))}
      </div>
    </div>
  )
}
