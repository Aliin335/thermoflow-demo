import { describe, expect, it } from 'vitest'
import type { ConversationMessage, ReceptionistState } from '../../../types'
import { createLeadFromReceptionistState } from '../createLeadFromReceptionistState'

function message(role: ConversationMessage['role'], text: string): ConversationMessage {
  return { id: `${role}-${text.slice(0, 6)}`, role, text, timestamp: new Date().toISOString() }
}

function completeState(overrides: Partial<ReceptionistState['collected']> = {}): ReceptionistState {
  const messages = [
    message('assistant', 'Hi! How can I help?'),
    message('user', "My boiler isn't working"),
    message('assistant', 'Sorry to hear that.'),
  ]
  return {
    step: 'complete',
    messages,
    isComplete: true,
    collected: {
      issueType: 'boiler',
      description: "My boiler isn't working",
      equipmentType: 'Boiler',
      priority: 'high',
      postcode: 'D24',
      customerName: 'John',
      phone: '+353 87 123 4567',
      email: 'john@example.com',
      ...overrides,
    },
  }
}

describe('createLeadFromReceptionistState', () => {
  it('maps all customer data correctly', () => {
    const lead = createLeadFromReceptionistState(completeState())

    expect(lead.customerName).toBe('John')
    expect(lead.phone).toBe('+353 87 123 4567')
    expect(lead.email).toBe('john@example.com')
    expect(lead.postcode).toBe('D24')
    expect(lead.issueType).toBe('boiler')
    expect(lead.description).toBe("My boiler isn't working")
    expect(lead.equipmentType).toBe('Boiler')
  })

  it('preserves priority', () => {
    const lead = createLeadFromReceptionistState(completeState({ priority: 'emergency' }))
    expect(lead.priority).toBe('emergency')
  })

  it('preserves the full conversation history', () => {
    const state = completeState()
    const lead = createLeadFromReceptionistState(state)
    expect(lead.conversation).toEqual(state.messages)
    expect(lead.conversation).toHaveLength(3)
  })

  it('defaults status to "new"', () => {
    const lead = createLeadFromReceptionistState(completeState())
    expect(lead.status).toBe('new')
  })

  it('generates a unique id', () => {
    const leadA = createLeadFromReceptionistState(completeState())
    const leadB = createLeadFromReceptionistState(completeState())
    expect(leadA.id).toBeTruthy()
    expect(leadA.id).not.toBe(leadB.id)
  })

  it('generates an ISO createdAt timestamp', () => {
    const lead = createLeadFromReceptionistState(completeState())
    expect(() => new Date(lead.createdAt).toISOString()).not.toThrow()
    expect(new Date(lead.createdAt).toISOString()).toBe(lead.createdAt)
  })

  it('leaves equipmentType undefined when never collected, without inventing a value', () => {
    const lead = createLeadFromReceptionistState(completeState({ equipmentType: undefined }))
    expect(lead.equipmentType).toBeUndefined()
  })

  it('falls back to a normal priority and empty description when somehow missing', () => {
    const lead = createLeadFromReceptionistState(
      completeState({ priority: undefined, description: undefined }),
    )
    expect(lead.priority).toBe('normal')
    expect(lead.description).toBe('')
  })

  it('accepts varied postcode formats without normalizing away real differences', () => {
    expect(createLeadFromReceptionistState(completeState({ postcode: 'SW1A 1AA' })).postcode).toBe(
      'SW1A 1AA',
    )
    expect(createLeadFromReceptionistState(completeState({ postcode: '90210' })).postcode).toBe(
      '90210',
    )
  })

  it('refuses to create a lead from an incomplete state', () => {
    const state = completeState()
    state.isComplete = false
    expect(() => createLeadFromReceptionistState(state)).toThrow()
  })

  it('refuses to invent missing required customer data', () => {
    const state = completeState({ phone: undefined })
    expect(() => createLeadFromReceptionistState(state)).toThrow()
  })
})
