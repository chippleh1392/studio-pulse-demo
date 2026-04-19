import type { BreakoutCandidate, ResurgenceCandidate } from '@/lib/demo-client/types'

export function getSignalColor(value?: number): string {
  if (value === undefined || value === null) return 'bg-gray-200'
  if (value >= 70) return 'bg-emerald-500'
  if (value >= 50) return 'bg-blue-500'
  if (value >= 30) return 'bg-amber-500'
  return 'bg-gray-300'
}

export function getScoreColor(score: number): string {
  if (score >= 70) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  if (score >= 50) return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  if (score >= 35) return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
  return 'bg-gray-100 text-gray-600 border-gray-200'
}

export function getTopBreakout(candidates: BreakoutCandidate[]) {
  return candidates[0]
}

export function getTopResurgence(candidates: ResurgenceCandidate[]) {
  return candidates[0]
}
