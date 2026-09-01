export function ChatHeader() {
  return (
    <div className="shrink-0 py-6">
      <h1 className="flex items-center gap-2 text-sm font-medium text-neutral-900">
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
        AI Receptionist <span className="text-neutral-300" aria-hidden="true">•</span> Online
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Tell us what you need help with and we'll guide you from there.
      </p>
    </div>
  )
}
