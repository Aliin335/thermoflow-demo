import { processMessage } from '../../features/receptionist/conversationFlow'
import { createMessage } from '../../features/receptionist/message'
import type { ReceptionistState } from '../../types'
import type { ConversationEngine } from './ConversationEngine'

const GREETING =
  "Hi! I'm the THERMOFLOW assistant. I can help you with heating, boiler, air conditioning or general service requests. What can I help you with today?"

/**
 * Deterministic HVAC receptionist engine — no paid AI API. All conversation
 * intelligence (intent detection, urgency, progressive info collection)
 * lives in features/receptionist/conversationFlow.ts; this class only wires
 * that pure logic up to the ConversationEngine interface.
 */
export class MockConversationEngine implements ConversationEngine {
  createInitialState(): ReceptionistState {
    return {
      step: 'greeting',
      messages: [createMessage('assistant', GREETING)],
      collected: {},
      isComplete: false,
    }
  }

  async respond(state: ReceptionistState, userText: string): Promise<ReceptionistState> {
    return processMessage(state, userText)
  }
}
