import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type DateRangeOption = {
  label: string
  days: number | undefined // undefined = lifetime
}

const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '60D', days: 60 },
  { label: '90D', days: 90 },
  { label: '180D', days: 180 },
  { label: 'Lifetime', days: undefined },
]

type DateRangeSelectorProps = {
  value: number | undefined
  onChange: (days: number | undefined) => void
  className?: string
}

export function DateRangeSelector({ value, onChange, className }: DateRangeSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Timeframe"
      className={cn('flex flex-wrap gap-1', className)}
    >
      {DATE_RANGE_OPTIONS.map((option) => {
        const isActive = value === option.days
        return (
          <Button
            key={option.label}
            variant="ghost"
            size="sm"
            onClick={() => onChange(option.days)}
            aria-pressed={isActive}
            aria-label={
              option.days === undefined
                ? 'Show lifetime timeframe'
                : `Show last ${option.days} days`
            }
            className={cn(
              'h-6 rounded-full px-2.5 text-xs font-semibold border transition-colors',
              isActive
                ? 'border-primary/35 bg-primary/18 text-primary hover:bg-primary/22'
                : 'border-transparent text-muted-foreground hover:border-border hover:bg-accent/65 hover:text-accent-foreground'
            )}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
