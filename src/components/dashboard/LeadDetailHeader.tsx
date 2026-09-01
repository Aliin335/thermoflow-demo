import { ISSUE_LABELS, PRIORITY_LABELS, PRIORITY_TONE } from '../../features/leads/labels'
import { formatRelativeTime } from '../../features/leads/relativeTime'
import type { Lead, LeadStatus } from '../../types'
import { Badge } from '../shared/Badge'
import { LeadStatusControl } from './LeadStatusControl'

interface LeadDetailHeaderProps {
  lead: Lead
  onStatusChange: (status: LeadStatus) => void
  isUpdatingStatus?: boolean
}

export function LeadDetailHeader({ lead, onStatusChange, isUpdatingStatus }: LeadDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">{lead.customerName}</h1>
          <Badge tone={PRIORITY_TONE[lead.priority]}>{PRIORITY_LABELS[lead.priority]}</Badge>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          {ISSUE_LABELS[lead.issueType]} · Received {formatRelativeTime(lead.createdAt)}
        </p>
      </div>
      <LeadStatusControl status={lead.status} onChange={onStatusChange} disabled={isUpdatingStatus} />
    </div>
  )
}
