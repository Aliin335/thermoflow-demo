import type { Tone } from '../../components/shared/Badge'
import type { IssueType, LeadPriority, LeadStatus } from '../../types'

export const ISSUE_LABELS: Record<IssueType, string> = {
  boiler: 'Boiler repair',
  heating: 'Heating repair',
  'hot-water': 'Hot water issue',
  'air-conditioning': 'Air conditioning',
  service: 'Service / maintenance',
  booking: 'Appointment booking',
  quote: 'Quote request',
  other: 'General enquiry',
}

export const PRIORITY_LABELS: Record<LeadPriority, string> = {
  emergency: 'Emergency',
  high: 'High priority',
  normal: 'Normal',
}

export const PRIORITY_TONE: Record<LeadPriority, Tone> = {
  emergency: 'red',
  high: 'amber',
  normal: 'neutral',
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  booked: 'Booked',
  resolved: 'Resolved',
}

export const STATUS_TONE: Record<LeadStatus, Tone> = {
  new: 'blue',
  contacted: 'amber',
  booked: 'green',
  resolved: 'neutral',
}
