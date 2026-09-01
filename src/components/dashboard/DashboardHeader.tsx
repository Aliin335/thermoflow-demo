import { getGreeting } from '../../features/leads/greeting'

export function DashboardHeader() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{getGreeting()}</h1>
      <p className="mt-1 text-sm text-neutral-500">Here's what's happening with your customer requests.</p>
    </div>
  )
}
