import { useEffect, useState } from 'react'
import { ArrowRight, FileJson, LayoutTemplate, ShieldCheck, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { getAppShellData, getDashboardData } from '@/lib/demo-client/client'
import type { AppShellData, DashboardData } from '@/lib/demo-client/types'

export default function OverviewPage() {
  const [shellData, setShellData] = useState<AppShellData | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([getAppShellData(), getDashboardData()])
      .then(([shell, dashboard]) => {
        if (cancelled) return
        setShellData(shell)
        setDashboardData(dashboard)
      })
      .catch(() => {
        if (cancelled) return
        setShellData(null)
        setDashboardData(null)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description={shellData?.channel.description || 'Static demo overview for the public portfolio extraction.'}
        contextLabel="Dataset"
        contextValue={shellData ? `${shellData.channel.name} · ${shellData.app.dataAsOf}` : 'Loading demo data'}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {(dashboardData?.headlineMetrics || []).map((metric) => (
          <Card key={metric.id}>
            <CardHeader>
              <CardTitle>{metric.label}</CardTitle>
              <CardDescription>{metric.context}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-semibold tracking-tight">{metric.display}</div>
              <div className="inline-flex items-center gap-2 text-sm text-emerald-700">
                <TrendingUp className="h-4 w-4" />
                <span>{metric.changeLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>What Exists Now</CardTitle>
            <CardDescription>The public repo is now running on a real static data contract.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>The app is physically separate from the private repo and no longer assumes a live API.</p>
            <p>Overview, Videos, Growth, and TA now read from static route-safe demo payloads.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What Changes Next</CardTitle>
            <CardDescription>The next slice should deepen the data model rather than widen the route surface.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Add richer visuals and a first detail route backed by synthetic fixtures.</p>
            <p>Refine public copy so the repo reads as a polished portfolio artifact rather than an extraction log.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Release Bar</CardTitle>
            <CardDescription>Public-safe scaffolding is in place, but every dataset change still needs manual review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>No private exports or copied channel text can enter the repo from this point onward.</p>
            <p>Every new JSON payload must continue to follow the synthetic-data policy.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4" />
              Public Safety
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Synthetic branding, synthetic IDs, and manual sanitization review are mandatory.
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileJson className="h-4 w-4" />
              Demo Data
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Route-level JSON files now replace live API dependencies in the public demo.
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutTemplate className="h-4 w-4" />
              Portfolio UX
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            The public app should read as an intentional product demo, not an amputated internal dashboard.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Story Highlights</CardTitle>
          <CardDescription>{dashboardData?.trendWindowLabel || 'Synthetic recent window'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {(dashboardData?.storyHighlights || []).map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
              <div className="space-y-1">
                <div className="font-medium text-foreground">{item.title}</div>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
