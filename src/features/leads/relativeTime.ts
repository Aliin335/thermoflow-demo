/** `now` is injectable so this stays deterministically testable. */
export function formatRelativeTime(isoTimestamp: string, now: Date = new Date()): string {
  const then = new Date(isoTimestamp).getTime()
  const diffMinutes = Math.round((now.getTime() - then) / 60_000)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return new Date(isoTimestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
