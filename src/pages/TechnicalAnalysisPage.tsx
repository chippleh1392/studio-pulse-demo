import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'

export default function TechnicalAnalysisPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Technical Analysis"
        description="Planned route for the static TradingView-style performance framing."
        contextLabel="Phase"
        contextValue="Static placeholder"
      />

      <Card>
        <CardHeader>
          <CardTitle>Why This Stays</CardTitle>
          <CardDescription>This page is a strong portfolio differentiator once rebased onto synthetic data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>It shows product framing, not just chart rendering.</p>
          <p>The next slice will define a trimmed `technical-analysis.json` contract and a simplified explanation layer.</p>
        </CardContent>
      </Card>
    </div>
  )
}
