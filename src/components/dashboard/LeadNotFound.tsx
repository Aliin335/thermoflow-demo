import { Link } from 'react-router-dom'
import { Button } from '../shared/Button'
import { EmptyState } from '../shared/EmptyState'

export function LeadNotFound() {
  return (
    <EmptyState
      title="Lead not found"
      description="This request may have been removed, or the link is incorrect."
    >
      <Link to="/dashboard">
        <Button variant="secondary">Back to Dashboard</Button>
      </Link>
    </EmptyState>
  )
}
