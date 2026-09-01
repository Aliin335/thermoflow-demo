const stages = [
  { label: 'Customer Message', description: 'A customer describes their issue in plain language.' },
  { label: 'THERMOFLOW AI', description: 'The assistant asks questions and detects urgency.' },
  { label: 'Qualified Request', description: 'A structured lead is created automatically.' },
  { label: 'Business Dashboard', description: 'Your team sees the lead and full conversation.' },
]

export function CustomerFlowSection() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-400">
          From enquiry to lead
        </h2>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-start">
          {stages.map((stage, index) => (
            <div key={stage.label} className="flex flex-1 sm:flex-col">
              <div className="flex flex-col items-center sm:w-full">
                <div className="flex w-full items-center">
                  <span
                    className={`hidden h-px flex-1 bg-neutral-200 sm:block ${index === 0 ? 'sm:invisible' : ''}`}
                  />
                  <span className="mx-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 sm:mx-0">
                    {index + 1}
                  </span>
                  <span
                    className={`hidden h-px flex-1 bg-neutral-200 sm:block ${index === stages.length - 1 ? 'sm:invisible' : ''}`}
                  />
                </div>
              </div>
              <div className="ml-4 flex-1 pb-8 sm:ml-0 sm:pb-0 sm:pt-4 sm:text-center">
                <p className="text-sm font-semibold text-neutral-900">{stage.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-500 sm:mx-auto sm:max-w-[11rem]">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
