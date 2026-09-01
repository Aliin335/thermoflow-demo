import { Link } from 'react-router-dom'
import { Button } from '../shared/Button'
import { ChatPreviewCard } from './ChatPreviewCard'

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-8 lg:py-28">
      <div className="animate-fade-up text-center lg:text-left">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          Never Miss Another Customer.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-neutral-500 lg:mx-0">
          THERMOFLOW instantly responds to customer enquiries, qualifies service requests,
          identifies urgent issues and captures every lead — even when your team is unavailable.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <Link to="/receptionist" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Try the AI Receptionist</Button>
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              View Business Dashboard
            </Button>
          </Link>
        </div>
        <p className="mt-5 text-sm text-neutral-400">Built for HVAC & home service businesses.</p>
      </div>

      <div
        className="animate-fade-up flex justify-center lg:justify-end"
        style={{ animationDelay: '120ms' }}
      >
        <ChatPreviewCard />
      </div>
    </section>
  )
}
