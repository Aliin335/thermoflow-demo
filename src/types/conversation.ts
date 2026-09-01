export type MessageRole = 'assistant' | 'user'

export interface ConversationMessage {
  id: string
  role: MessageRole
  text: string
  timestamp: string
}
