import { Card } from '../shared/Card'

interface MetricCardProps {
  label: string
  value: number
  tone?: 'neutral' | 'amber' | 'red'
}

const ACCENT_BORDER_CLASSES: Record<'amber' | 'red', string> = {
  amber: 'border-l-2 border-l-amber-400',
  red: 'border-l-2 border-l-red-400',
}

const ACCENT_TEXT_CLASSES: Record<'amber' | 'red', string> = {
  amber: 'text-amber-600',
  red: 'text-red-600',
}

export function MetricCard({ label, value, tone = 'neutral' }: MetricCardProps) {
  // Only draw attention when there's actually something to draw attention
  // to — a zero-value Emergency/High Priority tile stays as calm as New/Total.
  const accentTone = tone !== 'neutral' && value > 0 ? tone : undefined

  return (
    <Card className={`p-4 transition-colors duration-150 ${accentTone ? ACCENT_BORDER_CLASSES[accentTone] : ''}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</p>
      <p
        className={`mt-1.5 text-3xl font-semibold tabular-nums ${
          accentTone ? ACCENT_TEXT_CLASSES[accentTone] : 'text-neutral-900'
        }`}
      >
        {value}
      </p>
    </Card>
  )
}
