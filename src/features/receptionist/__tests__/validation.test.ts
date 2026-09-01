import { describe, expect, it } from 'vitest'
import { isValidEmail, isValidName, isValidPhone, isValidPostcode } from '../validation'

describe('isValidPhone', () => {
  it('accepts a valid international phone number', () => {
    expect(isValidPhone('+353 87 123 4567')).toBe(true)
  })

  it('accepts a valid local phone number', () => {
    expect(isValidPhone('(01) 234-5678')).toBe(true)
  })

  it('rejects an obviously invalid phone number', () => {
    expect(isValidPhone('123')).toBe(false)
    expect(isValidPhone('call me maybe')).toBe(false)
  })

  it('rejects an unreasonably long run of digits', () => {
    expect(isValidPhone('1'.repeat(25))).toBe(false)
  })
})

describe('isValidEmail', () => {
  it('accepts a valid email address', () => {
    expect(isValidEmail('john@example.com')).toBe(true)
  })

  it('rejects an invalid email address', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
    expect(isValidEmail('john@')).toBe(false)
  })
})

describe('isValidPostcode', () => {
  it('accepts flexible alphanumeric postcode formats', () => {
    expect(isValidPostcode('D24')).toBe(true)
    expect(isValidPostcode('SW1A 1AA')).toBe(true)
    expect(isValidPostcode('90210')).toBe(true)
  })

  it('rejects text with no digits', () => {
    expect(isValidPostcode('yes')).toBe(false)
  })
})

describe('isValidName', () => {
  it('accepts normal names', () => {
    expect(isValidName('John')).toBe(true)
    expect(isValidName("Mary-Jane O'Brien")).toBe(true)
  })

  it('rejects an empty or punctuation-only response', () => {
    expect(isValidName('')).toBe(false)
    expect(isValidName('.')).toBe(false)
  })

  it('rejects an unreasonably long name', () => {
    expect(isValidName('A'.repeat(61))).toBe(false)
  })
})
