import { Link } from 'react-router-dom'
import { Button } from '../shared/Button'

export function ClosingCtaSection() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-900">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          See What Your Next Customer Experience Could Look Like.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-neutral-400">
          Test the AI receptionist yourself and see how a customer request becomes a qualified
          lead.
        </p>
        <div className="mt-8">
          <Link to="/receptionist">
            <Button variant="inverted">Start the Demo</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
