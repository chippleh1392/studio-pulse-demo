import { ArrowRight, BookOpen, Lock, Sparkles, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { useGlobalTimeframe } from '@/lib/timeframe/globalTimeframe'

export default function AboutPage() {
  const { buildPathWithTimeframe } = useGlobalTimeframe()

  return (
    <div className="space-y-6">
      <PageHeader
        title="About"
        description="What this demo is, why it exists, and how to tour it quickly as an external viewer."
        contextLabel="Dataset"
        contextValue="Synthetic and sanitized"
      />

      <Card className="border-amber-200/70 bg-[linear-gradient(135deg,rgba(255,250,235,0.96)_0%,rgba(255,255,255,0.98)_100%)]">
        <CardHeader className="pb-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/70 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-900/80">
            External Viewer Primer
          </div>
          <CardTitle className="text-2xl tracking-tight">This repo is a product demo, not a screenshot dump.</CardTitle>
          <CardDescription className="max-w-3xl">
            It preserves the information architecture and decision flow of a larger analytics app while removing
            everything private: real channels, exports, auth, operations, and proprietary workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <PrimerStat icon={Workflow} label="Built to show" value="Product structure" />
          <PrimerStat icon={Sparkles} label="Best for" value="Interactive walkthroughs" />
          <PrimerStat icon={Lock} label="Safety model" value="Synthetic by default" />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Purpose</CardTitle>
            <CardDescription>This repo is the public demo counterpart to a larger private analytics product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>The public version is intentionally read-only and stripped of operational internals.</p>
            <p>The goal is to demonstrate product thinking, information architecture, frontend execution, and a disciplined publication boundary.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rules</CardTitle>
            <CardDescription>Public safety is part of the implementation, not an afterthought.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>No real channels, no real exports, no secret artifacts, no private workflows.</p>
            <p>All demo data must be synthetic or aggressively sanitized before publication.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>How To Tour It In 5 Minutes</CardTitle>
            <CardDescription>A fast path for recruiters, collaborators, or public reviewers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <TourStep number="1" title="Open Dashboard" detail="Read the top-line health signal and visible timeframe context." />
            <TourStep number="2" title="Jump to Videos" detail="Use the sortable library to see the product handle real analysis mechanics." />
            <TourStep number="3" title="Check Creative or Insights" detail="See how the app moves from raw metrics into higher-level decision support." />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Starting Routes</CardTitle>
            <CardDescription>These pages best represent the demo today.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <AboutLink
              to={buildPathWithTimeframe('/')}
              title="Dashboard"
              detail="Best first stop for KPI narrative, trends, and product framing."
            />
            <AboutLink
              to={buildPathWithTimeframe('/videos')}
              title="Videos"
              detail="Most concrete route for filtering, sorting, and diagnosis flows."
            />
            <AboutLink
              to={buildPathWithTimeframe('/creative')}
              title="Creative"
              detail="Shows how the app shifts from analytics into creative recommendations."
            />
            <AboutLink
              to={buildPathWithTimeframe('/insights')}
              title="Insights"
              detail="Best route for cross-video patterns and higher-level summaries."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What The Demo Actually Demonstrates</CardTitle>
          <CardDescription>The point is not just visual polish. It is credible frontend product execution.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Capability label="Architecture" detail="Lazy-loaded routes, modular charting, and route-scoped feature boundaries." />
          <Capability label="Quality" detail="Basic interaction tests, semantic cleanup, and public-safe implementation constraints." />
          <Capability label="Product Thinking" detail="Clear decision paths from summary metrics to diagnosis and strategy pages." />
        </CardContent>
      </Card>
    </div>
  )
}

function PrimerStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  )
}

function TourStep({ number, title, detail }: { number: string; title: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/70 p-3">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
        {number}
      </span>
      <div className="space-y-1">
        <p className="font-medium text-foreground">{title}</p>
        <p>{detail}</p>
      </div>
    </div>
  )
}

function AboutLink({ to, title, detail }: { to: string; title: string; detail: string }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border/70 bg-background/75 p-4 text-sm transition hover:-translate-y-0.5 hover:bg-muted/30"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-foreground">{title}</p>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <p className="mt-2 text-muted-foreground">{detail}</p>
    </Link>
  )
}

function Capability({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/75 p-4">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  )
}
