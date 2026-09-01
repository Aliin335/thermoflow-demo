import type { ConversationMessage } from '../../types'

interface ChatMessageProps {
  message: ConversationMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 text-[15px] leading-relaxed sm:max-w-[70%] ${
          isUser
            ? 'bg-neutral-900 text-white'
            : 'border border-neutral-200 bg-white text-neutral-700'
        }`}
      >
        {message.text}
      </div>
    </div>
  )
}
