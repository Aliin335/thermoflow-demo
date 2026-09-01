import type { ConversationMessage } from '../../types'
import { Card } from '../shared/Card'

interface ConversationHistoryProps {
  messages: ConversationMessage[]
}

export function ConversationHistory({ messages }: ConversationHistoryProps) {
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-neutral-900">Conversation history</h2>
      <div className="mt-4 space-y-4">
        {messages.map((message) => {
          const isCustomer = message.role === 'user'
          return (
            <div key={message.id} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%] sm:max-w-[70%]">
                <p
                  className={`mb-1 text-xs font-medium text-neutral-400 ${isCustomer ? 'text-right' : ''}`}
                >
                  {isCustomer ? 'Customer' : 'THERMOFLOW'}
                </p>
                <div
                  className={`whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    isCustomer
                      ? 'bg-neutral-900 text-white'
                      : 'border border-neutral-200 bg-neutral-50 text-neutral-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
