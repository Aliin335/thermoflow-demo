import { useCallback, useState } from 'react'
import { MockConversationEngine } from '../../services/ai/MockConversationEngine'
import type { ReceptionistState } from '../../types'

// UI-only simulated latency so the typing indicator has something to show.
// This must not be reused later for real async work (lead creation, urgency
// detection, etc.) — those belong on the ConversationEngine, not the timer.
const RESPONSE_DELAY_MS = 700

export function useReceptionistChat() {
  const [engine] = useState(() => new MockConversationEngine())
  const [state, setState] = useState<ReceptionistState>(() => engine.createInitialState())
  const [isTyping, setIsTyping] = useState(false)

  const hasUserMessage = state.messages.some((message) => message.role === 'user')

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isTyping) return

      const nextState = await engine.respond(state, trimmed)

      // engine.respond appends exactly one user message followed by one
      // assistant reply. Reveal the customer's message immediately, but
      // keep the PREVIOUS collected/priority/step data until the reply
      // itself lands, so the context panel updates in step with the
      // conversation rather than jumping ahead of the typing indicator.
      const userMessage = nextState.messages[nextState.messages.length - 2]
      setState({ ...state, messages: [...state.messages, userMessage] })
      setIsTyping(true)

      await new Promise((resolve) => setTimeout(resolve, RESPONSE_DELAY_MS))

      setIsTyping(false)
      setState(nextState)
    },
    [engine, state, isTyping],
  )

  // Called once a Lead has been persisted for this conversation, so it is
  // never created twice (see features/leads/useLeadCreation.ts).
  const markLeadCreated = useCallback((leadId: string) => {
    setState((prev) => (prev.leadId ? prev : { ...prev, leadId }))
  }, [])

  const resetConversation = useCallback(() => {
    setState(engine.createInitialState())
    setIsTyping(false)
  }, [engine])

  return {
    state,
    messages: state.messages,
    isTyping,
    hasUserMessage,
    collected: state.collected,
    isComplete: state.isComplete,
    sendMessage,
    markLeadCreated,
    resetConversation,
  }
}
