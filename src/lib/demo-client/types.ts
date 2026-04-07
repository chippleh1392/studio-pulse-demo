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
    breakout: boolean
    creative: boolean
    insights: boolean
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
  impressions: number
  ctr: number
  avdSeconds: number
  avp: number
  format: string
  theme: string
  score: number
  tier: 'Excellent' | 'Good' | 'Average' | 'Poor'
  isLive: boolean
  thumbnailLabel: string
  summary: string
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
  yearWeek: string
  label: string
  periodStart: string
  views: number
  watchHours: number
  netSubscribers: number
  releaseCount: number
  wowChange: number | null
  tier: 'Excellent' | 'Good' | 'Average' | 'Poor'
  vsAverage: number | null
  momentumScore: number
  momentumTrend: 'Strong Positive' | 'Positive' | 'Neutral' | 'Negative'
  daysCount: number
  isPartial: boolean
  projectedViews: number | null
  anomaly: null | {
    type: 'spike' | 'dip'
    severity: 'Moderate' | 'High'
    reason: string
  }
}

export type GrowthData = {
  windowLabel: string
  summary: {
    averageWeeklyViews: number
    averageWeeklyNetSubscribers: number
    bestWeekLabel: string
    bestWeekViews: number
    consistencyLabel: string
    currentMomentumScore: number
    currentMomentumTrend: 'Strong Positive' | 'Positive' | 'Neutral' | 'Negative'
    currentTier: 'Excellent' | 'Good' | 'Average' | 'Poor'
    latestWowChange: number | null
    anomalyCount: number
    wowTrendDirection: 'increasing' | 'flat' | 'decreasing'
  }
  weeks: GrowthWeek[]
  focusAreas: {
    title: string
    detail: string
  }[]
}

export type TechnicalAnalysisPoint = {
  date: string
  value: number
  changeAbs: number
  changePct: number
  rsi: number
  roc: number
  zscore: number
  macdLine: number
  macdSignal: number
  overlays: {
    smaShort: number
    smaMid: number
    smaLong: number
    emaShort: number
    emaMid: number
    emaLong: number
    bbUpper: number
    bbMid: number
    bbLower: number
  }
}

export type TechnicalAnalysisMetric = {
  id: string
  label: string
  points: TechnicalAnalysisPoint[]
}

export type TechnicalAnalysisData = {
  timeframeLabel: string
  meta: {
    windows: {
      short: number
      mid: number
      long: number
    }
    rsiPeriod: number
    macd: {
      fast: number
      slow: number
      signal: number
    }
  }
  metrics: TechnicalAnalysisMetric[]
}

export type MetadataIssue = {
  code: string
  label: string
  severity: 'warning' | 'critical'
  count: number
}

export type MetadataVideoAudit = {
  videoId: string
  title: string
  publishedAt: string
  views: number
  metadataScore: number
  nicheAlignmentScore: number
  tagCount: number
  theme: string | null
  thumbnailText: string | null
  issueCount: number
  issues: {
    code: string
    severity: 'warning' | 'critical'
  }[]
}

export type MetadataData = {
  channel: {
    nicheSummary: string
    targetKeywords: string[]
    avoidKeywords: string[]
    observedKeywords: string[]
    channelAlignmentScore: number
  }
  summary: {
    avgMetadataScore: number
    avgNicheAlignmentScore: number
    videosWithIssues: number
    issueRatePct: number
    videosWithCriticalIssues: number
    criticalIssueRatePct: number
  }
  issues: MetadataIssue[]
  videos: MetadataVideoAudit[]
}

export type BreakoutCandidate = {
  videoId: string
  title: string
  views: number
  daysSincePublish: number
  viewsPerDay: number
  ctr: number | null
  avp: number | null
  breakoutScore: number
  topSignal: string
  reasoning: string
  signals: {
    ctrSignal: number
    avpSignal: number
    velocitySignal: number
    suggestedTrafficSignal: number
    engagementSignal: number
  }
}

export type ResurgenceCandidate = {
  videoId: string
  title: string
  views: number
  daysSincePublish: number
  recentViews: number
  priorViews: number
  recentViewsPerDay: number
  priorViewsPerDay: number
  surgeFactor: number
  surgeScore: number
  ctr: number | null
  avp: number | null
  reasoning: string
}

export type BreakoutData = {
  thresholds: {
    minViews: number
    maxViews: number
    breakoutThreshold: number
    breakoutMaxAgeDays: number
    resurgenceMinAgeDays: number
    resurgenceRecentDays: number
    resurgenceBaselineDays: number
    resurgenceMinRecentViews: number
    resurgenceMinSurgeFactor: number
  }
  candidates: BreakoutCandidate[]
  resurgences: ResurgenceCandidate[]
}

export type CreativeGroup = {
  key: string
  videoCount: number
  avgViews: number
  avgImpressions: number
  avgCtr: number
  avgAvdSeconds: number
  avgAvp: number
  avgWatchTimeMinutes: number
  successScore: number
  viewsLiftPct: number
  avgCtrLiftPct: number
  avgAvdLiftPct: number
}

export type CreativeCombo = {
  theme: string
  thumbnailText: string
  videoCount: number
  avgViews: number
  avgCtr: number
  avgAvdSeconds: number
}

export type CreativeVideo = {
  videoId: string
  title: string
  publishDate: string
  theme: string
  thumbnailText: string
  durationSeconds: number
  views: number
  impressions: number
  ctr: number
  avdSeconds: number
  avp: number
  engagementRate: number
  watchTimeMinutes: number
}

export type CreativeData = {
  summary: {
    avgViews: number
    avgCtr: number
    avgAvdSeconds: number
    totalVideos: number
  }
  topKeywords: string[]
  themes: CreativeGroup[]
  thumbnails: CreativeGroup[]
  combos: CreativeCombo[]
  videos: CreativeVideo[]
}

export type InsightsData = {
  summary: {
    trafficDiversityIndex: number
    trafficSourceCount: number
    subscriberRetentionAdvantage: number
    geographicCountryCount: number
    topCountryPercentage: number
  }
  trafficSources: {
    sourceName: string
    percentage: number
    totalViews: number
    color: string
  }[]
  devices: {
    deviceName: string
    percentage: number
    totalViews: number
    color: string
  }[]
  subscriberComparison: {
    subscriberViews: number
    subscriberAvgViewDurationSeconds: number
    nonSubscriberViews: number
    nonSubscriberAvgViewDurationSeconds: number
    subscriberViewPercentage: number
    summary: string
  }
  countries: {
    countryName: string
    percentage: number
    totalViews: number
  }[]
  dayOfWeek: {
    day: string
    percentage: number
    views: number
  }[]
  titleAnalysis: {
    avgWordCount: number
    emojiPct: number
    questionPct: number
    numbersPct: number
    topKeywords: { keyword: string; count: number }[]
    structureTypes: { structure: string; count: number; percentage: number }[]
    sampleTitles: {
      videoId: string
      title: string
      lengthWords: number
      hasEmoji: boolean
      hasQuestionMark: boolean
      hasNumbers: boolean
      structureType: string
    }[]
  }
}
