import { ChatHeader } from '../components/chat/ChatHeader'
import { ChatInput } from '../components/chat/ChatInput'
import { ChatMessageList } from '../components/chat/ChatMessageList'
import { ReceptionistContextPanel } from '../components/chat/ReceptionistContextPanel'
import { RequestCompleteCard } from '../components/chat/RequestCompleteCard'
import { RequestErrorCard } from '../components/chat/RequestErrorCard'
import { useLeadCreation } from '../features/leads/useLeadCreation'
import { useReceptionistChat } from '../features/receptionist/useReceptionistChat'

export function ReceptionistPage() {
  const {
    state,
    messages,
    isTyping,
    hasUserMessage,
    collected,
    isComplete,
    sendMessage,
    markLeadCreated,
    resetConversation,
  } = useReceptionistChat()

  const leadCreation = useLeadCreation(state, markLeadCreated)

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-5xl flex-col px-4 sm:px-6">
      <ChatHeader />
      <div className="flex min-h-0 flex-1">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <ChatMessageList
            messages={messages}
            isTyping={isTyping}
            showSuggestions={!hasUserMessage}
            onSelectSuggestion={sendMessage}
          />

          {leadCreation.status === 'success' && leadCreation.lead ? (
            <RequestCompleteCard lead={leadCreation.lead} onStartAnother={resetConversation} />
          ) : leadCreation.status === 'error' ? (
            <RequestErrorCard
              message={leadCreation.errorMessage ?? ''}
              onRetry={leadCreation.retry}
            />
          ) : leadCreation.status === 'creating' ? (
            <p className="shrink-0 py-4 text-sm text-neutral-400">Saving your request…</p>
          ) : (
            <ChatInput onSend={sendMessage} disabled={isTyping} />
          )}
        </div>
        <ReceptionistContextPanel collected={collected} isComplete={isComplete} />
      </div>
    </div>
  )
}
