import { describe, expect, it } from 'vitest'
import { getGreeting } from '../greeting'

describe('getGreeting', () => {
  it('greets morning hours', () => {
    expect(getGreeting(new Date('2026-06-15T08:00:00'))).toBe('Good morning.')
  })

  it('greets afternoon hours', () => {
    expect(getGreeting(new Date('2026-06-15T14:00:00'))).toBe('Good afternoon.')
  })

  it('greets evening hours', () => {
    expect(getGreeting(new Date('2026-06-15T20:00:00'))).toBe('Good evening.')
  })
})
