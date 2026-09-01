import type { ConversationMessage } from './conversation'

export type LeadPriority = 'emergency' | 'high' | 'normal'

export type LeadStatus = 'new' | 'contacted' | 'booked' | 'resolved'

export type IssueType =
  | 'boiler'
  | 'heating'
  | 'hot-water'
  | 'air-conditioning'
  | 'service'
  | 'booking'
  | 'quote'
  | 'other'

export interface Lead {
  id: string
  customerName: string
  phone: string
  email: string
  postcode: string
  issueType: IssueType
  description: string
  equipmentType?: string
  priority: LeadPriority
  status: LeadStatus
  createdAt: string
  conversation: ConversationMessage[]
}
