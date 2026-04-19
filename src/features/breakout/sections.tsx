import { Link } from 'react-router-dom'
import { Eye, Flame, MousePointer, Rocket, Target, TrendingUp, Users, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { BreakoutCandidate, BreakoutData, ResurgenceCandidate } from '@/lib/demo-client/types'
import { getScoreColor, getSignalColor } from '@/features/breakout/utils'

export function BreakoutActionQueue({
  data,
  topBreakout,
  topResurgence,
  buildPathWithTimeframe,
}: {
  data: BreakoutData
  topBreakout?: BreakoutCandidate
  topResurgence?: ResurgenceCandidate
  buildPathWithTimeframe: (path: string) => string
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Action Queue</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm md:grid-cols-3">
        <QueueCard
          label="Breakout candidates"
          value={String(data.candidates.length)}
          linkText={topBreakout ? `Top: ${topBreakout.title}` : undefined}
          linkHref={topBreakout ? buildPathWithTimeframe(`/videos/${topBreakout.videoId}`) : undefined}
        />
        <QueueCard
          label="Resurgence candidates"
          value={String(data.resurgences.length)}
          linkText={topResurgence ? `Top: ${topResurgence.title}` : undefined}
          linkHref={topResurgence ? buildPathWithTimeframe(`/videos/${topResurgence.videoId}`) : undefined}
        />
        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted-foreground">Recommended next step</div>
          <div className="mt-1 text-sm font-medium">
            Review top candidates, then validate their context in Growth and Metadata.
          </div>
          <Link to={buildPathWithTimeframe('/growth')} className="mt-1 inline-block text-xs text-primary hover:underline">
            Open Growth
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export function BreakoutMethodCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">How It Works</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 text-sm md:grid-cols-5">
          <MethodItem icon={<MousePointer className="h-4 w-4 text-blue-500" />} title="CTR (25%)" detail="Strong thumbnail/title gets clicks" />
          <MethodItem icon={<Eye className="h-4 w-4 text-emerald-500" />} title="Retention (30%)" detail="High AVP supports recommendation expansion" />
          <MethodItem icon={<TrendingUp className="h-4 w-4 text-violet-500" />} title="Velocity (20%)" detail="Fast early growth vs the channel baseline" />
          <MethodItem icon={<Zap className="h-4 w-4 text-amber-500" />} title="Algorithm (15%)" detail="Browse and suggested traction" />
          <MethodItem icon={<Users className="h-4 w-4 text-rose-500" />} title="Engagement (10%)" detail="Likes, comments, and shares" />
        </div>
      </CardContent>
    </Card>
  )
}

export function BreakoutCandidatesSection({
  isLoading,
  data,
  buildPathWithTimeframe,
}: {
  isLoading: boolean
  data: BreakoutData | null
  buildPathWithTimeframe: (path: string) => string
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Breakout Candidates</h2>
        {data && <span className="text-xs text-muted-foreground">Last {data.thresholds.breakoutMaxAgeDays} days</span>}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <BreakoutSkeleton key={`breakout-skeleton-${idx}`} />
          ))}
        </div>
      ) : data?.candidates.length ? (
        <div className="space-y-4">
          {data.candidates.map((candidate, index) => (
            <BreakoutCard
              key={candidate.videoId}
              candidate={candidate}
              rank={index + 1}
              inspectHref={buildPathWithTimeframe(`/videos/${candidate.videoId}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyCard icon={<Rocket className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />} title="No breakout candidates found" description="Strong-signal recent uploads will surface here." />
      )}
    </div>
  )
}

export function BreakoutResurgencesSection({
  isLoading,
  data,
  buildPathWithTimeframe,
}: {
  isLoading: boolean
  data: BreakoutData | null
  buildPathWithTimeframe: (path: string) => string
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Resurgent Back Catalog</h2>
        {data && <span className="text-xs text-muted-foreground">{data.thresholds.resurgenceMinAgeDays}+ days old</span>}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <BreakoutSkeleton key={`resurgence-skeleton-${idx}`} />
          ))}
        </div>
      ) : data?.resurgences.length ? (
        <div className="space-y-4">
          {data.resurgences.map((candidate, index) => (
            <ResurgenceCard
              key={candidate.videoId}
              candidate={candidate}
              rank={index + 1}
              recentWindowDays={data.thresholds.resurgenceRecentDays}
              baselineWindowDays={data.thresholds.resurgenceBaselineDays}
              inspectHref={buildPathWithTimeframe(`/videos/${candidate.videoId}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyCard icon={<Flame className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />} title="No resurgence candidates found" description="Older catalog spikes will appear here." />
      )}
    </div>
  )
}

export function BreakoutThresholdsCard({ data }: { data: BreakoutData }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          <span>Breakout range: {data.thresholds.minViews.toLocaleString()} - {data.thresholds.maxViews.toLocaleString()} views</span>
          <span>Breakout threshold: {data.thresholds.breakoutThreshold.toLocaleString()} views</span>
          <span>Resurgence window: last {data.thresholds.resurgenceRecentDays}d vs prior {data.thresholds.resurgenceBaselineDays}d</span>
          <span>Resurgence minimum: {data.thresholds.resurgenceMinRecentViews.toLocaleString()} views &amp; {data.thresholds.resurgenceMinSurgeFactor}x surge</span>
        </div>
      </CardContent>
    </Card>
  )
}

function getSignalIcon(signal?: string) {
  switch (signal) {
    case 'Strong CTR':
      return <MousePointer className="h-4 w-4" />
    case 'High Retention':
      return <Eye className="h-4 w-4" />
    case 'Fast Growth':
      return <TrendingUp className="h-4 w-4" />
    case 'Algorithm Boost':
      return <Zap className="h-4 w-4" />
    case 'High Engagement':
      return <Users className="h-4 w-4" />
    default:
      return <Target className="h-4 w-4" />
  }
}

function SignalBar({ label, value, icon }: { label: string; value?: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{value?.toFixed(0) ?? '--'}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full transition-all ${getSignalColor(value)}`} style={{ width: `${Math.min(100, value ?? 0)}%` }} />
        </div>
      </div>
    </div>
  )
}

function ThumbLabel({ text }: { text: string }) {
  return (
    <div className="flex h-[90px] w-40 items-end rounded-l-lg bg-[linear-gradient(160deg,#d6e7f4_0%,#bfcee7_48%,#b8a9d8_100%)] p-3">
      <span className="rounded bg-white/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700">
        {text}
      </span>
    </div>
  )
}

function BreakoutCard({
  candidate,
  rank,
  inspectHref,
}: {
  candidate: BreakoutCandidate
  rank: number
  inspectHref: string
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <Link to={inspectHref} className="shrink-0">
          <ThumbLabel text={candidate.title.split(':')[0] || 'Breakout'} />
        </Link>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-600">
                  {rank}
                </span>
                <span className={`rounded px-2 py-0.5 text-xs font-medium border ${getScoreColor(candidate.breakoutScore)}`}>
                  {candidate.breakoutScore.toFixed(0)} potential
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getSignalIcon(candidate.topSignal)}
                  {candidate.topSignal}
                </span>
              </div>
              <Link to={inspectHref} className="line-clamp-1 text-sm font-medium text-primary hover:underline">
                {candidate.title}
              </Link>
              <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{candidate.views.toLocaleString()} views</span>
                <span>{candidate.daysSincePublish} days old</span>
                <span>{candidate.viewsPerDay.toLocaleString()}/day</span>
                {candidate.ctr && <span>CTR: {candidate.ctr.toFixed(1)}%</span>}
                {candidate.avp && <span>AVP: {candidate.avp.toFixed(1)}%</span>}
              </div>
              <p className="mt-2 text-xs font-medium text-emerald-600">{candidate.reasoning}</p>
            </div>
            <Link to={inspectHref} className="shrink-0 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted">
              Inspect
            </Link>
          </div>
        </div>
        <div className="w-48 space-y-2 border-l bg-muted/30 p-4">
          <SignalBar label="CTR" value={candidate.signals.ctrSignal} icon={<MousePointer className="h-3 w-3" />} />
          <SignalBar label="Retention" value={candidate.signals.avpSignal} icon={<Eye className="h-3 w-3" />} />
          <SignalBar label="Velocity" value={candidate.signals.velocitySignal} icon={<TrendingUp className="h-3 w-3" />} />
          <SignalBar label="Algorithm" value={candidate.signals.suggestedTrafficSignal} icon={<Zap className="h-3 w-3" />} />
          <SignalBar label="Engagement" value={candidate.signals.engagementSignal} icon={<Users className="h-3 w-3" />} />
        </div>
      </div>
    </Card>
  )
}

function ResurgenceCard({
  candidate,
  rank,
  recentWindowDays,
  baselineWindowDays,
  inspectHref,
}: {
  candidate: ResurgenceCandidate
  rank: number
  recentWindowDays: number
  baselineWindowDays: number
  inspectHref: string
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <Link to={inspectHref} className="shrink-0">
          <ThumbLabel text={candidate.title.split(':')[0] || 'Catalog'} />
        </Link>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-600">
                  {rank}
                </span>
                <span className={`rounded px-2 py-0.5 text-xs font-medium border ${getScoreColor(candidate.surgeScore)}`}>
                  {candidate.surgeScore.toFixed(0)} surge
                </span>
                <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                  {candidate.surgeFactor.toFixed(1)}x surge
                </span>
              </div>
              <Link to={inspectHref} className="line-clamp-1 text-sm font-medium text-primary hover:underline">
                {candidate.title}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>{candidate.views.toLocaleString()} total views</span>
                <span>{candidate.daysSincePublish} days old</span>
                <span>{candidate.recentViews.toLocaleString()} in last {recentWindowDays}d</span>
                <span>{candidate.recentViewsPerDay.toFixed(1)}/day now</span>
                <span>{candidate.priorViewsPerDay.toFixed(1)}/day prior</span>
              </div>
              <p className="mt-2 text-xs font-medium text-amber-600">{candidate.reasoning}</p>
            </div>
            <Link to={inspectHref} className="shrink-0 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted">
              Inspect
            </Link>
          </div>
        </div>
        <div className="w-48 border-l bg-muted/30 p-4">
          <div>
            <div className="text-xs text-muted-foreground">Recent {recentWindowDays}d</div>
            <div className="text-sm font-semibold">{candidate.recentViews.toLocaleString()}</div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-muted-foreground">Prior {baselineWindowDays}d</div>
            <div className="text-sm font-medium">{candidate.priorViews.toLocaleString()}</div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-muted-foreground">Surge factor</div>
            <div className="text-sm font-medium">{candidate.surgeFactor.toFixed(1)}x</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function BreakoutSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <Skeleton className="h-[90px] w-40" />
        <div className="flex-1 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="mb-2 h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="w-48 space-y-3 border-l bg-muted/30 p-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={`signal-skeleton-${idx}`} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </Card>
  )
}

function MethodItem({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{detail}</div>
      </div>
    </div>
  )
}

function QueueCard({
  label,
  value,
  linkText,
  linkHref,
}: {
  label: string
  value: string
  linkText?: string
  linkHref?: string
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {linkText && linkHref && (
        <Link to={linkHref} className="text-xs text-primary hover:underline">
          {linkText}
        </Link>
      )}
    </div>
  )
}

function EmptyCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        {icon}
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
