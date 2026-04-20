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
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { DateRangeSelector } from '@/components/charts/DateRangeSelector'
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAppShellData } from '@/hooks/use-demo-data'
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
  const { data: shellData } = useAppShellData()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [compactDensity, setCompactDensity] = useState(false)
  const [showDemoBanners, setShowDemoBanners] = useState(true)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
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
      <GlobalSearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        channelName={channelName}
        sections={navSections}
        buildPathWithTimeframe={buildPathWithTimeframe}
      />

      <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <SheetContent
          side="right"
          className="flex h-full w-full max-w-none flex-col gap-0 border-l border-border/80 bg-card p-0 shadow-xl sm:max-w-md"
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-8 pt-14">
            <SheetHeader className="space-y-1.5 p-0 text-left">
              <SheetTitle className="text-lg font-semibold tracking-tight">Notifications</SheetTitle>
              <SheetDescription className="text-sm leading-relaxed">
                Demo workspace alerts. Nothing is sent to a server in this build.
              </SheetDescription>
            </SheetHeader>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              <li className="rounded-lg border border-border/70 bg-muted/50 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                <p className="font-medium text-foreground">Weekly digest ready</p>
                <p className="mt-1 text-xs text-muted-foreground">Synthetic summary for {timeframeLabel}</p>
              </li>
              <li className="rounded-lg border border-border/70 bg-muted/50 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                <p className="font-medium text-foreground">Dataset refresh</p>
                <p className="mt-1 text-xs text-muted-foreground">Static demo data as of {dataAsOf}</p>
              </li>
              <li className="rounded-lg border border-dashed border-border/90 bg-background/80 px-4 py-3 text-muted-foreground">
                No actionable items — this is a public demo shell.
              </li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent
          side="right"
          className="flex h-full w-full max-w-none flex-col gap-0 border-l border-border/80 bg-card p-0 shadow-xl sm:max-w-md"
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-8 pt-14">
            <SheetHeader className="space-y-1.5 p-0 text-left">
              <SheetTitle className="text-lg font-semibold tracking-tight">Workspace settings</SheetTitle>
              <SheetDescription className="text-sm leading-relaxed">
                Preferences for this demo session only; they are not persisted.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border/70 bg-background/90 px-4 py-3 shadow-sm">
                <span className="font-medium text-foreground">Compact density</span>
                <input
                  type="checkbox"
                  className="accent-primary size-4 shrink-0"
                  checked={compactDensity}
                  onChange={(event) => setCompactDensity(event.target.checked)}
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-border/70 bg-background/90 px-4 py-3 shadow-sm">
                <span className="font-medium text-foreground">Show demo banners</span>
                <input
                  type="checkbox"
                  className="accent-primary size-4 shrink-0"
                  checked={showDemoBanners}
                  onChange={(event) => setShowDemoBanners(event.target.checked)}
                />
              </label>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Session-only preferences. Compact density tightens page padding; banners can be hidden for
                cleaner screenshots. Full account linking is intentionally omitted in the public demo.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
          <div className="flex h-11 items-center gap-2 border-b border-border/55 bg-[linear-gradient(90deg,#bedce9_0%,#bdd4e5_44%,#c9b8e4_100%)] px-3 md:gap-3 md:px-8">
            <SidebarTrigger
              className="size-8 shrink-0 text-slate-700 hover:bg-white/45 md:hidden"
              aria-label="Open navigation menu"
            />
            <div className="hidden min-w-0 items-center gap-2 text-xs font-semibold text-muted-foreground md:flex">
              <span className="rounded bg-white/45 px-2 py-0.5 text-slate-700">Workspace</span>
              <span className="truncate">{channelName}</span>
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-400/45 bg-white/40 px-3 py-1.5 text-slate-700 hover:bg-white/55 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/60 md:mx-auto md:max-w-2xl md:flex-initial md:w-[520px]"
              aria-label="Search pages"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate text-xs">Search pages, channels, or videos...</span>
              <span className="ml-auto hidden rounded border border-slate-400/45 bg-white/45 px-1.5 py-0.5 text-[10px] font-medium md:inline">
                Ctrl/Cmd+K
              </span>
            </button>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setNotificationsOpen(true)}
                className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-400/45 bg-white/45 text-slate-700 hover:bg-white/70 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/60 md:h-7 md:w-7"
                aria-label="Notifications"
                aria-haspopup="dialog"
                aria-expanded={notificationsOpen}
              >
                <Bell className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-400/45 bg-white/45 text-slate-700 hover:bg-white/70 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/60 md:h-7 md:w-7"
                aria-label="Settings"
                aria-haspopup="dialog"
                aria-expanded={settingsOpen}
              >
                <Settings2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <header
            className={cn(
              'flex flex-col border-b border-border/70 bg-card px-4 md:px-8',
              compactDensity ? 'gap-2 py-3' : 'gap-4 py-5'
            )}
          >
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
            {showDemoBanners ? (
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
            ) : null}
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
          <main className={cn('flex-1 px-4 md:px-8', compactDensity ? 'py-3' : 'py-6')}>
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
