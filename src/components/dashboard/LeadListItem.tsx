import { Link } from 'react-router-dom'
import { ISSUE_LABELS, PRIORITY_LABELS, PRIORITY_TONE, STATUS_LABELS, STATUS_TONE } from '../../features/leads/labels'
import { formatRelativeTime } from '../../features/leads/relativeTime'
import type { Lead } from '../../types'
import { Badge } from '../shared/Badge'

interface LeadListItemProps {
  lead: Lead
}

export function LeadListItem({ lead }: LeadListItemProps) {
  return (
    <Link
      to={`/dashboard/leads/${lead.id}`}
      className="flex flex-col gap-2 px-4 py-3.5 transition-colors duration-150 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900/40 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-neutral-900">{lead.customerName}</p>
        <p className="mt-0.5 truncate text-sm text-neutral-500">
          {ISSUE_LABELS[lead.issueType]} · {lead.postcode}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        <Badge tone={PRIORITY_TONE[lead.priority]}>{PRIORITY_LABELS[lead.priority]}</Badge>
        <Badge tone={STATUS_TONE[lead.status]}>{STATUS_LABELS[lead.status]}</Badge>
        <span className="text-xs text-neutral-400 sm:w-16 sm:text-right">
          {formatRelativeTime(lead.createdAt)}
        </span>
      </div>
    </Link>
  )
}
