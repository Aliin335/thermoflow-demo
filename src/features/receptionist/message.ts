import type { ConversationMessage, MessageRole } from '../../types'

export function createMessage(role: MessageRole, text: string): ConversationMessage {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    timestamp: new Date().toISOString(),
  }
}
