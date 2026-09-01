import { ISSUE_LABELS, PRIORITY_LABELS, PRIORITY_TONE } from '../../features/leads/labels'
import type { Lead } from '../../types'
import { Badge } from '../shared/Badge'

interface RequestSummaryProps {
  lead: Lead
}

export function RequestSummary({ lead }: RequestSummaryProps) {
  const rows = [
    { label: 'Request type', value: ISSUE_LABELS[lead.issueType] },
    {
      label: 'Priority',
      value: <Badge tone={PRIORITY_TONE[lead.priority]}>{PRIORITY_LABELS[lead.priority]}</Badge>,
    },
    { label: 'Location', value: lead.postcode },
  ]

  return (
    <dl className="mt-4 divide-y divide-neutral-100 border-t border-neutral-100">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between py-2.5 text-sm">
          <dt className="text-neutral-500">{row.label}</dt>
          <dd className="font-medium text-neutral-900">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
