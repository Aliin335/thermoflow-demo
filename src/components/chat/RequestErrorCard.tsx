import { Button } from '../shared/Button'
import { Card } from '../shared/Card'

interface RequestErrorCardProps {
  message: string
  onRetry: () => void
}

export function RequestErrorCard({ message, onRetry }: RequestErrorCardProps) {
  return (
    <Card className="shrink-0 border-red-200 bg-red-50/40 p-5" role="alert">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"
        >
          !
        </span>
        <h2 className="text-base font-semibold text-neutral-900">We couldn't save your request</h2>
      </div>
      <p className="mt-2 text-sm text-neutral-500">
        {message} Your conversation is still here — nothing has been lost.
      </p>
      <div className="mt-5">
        <Button onClick={onRetry}>Try again</Button>
      </div>
    </Card>
  )
}
