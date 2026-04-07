import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About"
        description="Public repo framing for the portfolio extraction."
        contextLabel="Dataset"
        contextValue="Synthetic and sanitized"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Purpose</CardTitle>
            <CardDescription>This repo is the public demo counterpart to a larger private analytics product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>The public version is intentionally read-only and stripped of operational internals.</p>
            <p>The goal is to demonstrate product thinking, information architecture, and frontend execution.</p>
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
    </div>
  )
}
