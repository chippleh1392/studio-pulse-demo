import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  Bell,
  Lightbulb,
  LineChart,
  PlayCircle,
  Rocket,
  Search,
  Settings2,
  Sparkles,
  Tags,
  TrendingUp,
  Video,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { DateRangeSelector } from '@/components/charts/DateRangeSelector'
import { getAppShellData } from '@/lib/demo-client/client'
import type { AppShellData } from '@/lib/demo-client/types'
import { useGlobalTimeframe } from '@/lib/timeframe/globalTimeframe'
import { cn } from '@/lib/utils'

type NavItem = {
  title: string
  path: string
  icon: typeof LayoutDashboard
  end?: boolean
}

type NavSection = {
  label: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    label: 'Monitor',
    items: [
      { title: 'Dashboard', path: '/', icon: LayoutDashboard, end: true },
      { title: 'Growth', path: '/growth', icon: TrendingUp },
    ],
  },
  {
    label: 'Diagnose',
    items: [
      { title: 'Videos', path: '/videos', icon: Video },
      { title: 'Metadata', path: '/metadata', icon: Tags },
    ],
  },
  {
    label: 'Strategy',
    items: [
      { title: 'Breakout', path: '/breakout', icon: Rocket },
      { title: 'Creative', path: '/creative', icon: Sparkles },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { title: 'Insights', path: '/insights', icon: Lightbulb },
      { title: 'TA Workspace', path: '/ta', icon: LineChart },
      { title: 'About', path: '/about', icon: Sparkles },
    ],
  },
]

function getChannelInitials(name: string): string {
  const words = name.match(/[A-Za-z0-9]+/g) ?? []
  if (words.length === 0) return 'SP'
  return words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? '').join('')
}

export function AppLayout() {
  const { globalTimeframeDays, setGlobalTimeframeDays, timeframeLabel, buildPathWithTimeframe } =
    useGlobalTimeframe()
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

  const searchablePages = useMemo(
    () =>
      navSections.flatMap((section) =>
        section.items.map((item) => ({
          title: item.title,
          path: item.path,
          section: section.label,
        }))
      ),
    []
  )

  const appName = shellData?.app.name ?? 'Studio Pulse'
  const channelName = shellData?.channel.name ?? 'Northstar Studio'
  const channelSubtitle =
    shellData?.channel.subtitle ?? 'Synthetic analytics workspace for a calm long-form content brand'
  const channelDescription =
    shellData?.channel.description ??
    'A public, sanitized demo dataset that preserves product patterns while removing all private operating details.'
  const dataAsOf = shellData?.app.dataAsOf ?? '2026-04-01'

  return (
    <SidebarProvider>
      <Sidebar className="border-r-0">
        <SidebarHeader className="bg-[#bedce9] px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(160deg,#78a8d0_0%,#8d7cc5_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_16px_rgba(77,93,146,0.28)]">
              <PlayCircle className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
                {appName}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/70">{channelName}</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {navSections.map((section) => (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={buildPathWithTimeframe(item.path)}
                          end={item.end}
                          className={({ isActive }) =>
                            cn(
                              'text-sidebar-foreground/90 hover:bg-sidebar-accent/65 hover:text-sidebar-accent-foreground transition-colors',
                              isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                            )
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background shadow-none">
        <div className="flex min-h-screen flex-1 flex-col bg-transparent">
          <div className="flex h-11 items-center justify-between border-b border-border/55 bg-[linear-gradient(90deg,#bedce9_0%,#bdd4e5_44%,#c9b8e4_100%)] px-4 md:px-8">
            <div className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground md:flex">
              <span className="rounded bg-white/45 px-2 py-0.5 text-slate-700">Workspace</span>
              <span className="truncate">{channelName}</span>
            </div>
            <button
              type="button"
              className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-md border border-slate-400/45 bg-white/40 px-3 py-1.5 text-slate-700 md:mx-0 md:w-[520px]"
              aria-label="Search pages"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate text-xs">
                Search pages, charts, and demo surfaces...
              </span>
              <span className="ml-auto hidden rounded border border-slate-400/45 bg-white/45 px-1.5 py-0.5 text-[10px] font-medium md:inline">
                Ctrl/Cmd+K
              </span>
            </button>
            <div className="hidden items-center gap-1.5 md:flex">
              <button
                type="button"
                className="relative inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-400/45 bg-white/45 text-slate-700 hover:bg-white/70"
                aria-label="Notifications"
              >
                <Bell className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-400/45 bg-white/45 text-slate-700 hover:bg-white/70"
                aria-label="Settings"
              >
                <Settings2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <header className="flex flex-col gap-4 border-b border-border/70 bg-card px-8 py-5">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Analytics overview
              </p>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-0 flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold tracking-tight text-foreground">{channelName}</span>
                    <span className="text-border">/</span>
                    <span>Performance</span>
                  </div>
                  <div className="flex flex-wrap gap-2" aria-label="Channel switcher">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/15 px-3 py-1.5 text-sm text-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]">
                      <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border bg-muted text-[11px] font-semibold text-muted-foreground">
                        <span>{getChannelInitials(channelName)}</span>
                      </span>
                      <span className="max-w-[220px] truncate">{channelName}</span>
                      <span className="rounded-full border border-primary/20 bg-white/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary/90">
                        Demo
                      </span>
                    </div>
                  </div>
                  <p className="max-w-3xl text-sm text-muted-foreground">{channelDescription}</p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <div className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    Static dataset · {dataAsOf}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                      Global Timeframe ({timeframeLabel})
                    </span>
                    <DateRangeSelector
                      value={globalTimeframeDays}
                      onChange={setGlobalTimeframeDays}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200/70 bg-emerald-50/65 px-4 py-3 text-sm text-emerald-950">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              <div className="space-y-1">
                <p className="font-medium">Public demo mode</p>
                <p className="text-emerald-900/80">
                  This build keeps the original analytics shell but reads only synthetic route-level
                  JSON. No private exports, channel auth, or local operations are present.
                </p>
              </div>
            </div>
            <div className="hidden grid-cols-3 gap-3 text-xs text-muted-foreground lg:grid">
              {searchablePages.slice(0, 3).map((page) => (
                <div key={page.path} className="rounded-lg border border-border/60 bg-background/75 px-3 py-2">
                  <span className="font-semibold text-foreground">{page.title}</span>
                  <span className="ml-2">{page.section}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{channelSubtitle}</p>
          </header>
          <main className="flex-1 px-8 py-6">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
