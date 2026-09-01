import type { Lead, LeadStatus } from '../../types'

/**
 * Abstraction over lead persistence. LocalStorageLeadStore implements this
 * for the demo (Phase 5); a FirestoreLeadStore can implement the same
 * interface later without touching any UI or feature code.
 */
export interface LeadStore {
  list(): Promise<Lead[]>
  get(id: string): Promise<Lead | undefined>
  create(lead: Lead): Promise<Lead>
  updateStatus(id: string, status: LeadStatus): Promise<Lead | undefined>
}
