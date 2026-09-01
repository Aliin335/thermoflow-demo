import { Link } from 'react-router-dom'
import { Button } from '../shared/Button'
import { Card } from '../shared/Card'
import { RequestSummary } from './RequestSummary'
import type { Lead } from '../../types'

interface RequestCompleteCardProps {
  lead: Lead
  onStartAnother: () => void
}

export function RequestCompleteCard({ lead, onStartAnother }: RequestCompleteCardProps) {
  return (
    <Card className="shrink-0 p-5" role="status">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
        >
          ✓
        </span>
        <h2 className="text-base font-semibold text-neutral-900">Request received</h2>
      </div>
      <p className="mt-2 text-sm text-neutral-500">
        Your service request has been prepared and sent to the team.
      </p>

      <RequestSummary lead={lead} />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link to={`/dashboard/leads/${lead.id}`} className="sm:flex-1">
          <Button className="w-full">View Business Dashboard</Button>
        </Link>
        <Button variant="secondary" onClick={onStartAnother} className="sm:flex-1">
          Start another request
        </Button>
      </div>
    </Card>
  )
}
