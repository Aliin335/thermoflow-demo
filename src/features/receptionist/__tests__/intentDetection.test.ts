import { describe, expect, it } from 'vitest'
import { detectIntent } from '../intentDetection'

describe('detectIntent', () => {
  it('detects boiler repair', () => {
    expect(detectIntent("My boiler isn't working")).toBe('boiler')
  })

  it('detects no heating', () => {
    expect(detectIntent('We have no heating since this morning')).toBe('heating')
  })

  it('detects no hot water', () => {
    expect(detectIntent('I have no hot water')).toBe('hot-water')
  })

  it('detects air conditioning repair', () => {
    expect(detectIntent('The AC is making a strange noise')).toBe('air-conditioning')
    expect(detectIntent('My air conditioning is broken')).toBe('air-conditioning')
  })

  it('detects general service / maintenance', () => {
    expect(detectIntent('I need a service')).toBe('service')
  })

  it('detects appointment / booking requests', () => {
    expect(detectIntent('I want to book an appointment')).toBe('booking')
  })

  it('detects quote requests', () => {
    expect(detectIntent('I need a quote')).toBe('quote')
    expect(detectIntent('I want a quote for a new heating system')).toBe('quote')
  })

  it('falls back to other for unknown enquiries', () => {
    expect(detectIntent('Just saying hello')).toBe('other')
  })
})
