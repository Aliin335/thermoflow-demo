import { Link } from 'react-router-dom'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { DashboardMetrics } from '../components/dashboard/DashboardMetrics'
import { LeadList } from '../components/dashboard/LeadList'
import { Button } from '../components/shared/Button'
import { EmptyState } from '../components/shared/EmptyState'
import { useLeads } from '../features/leads/useLeads'

export function DashboardPage() {
  const { leads, isLoading, error } = useLeads()

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <DashboardHeader />

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8">
        <DashboardMetrics leads={leads} />
      </div>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading requests…</p>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No customer requests yet."
            description="Try the AI Receptionist to see how a new request appears here."
          >
            <Link to="/receptionist">
              <Button>Open AI Receptionist</Button>
            </Link>
          </EmptyState>
        ) : (
          <LeadList leads={leads} />
        )}
      </div>
    </div>
  )
}
