import type { Lead } from '../../types'
import { Card } from '../shared/Card'
import { LeadListItem } from './LeadListItem'

interface LeadListProps {
  leads: Lead[]
}

export function LeadList({ leads }: LeadListProps) {
  return (
    <Card className="divide-y divide-neutral-100 overflow-hidden">
      {leads.map((lead) => (
        <LeadListItem key={lead.id} lead={lead} />
      ))}
    </Card>
  )
}
