import { calculateLeadMetrics } from '../../features/leads/leadMetrics'
import type { Lead } from '../../types'
import { MetricCard } from './MetricCard'

interface DashboardMetricsProps {
  leads: Lead[]
}

export function DashboardMetrics({ leads }: DashboardMetricsProps) {
  const metrics = calculateLeadMetrics(leads)

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <MetricCard label="New Requests" value={metrics.newRequests} />
      <MetricCard label="High Priority" value={metrics.highPriority} tone="amber" />
      <MetricCard label="Emergency" value={metrics.emergency} tone="red" />
      <MetricCard label="Total Requests" value={metrics.total} />
    </div>
  )
}
