import { describe, expect, it } from 'vitest'
import type { ReceptionistState } from '../../../types'
import { processMessage } from '../conversationFlow'

function initialState(): ReceptionistState {
  return {
    step: 'greeting',
    messages: [],
    collected: {},
    isComplete: false,
  }
}

function lastAssistantText(state: ReceptionistState): string {
  const assistantMessages = state.messages.filter((m) => m.role === 'assistant')
  return assistantMessages[assistantMessages.length - 1]?.text ?? ''
}

describe('processMessage — full boiler flow', () => {
  it('walks a customer through the complete flow to lead-ready', () => {
    let state = initialState()

    state = processMessage(state, "My boiler isn't working")
    expect(state.collected.issueType).toBe('boiler')
    expect(state.isComplete).toBe(false)

    state = processMessage(state, 'No heating or hot water')
    expect(state.collected.priority).toBe('high')

    state = processMessage(state, 'John')
    expect(state.collected.customerName).toBe('John')

    state = processMessage(state, 'D24')
    expect(state.collected.postcode).toBe('D24')

    state = processMessage(state, '+353 87 123 4567')
    expect(state.collected.phone).toBe('+353 87 123 4567')

    state = processMessage(state, 'john@example.com')
    expect(state.collected.email).toBe('john@example.com')
    expect(state.isComplete).toBe(true)
    expect(lastAssistantText(state)).toMatch(/John/)
  })

  it('does not re-ask for information already supplied earlier', () => {
    let state = initialState()

    state = processMessage(
      state,
      "Hi, I'm John and my boiler stopped working at my house in D24. My number is 087 123 4567",
    )
    expect(state.collected.customerName).toBe('John')
    expect(state.collected.postcode).toBe('D24')
    expect(state.collected.phone).toBe('087 123 4567')

    // Answer the boiler clarifier question that follows.
    state = processMessage(state, 'Just heating, no hot water issue')

    // Only email should still be missing — the assistant should ask for it,
    // not re-request name, postcode, or phone.
    expect(state.step).toBe('email')
    expect(lastAssistantText(state)).toMatch(/email/i)
    expect(lastAssistantText(state)).not.toMatch(/name/i)
    expect(lastAssistantText(state)).not.toMatch(/postcode/i)
    expect(lastAssistantText(state)).not.toMatch(/phone/i)
  })
})

describe('processMessage — AC and quote flows', () => {
  it('handles an AC issue', () => {
    const state = processMessage(initialState(), 'The AC is making a strange noise')
    expect(state.collected.issueType).toBe('air-conditioning')
    expect(state.collected.priority).toBe('normal')
  })

  it('handles a quote request', () => {
    const state = processMessage(initialState(), 'I need a quote for a new heating system')
    expect(state.collected.issueType).toBe('quote')
  })
})

describe('processMessage — emergency handling', () => {
  it('gives safety advice and marks the request as emergency on a gas smell', () => {
    const state = processMessage(initialState(), 'I can smell gas near my boiler')
    expect(state.collected.priority).toBe('emergency')
    const reply = lastAssistantText(state)
    expect(reply.toLowerCase()).toMatch(/gas/)
    expect(reply.toLowerCase()).toMatch(/emergency/)
    // Must not continue normal troubleshooting (the boiler heating/hot-water
    // clarifier) — it should move straight to minimal contact collection.
    expect(state.step).not.toBe('description')
  })

  it('never implies THERMOFLOW itself is an emergency responder', () => {
    const state = processMessage(initialState(), 'I smell gas')
    const reply = lastAssistantText(state).toLowerCase()
    expect(reply).not.toMatch(/we (are|will) (send|dispatch)/)
  })
})

describe('processMessage — long input handling', () => {
  it('does not break on a very long description message', () => {
    const longRambling = 'It started making a strange noise and then stopped working. '.repeat(50)
    let state = initialState()

    state = processMessage(state, `My boiler isn't working. ${longRambling}`)
    expect(state.collected.issueType).toBe('boiler')
    expect(state.collected.description!.length).toBeGreaterThan(1000)

    // The conversation should still be able to reach completion normally.
    state = processMessage(state, 'Just heating')
    state = processMessage(state, 'John')
    state = processMessage(state, 'D24')
    state = processMessage(state, '087 123 4567')
    state = processMessage(state, 'john@example.com')
    expect(state.isComplete).toBe(true)
  })
})

describe('processMessage — invalid input handling', () => {
  it('re-asks for email on an invalid address without resetting the conversation', () => {
    let state = initialState()
    state = processMessage(state, 'I need a service')
    state = processMessage(state, 'Boiler service please')
    state = processMessage(state, 'John')
    state = processMessage(state, 'D24')
    state = processMessage(state, '087 123 4567')
    const beforeStep = state.step
    expect(beforeStep).toBe('email')

    state = processMessage(state, 'not-an-email')
    expect(state.collected.email).toBeUndefined()
    expect(state.step).toBe('email')
    expect(lastAssistantText(state)).toMatch(/email/i)

    state = processMessage(state, 'john@example.com')
    expect(state.collected.email).toBe('john@example.com')
    expect(state.isComplete).toBe(true)
  })

  it('re-asks for phone on an invalid number without resetting the conversation', () => {
    let state = initialState()
    state = processMessage(state, 'I need a service')
    state = processMessage(state, 'Boiler service please')
    state = processMessage(state, 'John')
    state = processMessage(state, 'D24')

    state = processMessage(state, '123')
    expect(state.collected.phone).toBeUndefined()
    expect(state.step).toBe('phone')

    state = processMessage(state, '087 123 4567')
    expect(state.collected.phone).toBe('087 123 4567')
  })
})
