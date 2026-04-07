import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import OverviewPage from '@/pages/OverviewPage'
import VideosPage from '@/pages/VideosPage'
import VideoDetailPage from '@/pages/VideoDetailPage'
import GrowthPage from '@/pages/GrowthPage'
import TechnicalAnalysisPage from '@/pages/TechnicalAnalysisPage'
import MetadataPage from '@/pages/MetadataPage'
import BreakoutPage from '@/pages/BreakoutPage'
import CreativePage from '@/pages/CreativePage'
import InsightsPage from '@/pages/InsightsPage'
import AboutPage from '@/pages/AboutPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/videos/:videoId" element={<VideoDetailPage />} />
        <Route path="/growth" element={<GrowthPage />} />
        <Route path="/metadata" element={<MetadataPage />} />
        <Route path="/breakout" element={<BreakoutPage />} />
        <Route path="/creative" element={<CreativePage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/ta" element={<TechnicalAnalysisPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  )
}

export default App
