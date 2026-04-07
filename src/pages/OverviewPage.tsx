import { ArrowRight, FileJson, LayoutTemplate, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Phase 1 public-demo scaffold for a static portfolio extraction."
        contextLabel="Status"
        contextValue="Repo created, workspace created, frontend shell seeded"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>What Exists Now</CardTitle>
            <CardDescription>New public repo and local workspace bootstrap are complete.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>The app now runs as a static shell separate from the private source repo.</p>
            <p>No API, auth, sync, or local-machine runtime assumptions are carried into this phase.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What Changes Next</CardTitle>
            <CardDescription>Phase 2 will replace private data dependencies with a demo data contract.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Define sanitized JSON payloads for dashboard, videos, growth, and technical analysis.</p>
            <p>Replace the inherited API client with static file loaders.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Release Bar</CardTitle>
            <CardDescription>The public remote stays empty until the scaffold is safe to publish.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>No private data or operational tooling should be pushed.</p>
            <p>The first safe publish point is after route trimming, public README, and data policy docs are in place.</p>
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
            Route-level JSON files will replace live API dependencies in the next implementation slice.
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
          <CardTitle>Immediate Next Slice</CardTitle>
          <CardDescription>Convert the static shell into a data-backed demo baseline.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
            <p>Create the public demo README, sanitization policy, and JSON schema docs.</p>
          </div>
          <div className="flex items-start gap-3">
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
            <p>Define the `app-shell`, `dashboard`, `videos`, `growth`, and `technical-analysis` JSON contracts.</p>
          </div>
          <div className="flex items-start gap-3">
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
            <p>Replace page placeholders with static demo loaders and seed the first synthetic dataset.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
