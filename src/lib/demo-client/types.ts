export type AppShellData = {
  app: {
    name: string
    demoMode: boolean
    dataAsOf: string
    version: string
  }
  channel: {
    id: string
    name: string
    subtitle: string
    description: string
  }
  features: {
    overview: boolean
    videos: boolean
    growth: boolean
    technicalAnalysis: boolean
    metadata: boolean
    songs: boolean
  }
}

export type HeadlineMetric = {
  id: string
  label: string
  value: number
  display: string
  context: string
  changeLabel: string
}

export type DashboardTrendPoint = {
  label: string
  views: number
  watchHours: number
  subscribers: number
}

export type DashboardHighlight = {
  title: string
  detail: string
}

export type DashboardData = {
  headlineMetrics: HeadlineMetric[]
  trendWindowLabel: string
  weeklyTrend: DashboardTrendPoint[]
  storyHighlights: DashboardHighlight[]
}

export type DemoVideo = {
  id: string
  title: string
  publishedAt: string
  views: number
  watchHours: number
  ctr: number
  avdMinutes: number
  format: string
  theme: string
  score: number
}

export type VideosData = {
  items: DemoVideo[]
  summary: {
    totalVideos: number
    topFormat: string
    strongestTheme: string
    medianCtr: number
  }
}

export type GrowthWeek = {
  label: string
  views: number
  watchHours: number
  netSubscribers: number
  releaseCount: number
}

export type GrowthData = {
  windowLabel: string
  summary: {
    averageWeeklyViews: number
    averageWeeklyNetSubscribers: number
    bestWeekLabel: string
    bestWeekViews: number
    consistencyLabel: string
  }
  weeks: GrowthWeek[]
  focusAreas: {
    title: string
    detail: string
  }[]
}

export type TechnicalAnalysisData = {
  timeframeLabel: string
  rating: {
    label: string
    score: number
    summary: string
  }
  signals: {
    name: string
    status: string
    detail: string
  }[]
  supportLevels: {
    label: string
    value: string
  }[]
  actionBias: string[]
}
