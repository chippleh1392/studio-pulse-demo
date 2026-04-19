import { render, screen } from '@testing-library/react'
import { MemoryRouter, Outlet } from 'react-router-dom'
import { vi } from 'vitest'
import App from '@/App'

vi.mock('@/components/layout/AppLayout', () => ({
  AppLayout: function MockAppLayout() {
    return <Outlet />
  },
}))

vi.mock('@/pages/OverviewPage', () => ({ default: () => <div>Overview page</div> }))
vi.mock('@/pages/AboutPage', () => ({ default: () => <div>About page</div> }))
vi.mock('@/pages/VideosPage', () => ({ default: () => <div>Videos page</div> }))
vi.mock('@/pages/VideoDetailPage', () => ({ default: () => <div>Video detail page</div> }))
vi.mock('@/pages/GrowthPage', () => ({ default: () => <div>Growth page</div> }))
vi.mock('@/pages/MetadataPage', () => ({ default: () => <div>Metadata page</div> }))
vi.mock('@/pages/BreakoutPage', () => ({ default: () => <div>Breakout page</div> }))
vi.mock('@/pages/CreativePage', () => ({ default: () => <div>Creative page</div> }))
vi.mock('@/pages/InsightsPage', () => ({ default: () => <div>Insights page</div> }))
vi.mock('@/pages/TechnicalAnalysisPage', () => ({ default: () => <div>TA page</div> }))

describe('App routes', () => {
  it('renders a lazy route through the router tree', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    )

    expect(await screen.findByText('About page')).toBeInTheDocument()
  })
})
