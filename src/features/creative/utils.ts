import type { EChartsOption } from 'echarts'
import type { CreativeCombo, CreativeGroup, CreativeVideo } from '@/lib/demo-client/types'

export type GroupKind = 'theme' | 'thumbnail'

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

export function formatDuration(seconds?: number | null): string {
  if (!seconds || seconds <= 0) return '--'
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function normalizeKey(value?: string | null): string {
  return (value || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

export function filterCreativeGroups(items: CreativeGroup[], searchTerm: string) {
  const term = searchTerm.trim().toLowerCase()
  return items.filter((item) => !term || item.key.toLowerCase().includes(term))
}

export function filterCreativeVideos(items: CreativeVideo[], searchTerm: string) {
  const term = searchTerm.trim().toLowerCase()
  const filtered = term
    ? items.filter((video) =>
        [video.title, video.videoId, video.theme, video.thumbnailText].join(' ').toLowerCase().includes(term)
      )
    : [...items]

  return filtered.sort((a, b) => b.views - a.views)
}

export function getSelectedCreativeVideos(
  items: CreativeVideo[],
  selectedGroup: { type: GroupKind; key: string } | null
) {
  if (!selectedGroup) return []

  const targetKey = normalizeKey(selectedGroup.key)
  return items
    .filter((video) =>
      selectedGroup.type === 'theme'
        ? normalizeKey(video.theme) === targetKey
        : normalizeKey(video.thumbnailText) === targetKey
    )
    .sort((a, b) => b.views - a.views)
}

export function makeScatterOptions(
  points: Array<{ name: string; value: number[] }>,
  color: string
): EChartsOption {
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const point = params as { name?: string; value?: Array<number | string> }
        const values = Array.isArray(point.value) ? point.value : []
        const ctr = typeof values[0] === 'number' ? values[0] : 0
        const avdSeconds = typeof values[1] === 'number' ? values[1] : 0
        const count = typeof values[2] === 'number' ? values[2] : 0
        const avgViews = typeof values[3] === 'number' ? values[3] : 0
        return `${point.name ?? 'Unknown'}<br/>CTR: ${ctr.toFixed(2)}%<br/>AVD: ${formatDuration(avdSeconds)}<br/>Videos: ${count}<br/>Avg Views: ${formatNumber(avgViews)}`
      },
    },
    grid: { left: 48, right: 24, top: 24, bottom: 48 },
    xAxis: {
      name: 'CTR (%)',
      nameLocation: 'middle',
      nameGap: 30,
      type: 'value',
      axisLabel: { formatter: '{value}%' },
    },
    yAxis: {
      name: 'AVD (sec)',
      nameLocation: 'middle',
      nameGap: 40,
      type: 'value',
    },
    series: [
      {
        type: 'scatter',
        data: points,
        symbolSize: (val: number[]) => {
          const size = Math.sqrt(val[2]) * 10
          return Math.max(10, Math.min(34, size))
        },
        itemStyle: { color },
      },
    ],
  }
}

function toCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function downloadCsv(filename: string, headers: string[], rows: Array<(string | number | null | undefined)[]>) {
  const lines = [headers.join(',')]
  for (const row of rows) lines.push(row.map(toCsvValue).join(','))
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function exportCreativeVideosCsv(videos: CreativeVideo[]) {
  if (!videos.length) return

  downloadCsv(
    'creative-videos.csv',
    [
      'video_id',
      'title',
      'publish_date',
      'theme',
      'thumbnail_text',
      'views',
      'impressions',
      'ctr',
      'avd_seconds',
      'avp',
      'engagement_rate',
      'watch_time_minutes',
    ],
    videos.map((video) => [
      video.videoId,
      video.title,
      video.publishDate,
      video.theme,
      video.thumbnailText,
      video.views,
      video.impressions,
      video.ctr,
      video.avdSeconds,
      video.avp,
      video.engagementRate,
      video.watchTimeMinutes,
    ])
  )
}

export function getScatterPoints(items: CreativeGroup[] | CreativeCombo[] | undefined) {
  return (items ?? []).map((item) => ({
    name: 'key' in item ? item.key : `${item.theme} ${item.thumbnailText}`,
    value: [
      'avgCtr' in item ? item.avgCtr : 0,
      'avgAvdSeconds' in item ? item.avgAvdSeconds : 0,
      'videoCount' in item ? item.videoCount : 0,
      'avgViews' in item ? item.avgViews : 0,
    ],
  }))
}
