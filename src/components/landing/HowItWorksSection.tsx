const steps = [
  {
    number: '01',
    title: 'Respond instantly',
    description: 'THERMOFLOW engages with customers the moment they reach out.',
  },
  {
    number: '02',
    title: 'Understand the request',
    description:
      'The AI asks the right questions, collects relevant details and identifies priority.',
  },
  {
    number: '03',
    title: 'Deliver a qualified lead',
    description: 'Your team receives structured customer information and the full conversation.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-400">
          How it works
        </h2>
        <div className="mt-8 grid divide-y divide-neutral-200 border-t border-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:border-t-0">
          {steps.map((step) => (
            <div key={step.number} className="py-8 first:pt-0 sm:px-8 sm:py-0 sm:first:pl-0">
              <span className="text-sm font-medium text-neutral-300">{step.number}</span>
              <h3 className="mt-3 text-lg font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
