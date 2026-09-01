import { useEffect, useRef } from 'react'
import type { ConversationMessage } from '../../types'
import { ChatMessage } from './ChatMessage'
import { SuggestedPrompts } from './SuggestedPrompts'
import { TypingIndicator } from './TypingIndicator'

interface ChatMessageListProps {
  messages: ConversationMessage[]
  isTyping: boolean
  showSuggestions: boolean
  onSelectSuggestion: (text: string) => void
}

export function ChatMessageList({
  messages,
  isTyping,
  showSuggestions,
  onSelectSuggestion,
}: ChatMessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isTyping])

  return (
    <div className="flex-1 overflow-y-auto px-1 py-4">
      {/* min-h-full + justify-end: short conversations sit at the bottom
          (empty space appears above, near the header, not stranded below
          near the input). Once content exceeds the container, min-h-full
          simply stops mattering and this scrolls like a normal list. */}
      <div className="flex min-h-full flex-col justify-end space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {showSuggestions && <SuggestedPrompts onSelect={onSelectSuggestion} disabled={isTyping} />}
        {isTyping && <TypingIndicator />}
        <div ref={endRef} />
      </div>
    </div>
  )
}
