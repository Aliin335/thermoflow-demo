import { Badge } from '../shared/Badge'

const flowStages = ['Customer Request', 'AI Qualification', 'Qualified Lead']

export function ChatPreviewCard() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-16px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-900 text-[11px] font-semibold text-white">
          T
        </span>
        <span className="text-sm font-medium text-neutral-900">THERMOFLOW Assistant</span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Online
        </span>
      </div>

      <div className="flex flex-col gap-2.5 px-4 py-4">
        <div className="max-w-[85%] self-end rounded-lg rounded-br-sm bg-neutral-900 px-3 py-2 text-sm text-white">
          My boiler stopped working.
        </div>
        <div className="max-w-[85%] self-start rounded-lg rounded-bl-sm border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
          I'm sorry to hear that. I can help collect a few details so your service team can get
          back to you quickly.
        </div>
        <div className="max-w-[70%] self-start rounded-lg rounded-bl-sm border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm text-neutral-400">
          Typing…
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 border-t border-neutral-100 px-4 py-3">
        {flowStages.map((stage, index) => (
          <div key={stage} className="flex items-center gap-1">
            {index === flowStages.length - 1 ? (
              <Badge tone="green">{stage}</Badge>
            ) : (
              <span className="whitespace-nowrap text-xs font-medium text-neutral-400">
                {stage}
              </span>
            )}
            {index < flowStages.length - 1 && (
              <span className="px-0.5 text-neutral-300">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
