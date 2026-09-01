import { ClosingCtaSection } from '../components/landing/ClosingCtaSection'
import { CustomerFlowSection } from '../components/landing/CustomerFlowSection'
import { Hero } from '../components/landing/Hero'
import { HowItWorksSection } from '../components/landing/HowItWorksSection'

export function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <HowItWorksSection />
      <CustomerFlowSection />
      <ClosingCtaSection />
    </div>
  )
}
