import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from '../relativeTime'

const NOW = new Date('2026-06-15T12:00:00.000Z')

describe('formatRelativeTime', () => {
  it('shows "Just now" for a timestamp under a minute old', () => {
    expect(formatRelativeTime('2026-06-15T11:59:40.000Z', NOW)).toBe('Just now')
  })

  it('shows minutes for a timestamp under an hour old', () => {
    expect(formatRelativeTime('2026-06-15T11:45:00.000Z', NOW)).toBe('15m ago')
  })

  it('shows hours for a timestamp under a day old', () => {
    expect(formatRelativeTime('2026-06-15T09:00:00.000Z', NOW)).toBe('3h ago')
  })

  it('shows days for a timestamp under a week old', () => {
    expect(formatRelativeTime('2026-06-13T12:00:00.000Z', NOW)).toBe('2d ago')
  })

  it('falls back to a formatted date for anything older than a week', () => {
    const result = formatRelativeTime('2026-05-01T12:00:00.000Z', NOW)
    expect(result).not.toMatch(/ago$/)
    expect(result.length).toBeGreaterThan(0)
  })
})
