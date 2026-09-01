import type { Lead } from '../../types'

export interface LeadMetrics {
  newRequests: number
  highPriority: number
  emergency: number
  total: number
}

/**
 * All counts are derived directly from persisted leads — nothing here is
 * ever hardcoded or estimated. "High priority" and "emergency" are counted
 * from the same flat LeadPriority field, so they're naturally mutually
 * exclusive (a lead is never counted in both).
 */
export function calculateLeadMetrics(leads: Lead[]): LeadMetrics {
  return {
    newRequests: leads.filter((lead) => lead.status === 'new').length,
    highPriority: leads.filter((lead) => lead.priority === 'high').length,
    emergency: leads.filter((lead) => lead.priority === 'emergency').length,
    total: leads.length,
  }
}
