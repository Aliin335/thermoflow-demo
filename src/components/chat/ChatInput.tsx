import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { Button } from '../shared/Button'

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
}

const MAX_HEIGHT_PX = 128

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
    resize(event.target)
  }

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex shrink-0 items-end gap-3 border-t border-neutral-200 bg-white py-4">
      <label htmlFor="chat-message-input" className="sr-only">
        Message THERMOFLOW
      </label>
      <textarea
        ref={textareaRef}
        id="chat-message-input"
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Describe what you need help with…"
        className="max-h-32 flex-1 resize-none overflow-y-auto rounded-md border border-neutral-200 px-3.5 py-2.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40 focus-visible:ring-offset-2"
      />
      <Button
        type="button"
        onClick={handleSend}
        disabled={disabled || value.trim().length === 0}
        aria-label="Send message"
        className="shrink-0"
      >
        Send
      </Button>
    </div>
  )
}
