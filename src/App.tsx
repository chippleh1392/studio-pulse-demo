import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import OverviewPage from '@/pages/OverviewPage'
import VideosPage from '@/pages/VideosPage'
import GrowthPage from '@/pages/GrowthPage'
import TechnicalAnalysisPage from '@/pages/TechnicalAnalysisPage'
import AboutPage from '@/pages/AboutPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/growth" element={<GrowthPage />} />
        <Route path="/ta" element={<TechnicalAnalysisPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  )
}

export default App
