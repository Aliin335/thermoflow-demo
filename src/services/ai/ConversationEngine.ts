import type { ReceptionistState } from '../../types'

/**
 * Abstraction over the conversation "brain" driving the AI receptionist.
 * MockConversationEngine implements this with deterministic logic (Phase 4).
 * A real LLM-backed engine can implement the same interface later without
 * touching any UI code.
 */
export interface ConversationEngine {
  createInitialState(): ReceptionistState
  respond(state: ReceptionistState, userText: string): Promise<ReceptionistState>
}
