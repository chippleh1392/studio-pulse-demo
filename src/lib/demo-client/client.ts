import type {
  AppShellData,
  BreakoutData,
  CreativeData,
  DashboardData,
  GrowthData,
  InsightsData,
  MetadataData,
  TechnicalAnalysisData,
  VideosData,
} from '@/lib/demo-client/types'

async function loadJson<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to load demo data: ${path} (${response.status})`)
  }

  return response.json()
}

export function getAppShellData() {
  return loadJson<AppShellData>('/demo-data/app-shell.json')
}

export function getDashboardData() {
  return loadJson<DashboardData>('/demo-data/dashboard.json')
}

export function getVideosData() {
  return loadJson<VideosData>('/demo-data/videos.json')
}

export function getGrowthData() {
  return loadJson<GrowthData>('/demo-data/growth.json')
}

export function getTechnicalAnalysisData() {
  return loadJson<TechnicalAnalysisData>('/demo-data/technical-analysis.json')
}

export function getMetadataData() {
  return loadJson<MetadataData>('/demo-data/metadata.json')
}

export function getBreakoutData() {
  return loadJson<BreakoutData>('/demo-data/breakout.json')
}

export function getCreativeData() {
  return loadJson<CreativeData>('/demo-data/creative.json')
}

export function getInsightsData() {
  return loadJson<InsightsData>('/demo-data/insights.json')
}
