import type { ReceptionistCollectedInfo } from '../../types'

interface ReceptionistContextPanelProps {
  collected: ReceptionistCollectedInfo
  isComplete: boolean
}

export function ReceptionistContextPanel({ collected, isComplete }: ReceptionistContextPanelProps) {
  const steps = [
    {
      label: 'Understanding the issue',
      done: Boolean(collected.issueType && collected.description),
    },
    { label: 'Identifying urgency', done: Boolean(collected.priority) },
    { label: 'Collecting service details', done: Boolean(collected.postcode) },
    { label: 'Preparing your request', done: isComplete },
  ]

  return (
    <aside className="hidden w-64 shrink-0 border-l border-neutral-200 py-4 pl-8 lg:block">
      <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        What THERMOFLOW is doing
      </h2>
      <ul className="mt-4 space-y-3">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-2.5 text-sm">
            {step.done ? (
              <span
                aria-hidden="true"
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[10px] text-white"
              >
                ✓
              </span>
            ) : (
              <span aria-hidden="true" className="h-4 w-4 shrink-0 rounded-full border border-neutral-300" />
            )}
            <span className={step.done ? 'font-medium text-neutral-900' : 'text-neutral-400'}>
              <span className="sr-only">{step.done ? 'Done: ' : 'Not yet: '}</span>
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
