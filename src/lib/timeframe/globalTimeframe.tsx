/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'yt_analytics_global_timeframe_days'
const ALLOWED_TIMEFRAMES = [7, 30, 60, 90, 180] as const

export type GlobalTimeframeDays = (typeof ALLOWED_TIMEFRAMES)[number] | undefined

type DeepLinkValue = string | number | boolean | null | undefined

type GlobalTimeframeContextValue = {
  globalTimeframeDays: GlobalTimeframeDays
  setGlobalTimeframeDays: (days: number | undefined) => void
  timeframeLabel: string
  buildPathWithTimeframe: (
    basePath: string,
    extraParams?: Record<string, DeepLinkValue>
  ) => string
}

const GlobalTimeframeContext = createContext<GlobalTimeframeContextValue | null>(null)

function normalizeTimeframe(days: number | undefined): GlobalTimeframeDays {
  if (days === undefined) return undefined
  return ALLOWED_TIMEFRAMES.includes(days as (typeof ALLOWED_TIMEFRAMES)[number])
    ? (days as GlobalTimeframeDays)
    : undefined
}

function parseTimeframeParam(raw: string | null): GlobalTimeframeDays {
  if (!raw) return undefined
  const lowered = raw.toLowerCase()
  if (lowered === 'all' || lowered === 'lifetime') return undefined
  const numeric = Number(raw)
  if (!Number.isFinite(numeric)) return undefined
  return normalizeTimeframe(numeric)
}

function readStoredTimeframe(): GlobalTimeframeDays {
  if (typeof window === 'undefined') return undefined
  return parseTimeframeParam(window.localStorage.getItem(STORAGE_KEY))
}

function toLabel(days: GlobalTimeframeDays): string {
  if (days === undefined) return 'Lifetime'
  return `${days}D`
}

export function GlobalTimeframeProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [storedTimeframeDays, setStoredTimeframeDays] = useState<GlobalTimeframeDays>(() => readStoredTimeframe())
  const urlTimeframeDays = useMemo(() => {
    const params = new URLSearchParams(location.search)
    if (!params.has('tf')) return null
    return parseTimeframeParam(params.get('tf'))
  }, [location.search])
  const globalTimeframeDays = urlTimeframeDays === null ? storedTimeframeDays : urlTimeframeDays

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (globalTimeframeDays === undefined) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }
    window.localStorage.setItem(STORAGE_KEY, String(globalTimeframeDays))
  }, [globalTimeframeDays])

  const setGlobalTimeframeDays = useCallback(
    (days: number | undefined) => {
      const next = normalizeTimeframe(days)
      setStoredTimeframeDays(next)

      const params = new URLSearchParams(location.search)
      if (next === undefined) {
        params.delete('tf')
      } else {
        params.set('tf', String(next))
      }
      const query = params.toString()
      navigate(
        {
          pathname: location.pathname,
          search: query ? `?${query}` : '',
        },
        { replace: true }
      )
    },
    [location.pathname, location.search, navigate]
  )

  const buildPathWithTimeframe = useCallback(
    (basePath: string, extraParams?: Record<string, DeepLinkValue>) => {
      const [pathname, existingQuery = ''] = basePath.split('?')
      const params = new URLSearchParams(existingQuery)
      const activeParams = new URLSearchParams(location.search)
      const currentEra = activeParams.get('era')

      if (globalTimeframeDays !== undefined) {
        params.set('tf', String(globalTimeframeDays))
      }
      if (currentEra) {
        params.set('era', currentEra)
      }

      if (extraParams) {
        for (const [key, value] of Object.entries(extraParams)) {
          if (value === undefined || value === null || value === '') {
            params.delete(key)
          } else {
            params.set(key, String(value))
          }
        }
      }

      const query = params.toString()
      return query ? `${pathname}?${query}` : pathname
    },
    [globalTimeframeDays, location.search]
  )

  const value = useMemo<GlobalTimeframeContextValue>(
    () => ({
      globalTimeframeDays,
      setGlobalTimeframeDays,
      timeframeLabel: toLabel(globalTimeframeDays),
      buildPathWithTimeframe,
    }),
    [buildPathWithTimeframe, globalTimeframeDays, setGlobalTimeframeDays]
  )

  return <GlobalTimeframeContext.Provider value={value}>{children}</GlobalTimeframeContext.Provider>
}

export function useGlobalTimeframe(): GlobalTimeframeContextValue {
  const context = useContext(GlobalTimeframeContext)
  if (!context) {
    throw new Error('useGlobalTimeframe must be used within GlobalTimeframeProvider')
  }
  return context
}
