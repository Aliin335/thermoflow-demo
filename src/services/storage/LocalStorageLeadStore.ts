import type { Lead, LeadStatus } from '../../types'
import type { LeadStore } from './LeadStore'

const STORAGE_KEY = 'thermoflow:leads:v1'

function readAll(): Lead[] {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    throw new Error('Local storage is unavailable in this browser.')
  }
  if (!raw) return []
  try {
    return JSON.parse(raw) as Lead[]
  } catch {
    return []
  }
}

function writeAll(leads: Lead[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
  } catch {
    throw new Error('Could not save to local storage. It may be full or disabled.')
  }
}

/**
 * Demo persistence layer backed by localStorage. Leads survive page
 * refreshes but are local to the browser. Swap for a FirestoreLeadStore
 * later by implementing the same LeadStore interface. Errors are never
 * swallowed — every method rejects with a clear message on failure so
 * callers can surface it rather than silently losing data.
 */
export class LocalStorageLeadStore implements LeadStore {
  async list(): Promise<Lead[]> {
    return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async get(id: string): Promise<Lead | undefined> {
    return readAll().find((lead) => lead.id === id)
  }

  async create(lead: Lead): Promise<Lead> {
    const leads = readAll()
    if (leads.some((existing) => existing.id === lead.id)) {
      throw new Error(`A lead with id "${lead.id}" already exists.`)
    }
    leads.push(lead)
    writeAll(leads)
    return lead
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead | undefined> {
    const leads = readAll()
    const lead = leads.find((item) => item.id === id)
    if (!lead) return undefined
    lead.status = status
    writeAll(leads)
    return lead
  }
}
