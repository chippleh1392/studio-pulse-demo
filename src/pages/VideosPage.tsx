import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'

export default function VideosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Videos"
        description="Planned route for the portfolio-safe video list and detail entry points."
        contextLabel="Phase"
        contextValue="Static placeholder"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Planned Surface</CardTitle>
            <CardDescription>The public version will keep the strongest decision-support list behaviors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Client-side sorting, filtering, and drill-in navigation will stay.</p>
            <p>Write actions, sync state, and private metadata hooks will stay out.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demo Contract</CardTitle>
            <CardDescription>Data will come from static JSON files rather than a live API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>`videos.json` for list payloads.</p>
            <p>`video-details/*.json` for route-level detail payloads.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
