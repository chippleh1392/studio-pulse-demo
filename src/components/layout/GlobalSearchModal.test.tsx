import type React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LayoutDashboard } from 'lucide-react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal'

vi.mock('cmdk', () => {
  const Command = Object.assign(
    ({
      children,
      shouldFilter: _shouldFilter,
      ...props
    }: React.ComponentProps<'div'> & { shouldFilter?: boolean }) => <div {...props}>{children}</div>,
    {
      Input: ({
        value,
        onValueChange,
        ...props
      }: Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> & {
        value?: string
        onValueChange?: (value: string) => void
      }) => (
        <input
          {...props}
          value={value ?? ''}
          onChange={(event) => onValueChange?.(event.target.value)}
        />
      ),
      List: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
      Empty: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
      Group: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
      Separator: (props: React.ComponentProps<'div'>) => <div {...props} />,
      Item: ({
        children,
        onSelect,
        keywords: _keywords,
        value: _value,
        ...props
      }: React.ComponentProps<'div'> & {
        onSelect?: (value: string) => void
        keywords?: string[]
        value?: string
      }) => (
        <div
          role="option"
          tabIndex={0}
          {...props}
          onClick={() => onSelect?.('')}
        >
          {children}
        </div>
      ),
    }
  )

  return { Command }
})

const mockRows = [
  { id: 'video-1', title: 'Morning Prayer for Peace' },
  { id: 'video-2', title: 'Live Psalm Study' },
]

vi.mock('@/hooks/use-demo-data', () => ({
  useVideoSearchRows: () => ({
    rows: mockRows,
    isLoading: false,
    hasError: false,
    reload: vi.fn(),
  }),
}))

describe('GlobalSearchModal', () => {
  it('shows matching video results and closes after selection', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <MemoryRouter>
        <GlobalSearchModal
          open={true}
          onOpenChange={onOpenChange}
          channelName="Northstar Studio"
          sections={[
            {
              label: 'Monitor',
              items: [{ title: 'Dashboard', path: '/', icon: LayoutDashboard }],
            },
          ]}
          buildPathWithTimeframe={(path) => path}
        />
      </MemoryRouter>
    )

    await user.type(screen.getByRole('textbox', { name: 'Search workspace' }), 'prayer')

    const result = await screen.findByText('Morning Prayer for Peace')
    expect(result).toBeInTheDocument()
    expect(screen.queryByText('Live Psalm Study')).not.toBeInTheDocument()

    await user.click(result)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
