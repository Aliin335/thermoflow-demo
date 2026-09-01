import { ISSUE_LABELS, PRIORITY_LABELS, PRIORITY_TONE } from '../../features/leads/labels'
import type { Lead } from '../../types'
import { Badge } from '../shared/Badge'
import { Card } from '../shared/Card'

interface RequestDetailsCardProps {
  lead: Lead
}

export function RequestDetailsCard({ lead }: RequestDetailsCardProps) {
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-neutral-900">Request details</h2>
      <dl className="mt-3 space-y-3 text-sm">
        <div>
          <dt className="text-neutral-500">Issue type</dt>
          <dd className="mt-0.5 font-medium text-neutral-900">{ISSUE_LABELS[lead.issueType]}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Equipment / system</dt>
          <dd className="mt-0.5 font-medium text-neutral-900">{lead.equipmentType || 'Not specified'}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Priority</dt>
          <dd className="mt-0.5">
            <Badge tone={PRIORITY_TONE[lead.priority]}>{PRIORITY_LABELS[lead.priority]}</Badge>
          </dd>
        </div>
        <div>
          <dt className="text-neutral-500">Description</dt>
          <dd className="mt-0.5 whitespace-pre-wrap font-medium leading-relaxed text-neutral-700">
            {lead.description || 'No additional details provided.'}
          </dd>
        </div>
      </dl>
    </Card>
  )
}
