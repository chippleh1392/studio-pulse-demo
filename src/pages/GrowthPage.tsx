import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'

export default function GrowthPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Growth"
        description="Planned route for weekly performance rollups and drilldowns."
        contextLabel="Phase"
        contextValue="Static placeholder"
      />

      <Card>
        <CardHeader>
          <CardTitle>Public Demo Direction</CardTitle>
          <CardDescription>The growth route will likely be one of the strongest portfolio pages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Keep weekly summaries, trend framing, and week drilldown structure.</p>
          <p>Drop any runtime assumptions tied to channel switching or private health status.</p>
        </CardContent>
      </Card>
    </div>
  )
}
