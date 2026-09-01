export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-1 text-sm text-neutral-400">
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-300 [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-300 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-300 [animation-delay:300ms]" />
      </span>
      THERMOFLOW is responding…
    </div>
  )
}
