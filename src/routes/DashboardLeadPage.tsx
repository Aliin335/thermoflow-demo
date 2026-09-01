import { Link, useParams } from 'react-router-dom'
import { ConversationHistory } from '../components/dashboard/ConversationHistory'
import { CustomerInfoCard } from '../components/dashboard/CustomerInfoCard'
import { LeadDetailHeader } from '../components/dashboard/LeadDetailHeader'
import { LeadNotFound } from '../components/dashboard/LeadNotFound'
import { RequestDetailsCard } from '../components/dashboard/RequestDetailsCard'
import { useLead } from '../features/leads/useLead'
import type { LeadStatus } from '../types'

export function DashboardLeadPage() {
  const { leadId } = useParams<{ leadId: string }>()
  const { lead, isLoading, error, updateStatus } = useLead(leadId)

  const handleStatusChange = (status: LeadStatus) => {
    void updateStatus(status)
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <Link to="/dashboard" className="text-sm font-medium text-neutral-500 hover:text-neutral-900">
        ← Back to dashboard
      </Link>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-neutral-400">Loading…</p>
        ) : !lead ? (
          <LeadNotFound />
        ) : (
          <div className="space-y-6">
            <LeadDetailHeader lead={lead} onStatusChange={handleStatusChange} />

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <CustomerInfoCard lead={lead} />
              <RequestDetailsCard lead={lead} />
            </div>

            <ConversationHistory messages={lead.conversation} />
          </div>
        )}
      </div>
    </div>
  )
}
