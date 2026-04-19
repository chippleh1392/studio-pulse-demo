import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { GlobalTimeframeProvider, useGlobalTimeframe } from '@/lib/timeframe/globalTimeframe'

function TimeframeHarness() {
  const { timeframeLabel, setGlobalTimeframeDays, buildPathWithTimeframe } = useGlobalTimeframe()

  return (
    <div>
      <div>Label: {timeframeLabel}</div>
      <div>Path: {buildPathWithTimeframe('/growth')}</div>
      <button type="button" onClick={() => setGlobalTimeframeDays(30)}>
        Set 30D
      </button>
      <button type="button" onClick={() => setGlobalTimeframeDays(undefined)}>
        Reset
      </button>
    </div>
  )
}

describe('GlobalTimeframeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('persists timeframe selection and appends it to built paths', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/']}>
        <GlobalTimeframeProvider>
          <TimeframeHarness />
        </GlobalTimeframeProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('Label: Lifetime')).toBeInTheDocument()
    expect(screen.getByText('Path: /growth')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Set 30D' }))

    expect(screen.getByText('Label: 30D')).toBeInTheDocument()
    expect(screen.getByText('Path: /growth?tf=30')).toBeInTheDocument()
    expect(window.localStorage.getItem('yt_analytics_global_timeframe_days')).toBe('30')
  })
})
