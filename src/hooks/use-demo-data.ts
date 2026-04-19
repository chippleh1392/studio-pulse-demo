import { useMemo } from 'react'
import { getAppShellData, getVideosData } from '@/lib/demo-client/client'
import { useAsyncResource } from '@/hooks/use-async-resource'

export function useAppShellData() {
  return useAsyncResource('app-shell', getAppShellData)
}

export function useVideoCatalog() {
  return useAsyncResource('videos', getVideosData)
}

export function useVideoSearchRows() {
  const { data, isLoading, hasError, reload } = useVideoCatalog()

  const rows = useMemo(
    () => (data?.items ?? []).map((video) => ({ id: video.id, title: video.title })),
    [data?.items]
  )

  return {
    rows,
    isLoading,
    hasError,
    reload,
  }
}
