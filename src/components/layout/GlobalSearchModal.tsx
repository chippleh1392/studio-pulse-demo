import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command as CommandPrimitive } from 'cmdk'
import {
  CornerDownLeft,
  FileText,
  Layers,
  Search,
  Users,
  Video,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useVideoSearchRows } from '@/hooks/use-demo-data'
import { cn } from '@/lib/utils'

export type SearchNavSection = {
  label: string
  items: { title: string; path: string; icon: LucideIcon }[]
}

type GlobalSearchModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  channelName: string
  sections: SearchNavSection[]
  buildPathWithTimeframe: (path: string) => string
}

function SectionHeading({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div
      className="flex items-center gap-2 px-5 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
      aria-hidden
    >
      <Icon className="size-3.5 shrink-0 opacity-70" />
      {label}
    </div>
  )
}

export function GlobalSearchModal({
  open,
  onOpenChange,
  channelName,
  sections,
  buildPathWithTimeframe,
}: GlobalSearchModalProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { rows: videoRows } = useVideoSearchRows()

  useEffect(() => {
    if (!open) {
      setSearch('')
    }
  }, [open])

  const searchTrim = search.trim()
  const searchQuery = searchTrim.toLowerCase()
  const videoQueryOk = searchTrim.length >= 2
  const filteredSections = useMemo(() => {
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!searchQuery) return true
          return [item.title, section.label, item.path].some((value) => value.toLowerCase().includes(searchQuery))
        }),
      }))
      .filter((section) => section.items.length > 0)
  }, [searchQuery, sections])

  const channelMatches = useMemo(() => {
    if (!searchQuery) return true
    return ['channel', channelName].some((value) => value.toLowerCase().includes(searchQuery))
  }, [channelName, searchQuery])

  const filteredVideos = useMemo(() => {
    if (!videoQueryOk) return []
    return videoRows.filter((v) => v.title.toLowerCase().includes(searchQuery) || v.id.toLowerCase().includes(searchQuery))
  }, [searchQuery, videoQueryOk, videoRows])

  const resultCount =
    filteredSections.reduce((sum, section) => sum + section.items.length, 0) +
    (channelMatches ? 1 : 0) +
    filteredVideos.length

  const go = (path: string) => {
    navigate(buildPathWithTimeframe(path))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        className={cn(
          'gap-0 overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-2xl',
          // Override dialog default sm:max-w-lg (512px) so the palette matches the real app width
          'w-[min(92vw,calc(100vw-2rem))] max-w-none sm:max-w-[min(960px,92vw)]'
        )}
      >
        <DialogTitle className="sr-only">Search workspace</DialogTitle>
        <DialogDescription className="sr-only">
          Search pages, channels, and videos in the demo workspace.
        </DialogDescription>

        <Command shouldFilter={false} className="rounded-2xl bg-card">
          <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
            <Search className="size-4 shrink-0 text-muted-foreground opacity-70" aria-hidden />
            <div className="min-w-0 flex-1" cmdk-input-wrapper="">
              <CommandPrimitive.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search pages, channels, or videos..."
                aria-label="Search workspace"
                className="placeholder:text-muted-foreground w-full border-0 bg-transparent py-1 text-base outline-none"
              />
            </div>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close search"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
            <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-md border border-border bg-muted/80 px-2 font-mono text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          <CommandList className="max-h-[min(520px,calc(100vh-8rem))] overflow-y-auto p-0">
            {filteredSections.length > 0 && (
              <CommandGroup
                heading={
                  <SectionHeading icon={Layers} label="PAGES" />
                }
                className="px-3 pb-2 sm:px-4"
              >
                {filteredSections.flatMap((section) =>
                  section.items.map((item) => (
                    <CommandItem
                      key={item.path}
                      value={`page ${item.title} ${section.label} ${item.path}`}
                      keywords={[item.title, section.label, item.path]}
                      onSelect={() => go(item.path)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5"
                    >
                      <FileText className="size-4 shrink-0 opacity-60" />
                      <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {section.label.toUpperCase()}
                      </span>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            )}

            {filteredSections.length > 0 && <CommandSeparator className="border-t border-border/60" />}

            {channelMatches && (
              <CommandGroup
                heading={
                  <SectionHeading icon={Users} label="CHANNELS" />
                }
                className="px-3 pb-2 sm:px-4"
              >
                <CommandItem
                  value={`channel ${channelName}`}
                  keywords={[channelName, 'channel']}
                  onSelect={() => go('/')}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5"
                >
                  <Users className="size-4 shrink-0 opacity-60" />
                  <span className="min-w-0 flex-1 truncate text-sm">{channelName}</span>
                </CommandItem>
              </CommandGroup>
            )}

            {(filteredSections.length > 0 || channelMatches) && <CommandSeparator className="border-t border-border/60" />}

            <CommandGroup
              heading={
                <SectionHeading icon={Video} label="VIDEOS" />
              }
              className="px-3 pb-3 sm:px-4"
            >
              {!videoQueryOk ? (
                <CommandItem value="video-search-hint" disabled className="px-2 py-2 text-xs text-muted-foreground sm:px-1">
                  Type at least 2 characters to search videos.
                </CommandItem>
              ) : filteredVideos.length === 0 ? (
                <CommandItem value="video-search-empty" disabled className="px-2 py-2 text-xs text-muted-foreground sm:px-1">
                  No videos match your search.
                </CommandItem>
              ) : (
                filteredVideos.map((video) => (
                  <CommandItem
                    key={video.id}
                    value={`video ${video.title} ${video.id}`}
                    keywords={[video.title, video.id]}
                    onSelect={() => go(`/videos/${video.id}`)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5"
                  >
                    <Video className="size-4 shrink-0 opacity-60" />
                    <span className="min-w-0 flex-1 truncate text-sm">{video.title}</span>
                  </CommandItem>
                ))
              )}
            </CommandGroup>

            {resultCount === 0 && (
              <CommandEmpty className="py-10 text-sm text-muted-foreground">No results found.</CommandEmpty>
            )}
          </CommandList>
        </Command>

        <div className="flex items-center justify-between gap-4 border-t border-border bg-card px-5 py-3 text-[11px] text-muted-foreground">
          <span className="min-w-0">Use ↑ / ↓ to navigate, Enter to open</span>
          <span className="flex shrink-0 items-center gap-1.5">
            Quick open
            <CornerDownLeft className="size-3.5 opacity-80" aria-hidden />
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
