import type { ConversationMessage } from './conversation'
import type { IssueType, LeadPriority } from './lead'

export type ReceptionistStep =
  | 'greeting'
  | 'issue-type'
  | 'description'
  | 'equipment-type'
  | 'urgency'
  | 'postcode'
  | 'name'
  | 'phone'
  | 'email'
  | 'complete'

export interface ReceptionistCollectedInfo {
  issueType?: IssueType
  description?: string
  equipmentType?: string
  priority?: LeadPriority
  postcode?: string
  customerName?: string
  phone?: string
  email?: string
}

export interface ReceptionistState {
  step: ReceptionistStep
  messages: ConversationMessage[]
  collected: ReceptionistCollectedInfo
  isComplete: boolean
  leadId?: string
}
