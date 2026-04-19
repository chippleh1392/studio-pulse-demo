import { useRef } from 'react'
import type { EChartsOption } from 'echarts'
import { ReactEChartsCore, echarts } from '@/lib/echarts/core'

type TimeSeriesValue = number | null
type TimeSeriesPoint = { date: string; value: TimeSeriesValue }

interface TimeSeriesChartProps {
  data?: TimeSeriesPoint[]
  series?: {
    id: string
    name: string
    color?: string
    data: TimeSeriesPoint[]
  }[]
  title?: string
  color?: string
  loading?: boolean
  grid?: EChartsOption['grid']
  legend?: EChartsOption['legend']
  tooltip?: EChartsOption['tooltip']
  xAxisDateFormat?: Intl.DateTimeFormatOptions
  yAxis?: EChartsOption['yAxis']
  valueFormatter?: (value: number) => string
  areaOpacity?: number
  showSymbol?: boolean
  symbolSize?: number
  className?: string
  style?: React.CSSProperties
  verticalMarkers?: {
    x: string
    label: string
    color?: string
    dashed?: boolean
  }[]
}

const DEFAULT_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function TimeSeriesChart({
  data = [],
  series = [],
  title,
  color = '#3b82f6',
  loading = false,
  grid,
  legend,
  tooltip,
  xAxisDateFormat = { month: 'short', day: 'numeric' },
  yAxis,
  valueFormatter = (value) => value.toLocaleString(),
  areaOpacity = 0.1,
  showSymbol = false,
  symbolSize = 6,
  className,
  style,
  verticalMarkers = [],
}: TimeSeriesChartProps) {
  const chartRef = useRef<InstanceType<typeof ReactEChartsCore> | null>(null)

  const normalizedSeries =
    series.length > 0
      ? series
      : data.length > 0
        ? [{ id: 'default', name: title ?? 'Series', color, data }]
        : []


  const allDates = Array.from(
    new Set(normalizedSeries.flatMap((seriesItem) => seriesItem.data.map((point) => point.date)))
  ).sort((a, b) => {
    // Sort by date string directly (YYYY-MM-DD format) to avoid timezone issues
    return a.localeCompare(b)
  })

  const formatDate = (value: string) => {
    // Parse date string as local date (not UTC) to avoid timezone issues
    // "2025-12-30" should stay as Dec 30, not become Dec 29 in timezones behind UTC
    const [year, month, day] = value.split('-').map(Number)
    const parsed = new Date(year, month - 1, day) // month is 0-indexed
    if (Number.isNaN(parsed.getTime())) return value
    return new Intl.DateTimeFormat(undefined, xAxisDateFormat).format(parsed)
  }

  const seriesOption: EChartsOption['series'] = normalizedSeries.map((seriesItem, index) => {
    const strokeColor = seriesItem.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]
    const valueMap = new Map(seriesItem.data.map((point) => [point.date, point.value]))

    return {
      name: seriesItem.name,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      showSymbol,
      symbolSize,
      emphasis: { focus: 'series' },
      data: allDates.map((date) => valueMap.get(date) ?? null),
      lineStyle: { color: strokeColor, width: 2 },
      itemStyle: { color: strokeColor },
      areaStyle: areaOpacity > 0 ? { color: strokeColor, opacity: areaOpacity } : undefined,
      markLine:
        index === 0 && verticalMarkers.length > 0
          ? {
              symbol: ['none', 'none'],
              silent: true,
              data: verticalMarkers.map((marker) => ({
                xAxis: marker.x,
                label: {
                  formatter: marker.label,
                  color: marker.color ?? '#475569',
                  position: 'insideEndTop',
                  fontSize: 11,
                },
                lineStyle: {
                  color: marker.color ?? '#94a3b8',
                  width: 1.2,
                  type: marker.dashed === false ? 'solid' : 'dashed',
                },
              })),
            }
          : undefined,
    }
  })

  const hasData = normalizedSeries.some((seriesItem) => seriesItem.data.length > 0)

  if (loading) {
    return (
      <div
        className={`h-full flex items-center justify-center text-muted-foreground ${className ?? ''}`}
        style={style}
      >
        Loading chart...
      </div>
    )
  }

  if (!hasData) {
    return (
      <div
        className={`h-full flex items-center justify-center text-muted-foreground ${className ?? ''}`}
        style={style}
      >
        No data available
      </div>
    )
  }

  const hasTitle = Boolean(title)
  const hasLegend = Boolean(legend || normalizedSeries.length > 1)
  const defaultGridTop = hasLegend
    ? hasTitle
      ? 96
      : 72
    : hasTitle
      ? 56
      : 32

  const option: EChartsOption = {
    title: hasTitle ? { text: title, left: 'center', top: 8 } : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' },
      formatter: (params: unknown) => {
        if (!Array.isArray(params)) return ''
        const typedParams = params as {
          axisValue?: string | number
          seriesName: string
          data: unknown
          color: string | { colorStops?: { color: string }[] }
        }[]

        const dateValue = typedParams[0]?.axisValue ?? ''
        // axisValue is the date string from category axis
        const formattedDate = formatDate(String(dateValue))
        const rows = typedParams
          .map((item) => {
            const value =
              typeof item.data === 'number'
                ? valueFormatter(item.data)
                : item.data === null
                  ? '--'
                  : String(item.data)
            const colorToken =
              typeof item.color === 'string'
                ? item.color
                : item.color.colorStops?.[0]?.color
            return `<div style="margin-top: 4px; display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 9999px; background: ${colorToken ?? '#6b7280'};"></span>
                <span>${item.seriesName}: <strong>${value}</strong></span>
              </div>`
          })
          .join('')

        return `<div>
            <div style="font-weight: 600; margin-bottom: 4px;">${formattedDate}</div>
            ${rows}
          </div>`
      },
      ...tooltip,
    },
    xAxis: {
      type: 'category',
      data: allDates,
      axisLabel: {
        formatter: (value: string) => formatDate(value),
        // Show first and last labels, plus evenly spaced labels in between
        interval: allDates.length <= 7 ? 0 : Math.floor(allDates.length / 6),
      },
      boundaryGap: false,
    },
    yAxis: yAxis ?? { type: 'value' },
    legend:
      legend ?? (normalizedSeries.length > 1 ? { top: 32, icon: 'circle', padding: [8, 8, 8, 8] } : undefined),
    series: seriesOption,
    grid: Array.isArray(grid)
      ? grid
      : {
          left: 48,
          right: 24,
          bottom: 32,
          top: defaultGridTop,
          containLabel: true,
          ...(grid ?? {}),
        },
  }

  return (
    <ReactEChartsCore
      ref={chartRef}
      echarts={echarts}
      option={option}
      style={{ height: '100%', width: '100%', ...style }}
      className={className}
      opts={{ renderer: 'canvas' }}
      notMerge={true}
    />
  )
}
