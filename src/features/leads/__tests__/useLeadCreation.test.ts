import { describe, expect, it } from 'vitest'
import { shouldAttemptLeadCreation } from '../useLeadCreation'

describe('shouldAttemptLeadCreation', () => {
  it('allows creation once: complete, no existing lead, idle phase', () => {
    expect(shouldAttemptLeadCreation(true, undefined, 'idle')).toBe(true)
  })

  it('does not attempt while the conversation is still in progress', () => {
    expect(shouldAttemptLeadCreation(false, undefined, 'idle')).toBe(false)
  })

  it('blocks a second attempt once a lead already exists (re-render safe)', () => {
    expect(shouldAttemptLeadCreation(true, 'lead-123', 'idle')).toBe(false)
  })

  it('blocks a concurrent attempt while one is already pending', () => {
    expect(shouldAttemptLeadCreation(true, undefined, 'pending')).toBe(false)
  })

  it('blocks re-triggering once a previous attempt has completed', () => {
    expect(shouldAttemptLeadCreation(true, undefined, 'done')).toBe(false)
  })
})
