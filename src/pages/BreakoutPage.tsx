import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAsyncResource } from '@/hooks/use-async-resource'
import { getBreakoutData } from '@/lib/demo-client/client'
import { useGlobalTimeframe } from '@/lib/timeframe/globalTimeframe'
import {
  BreakoutActionQueue,
  BreakoutCandidatesSection,
  BreakoutMethodCard,
  BreakoutResurgencesSection,
  BreakoutThresholdsCard,
} from '@/features/breakout/sections'
import { getTopBreakout, getTopResurgence } from '@/features/breakout/utils'

export default function BreakoutPage() {
  const { buildPathWithTimeframe } = useGlobalTimeframe()
  const { data, isLoading } = useAsyncResource('breakout', getBreakoutData)

  const topBreakout = data ? getTopBreakout(data.candidates) : undefined
  const topResurgence = data ? getTopResurgence(data.resurgences) : undefined

  return (
    <div className="space-y-6">
      <PageHeader
        title="Breakout Potential"
        description="Recent videos with strong early signals, plus older videos suddenly accelerating again."
        contextLabel="Signal model"
        contextValue="CTR, retention, velocity, algorithm and engagement"
        actions={
          <div className="flex items-center gap-2">
            <Link to={buildPathWithTimeframe('/growth')} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">
              Growth Context
            </Link>
            <Link to={buildPathWithTimeframe('/videos')} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted">
              Video Library
            </Link>
          </div>
        }
      />

      {!isLoading && data && (
        <BreakoutActionQueue
          data={data}
          topBreakout={topBreakout}
          topResurgence={topResurgence}
          buildPathWithTimeframe={buildPathWithTimeframe}
        />
      )}

      <BreakoutMethodCard />
      <BreakoutCandidatesSection
        isLoading={isLoading}
        data={data ?? null}
        buildPathWithTimeframe={buildPathWithTimeframe}
      />
      <BreakoutResurgencesSection
        isLoading={isLoading}
        data={data ?? null}
        buildPathWithTimeframe={buildPathWithTimeframe}
      />
      {data && <BreakoutThresholdsCard data={data} />}
    </div>
  )
}
