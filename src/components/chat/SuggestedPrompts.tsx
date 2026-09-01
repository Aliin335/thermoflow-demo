const SUGGESTIONS = [
  "My boiler isn't working",
  'I have no heating',
  'I need a service',
  'My AC is broken',
  'I need a quote',
]

interface SuggestedPromptsProps {
  onSelect: (text: string) => void
  disabled?: boolean
}

export function SuggestedPrompts({ onSelect, disabled }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {SUGGESTIONS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-sm text-neutral-600 transition-colors duration-150 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
