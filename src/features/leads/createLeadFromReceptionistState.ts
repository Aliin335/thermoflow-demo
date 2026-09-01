import type { Lead, ReceptionistState } from '../../types'
import { generateId } from './id'

/**
 * Converts a completed receptionist conversation into a structured Lead.
 * Pure and synchronous — persistence is a separate concern (see LeadStore).
 * Throws if the state isn't actually complete, since a Lead must never be
 * created with invented customer data.
 */
export function createLeadFromReceptionistState(state: ReceptionistState): Lead {
  const { collected } = state

  if (
    !state.isComplete ||
    !collected.customerName ||
    !collected.phone ||
    !collected.email ||
    !collected.postcode
  ) {
    throw new Error('Cannot create a lead from an incomplete receptionist state.')
  }

  return {
    id: generateId(),
    customerName: collected.customerName,
    phone: collected.phone,
    email: collected.email,
    postcode: collected.postcode,
    issueType: collected.issueType ?? 'other',
    description: collected.description ?? '',
    equipmentType: collected.equipmentType,
    priority: collected.priority ?? 'normal',
    status: 'new',
    createdAt: new Date().toISOString(),
    conversation: state.messages,
  }
}
