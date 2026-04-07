import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, FileStack, LayoutDashboard, LineChart, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAppShellData } from '@/lib/demo-client/client'
import type { AppShellData } from '@/lib/demo-client/types'

type NavItem = {
  label: string
  path: string
  icon: typeof LayoutDashboard
  end?: boolean
}

const navItems: NavItem[] = [
  { label: 'Overview', path: '/', icon: LayoutDashboard, end: true },
  { label: 'Videos', path: '/videos', icon: FileStack },
  { label: 'Growth', path: '/growth', icon: BarChart3 },
  { label: 'TA', path: '/ta', icon: LineChart },
  { label: 'About', path: '/about', icon: Sparkles },
]

export function AppLayout() {
  const [shellData, setShellData] = useState<AppShellData | null>(null)

  useEffect(() => {
    let cancelled = false

    getAppShellData()
      .then((data) => {
        if (!cancelled) setShellData(data)
      })
      .catch(() => {
        if (!cancelled) setShellData(null)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const appName = shellData?.app.name ?? 'Studio Pulse Demo'
  const channelName = shellData?.channel.name ?? 'Northstar Studio'
  const channelSubtitle =
    shellData?.channel.subtitle ?? 'Synthetic analytics workspace for a calm long-form content brand'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-border/70 bg-[linear-gradient(180deg,#bedce9_0%,#b9d4e3_42%,#c9b7e5_100%)] px-6 py-6 lg:border-r lg:border-b-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(160deg,#78a8d0_0%,#8d7cc5_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_24px_rgba(77,93,146,0.24)]">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-slate-800">{appName}</div>
              <div className="text-xs text-slate-700/75">{channelName}</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/45 bg-white/40 p-4 text-sm text-slate-800 shadow-[0_10px_26px_rgba(45,57,94,0.08)] backdrop-blur-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Phase 2</div>
            <p className="mt-2 leading-6">
              Static demo foundation with route-level JSON payloads. No backend, no private exports, and no local-ops surface.
            </p>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800/90 transition-colors hover:bg-white/55',
                    isActive && 'bg-white/72 text-slate-900 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-border/70 bg-card/90 px-6 py-4 backdrop-blur md:px-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Demo Dataset Policy
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{channelSubtitle}</p>
              </div>
              <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                Static demo data
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-8 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
