import { STATUS_LABELS } from '../../features/leads/labels'
import type { LeadStatus } from '../../types'

const STATUS_OPTIONS: LeadStatus[] = ['new', 'contacted', 'booked', 'resolved']

interface LeadStatusControlProps {
  status: LeadStatus
  onChange: (status: LeadStatus) => void
  disabled?: boolean
}

export function LeadStatusControl({ status, onChange, disabled }: LeadStatusControlProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-neutral-500">Status</span>
      <select
        value={status}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as LeadStatus)}
        className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 focus-visible:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {STATUS_LABELS[option]}
          </option>
        ))}
      </select>
    </label>
  )
}
