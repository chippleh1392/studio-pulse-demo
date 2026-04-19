import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import VideosPage from '@/pages/VideosPage'
import { testVideosData } from '@/test/data'

vi.mock('@/lib/demo-client/client', () => ({
  getVideosData: vi.fn(async () => testVideosData),
}))

describe('VideosPage', () => {
  it('filters videos by search and type', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <VideosPage />
      </MemoryRouter>
    )

    expect(await screen.findByRole('link', { name: 'Morning Prayer for Peace' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Live Psalm Study' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Bible Sleep Story' })).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Search titles, themes, formats...'), 'prayer')

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Morning Prayer for Peace' })).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Live Psalm Study' })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Bible Sleep Story' })).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Reset' }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Live Psalm Study' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Bible Sleep Story' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Live' }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Live Psalm Study' })).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Morning Prayer for Peace' })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Bible Sleep Story' })).not.toBeInTheDocument()
    })
  })
})
