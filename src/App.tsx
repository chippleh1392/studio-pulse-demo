import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import OverviewPage from '@/pages/OverviewPage'

const VideosPage = lazy(() => import('@/pages/VideosPage'))
const VideoDetailPage = lazy(() => import('@/pages/VideoDetailPage'))
const GrowthPage = lazy(() => import('@/pages/GrowthPage'))
const TechnicalAnalysisPage = lazy(() => import('@/pages/TechnicalAnalysisPage'))
const MetadataPage = lazy(() => import('@/pages/MetadataPage'))
const BreakoutPage = lazy(() => import('@/pages/BreakoutPage'))
const CreativePage = lazy(() => import('@/pages/CreativePage'))
const InsightsPage = lazy(() => import('@/pages/InsightsPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))

function RouteFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-[28rem] max-w-full animate-pulse rounded bg-muted/80" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`route-fallback-card-${index}`}
            className="h-40 animate-pulse rounded-2xl border border-border/60 bg-card"
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route
          path="/videos"
          element={
            <Suspense fallback={<RouteFallback />}>
              <VideosPage />
            </Suspense>
          }
        />
        <Route
          path="/videos/:videoId"
          element={
            <Suspense fallback={<RouteFallback />}>
              <VideoDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/growth"
          element={
            <Suspense fallback={<RouteFallback />}>
              <GrowthPage />
            </Suspense>
          }
        />
        <Route
          path="/metadata"
          element={
            <Suspense fallback={<RouteFallback />}>
              <MetadataPage />
            </Suspense>
          }
        />
        <Route
          path="/breakout"
          element={
            <Suspense fallback={<RouteFallback />}>
              <BreakoutPage />
            </Suspense>
          }
        />
        <Route
          path="/creative"
          element={
            <Suspense fallback={<RouteFallback />}>
              <CreativePage />
            </Suspense>
          }
        />
        <Route
          path="/insights"
          element={
            <Suspense fallback={<RouteFallback />}>
              <InsightsPage />
            </Suspense>
          }
        />
        <Route
          path="/ta"
          element={
            <Suspense fallback={<RouteFallback />}>
              <TechnicalAnalysisPage />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<RouteFallback />}>
              <AboutPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
