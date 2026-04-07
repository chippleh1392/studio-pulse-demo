import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { getVideosData } from '@/lib/demo-client/client'
import type { DemoVideo } from '@/lib/demo-client/types'

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatAvd(seconds: number): string {
  const totalSeconds = Math.max(0, Math.round(seconds))
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatLongNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export default function VideoDetailPage() {
  const { videoId } = useParams()
  const [video, setVideo] = useState<DemoVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    getVideosData()
      .then((result) => {
        if (cancelled) return
        setVideo(result.items.find((item) => item.id === videoId) ?? null)
        setIsLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setVideo(null)
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [videoId])

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="outline" size="sm">
          <Link to="/videos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Videos
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : video ? (
        <>
          <PageHeader
            title={video.title}
            description={video.summary}
            contextLabel="Published"
            contextValue={formatDate(video.publishedAt)}
          />

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardContent className="p-6">
                <div className="flex h-[300px] items-end rounded-2xl border border-slate-200 bg-[linear-gradient(160deg,#d6e7f4_0%,#bfcee7_48%,#b8a9d8_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                  <div className="max-w-sm rounded-2xl bg-white/75 p-4 backdrop-blur-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                      {video.thumbnailLabel}
                    </div>
                    <div className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                      {video.theme}
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      Synthetic poster surface preserving the real product layout without using real channel thumbnails.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                  <MetricCell label="Views" value={formatLongNumber(video.views)} />
                  <MetricCell label="Watch Hours" value={formatLongNumber(Math.round(video.watchHours))} />
                  <MetricCell label="CTR" value={`${video.ctr.toFixed(1)}%`} />
                  <MetricCell label="Avg View Duration" value={formatAvd(video.avdSeconds)} />
                  <MetricCell label="Avg Percent Viewed" value={`${video.avp.toFixed(1)}%`} />
                  <MetricCell label="Score" value={`${video.score} · ${video.tier}`} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Packaging Read</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="rounded-xl border border-border/60 bg-background/75 p-3">
                    <span className="font-medium text-foreground">Format:</span> {video.format}
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/75 p-3">
                    <span className="font-medium text-foreground">Theme:</span> {video.theme}
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/75 p-3">
                    <span className="font-medium text-foreground">Why it matters:</span> {video.summary}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Video not found in the synthetic demo dataset.
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/80 p-3">
      <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-base font-semibold tracking-tight">{value}</div>
    </div>
  )
}
