import { describe, expect, it } from 'vitest'
import {
  extractEmail,
  extractInformation,
  extractName,
  extractPhone,
  extractPostcode,
} from '../informationExtraction'

describe('extractPostcode', () => {
  it('extracts a postcode after a location cue', () => {
    expect(extractPostcode('My house is in D24')).toBe('D24')
  })

  it('extracts a postcode after an explicit cue word', () => {
    expect(extractPostcode('postcode is SW1A 1AA')).toBe('SW1A 1AA')
  })

  it('extracts a standalone numeric zip code', () => {
    expect(extractPostcode('We are at 90210 near the studio')).toBe('90210')
  })

  it('returns undefined when no postcode is present', () => {
    expect(extractPostcode('My boiler is broken')).toBeUndefined()
  })
})

describe('extractPhone', () => {
  it('extracts an international phone number', () => {
    expect(extractPhone('My number is +353 87 123 4567')).toBe('+353 87 123 4567')
  })

  it('extracts a local phone number', () => {
    expect(extractPhone('Call me on 087 123 4567')).toBe('087 123 4567')
  })

  it('returns undefined for text with no phone number', () => {
    expect(extractPhone('My boiler is broken')).toBeUndefined()
  })
})

describe('extractEmail', () => {
  it('extracts a valid email address', () => {
    expect(extractEmail('reach me at john@example.com please')).toBe('john@example.com')
  })

  it('returns undefined for text with no email', () => {
    expect(extractEmail('My boiler is broken')).toBeUndefined()
  })
})

describe('extractName', () => {
  it('extracts a name from an introduction cue', () => {
    expect(extractName("Hi, I'm John and my boiler stopped working")).toBe('John')
  })

  it('does not mistake a filler phrase for a name', () => {
    expect(extractName("I'm not sure what's wrong")).toBeUndefined()
  })
})

describe('extractInformation', () => {
  it('extracts multiple details from a single message', () => {
    const result = extractInformation(
      "Hi, I'm John and my boiler stopped working at my house in D24. My number is 087 123 4567",
    )
    expect(result.customerName).toBe('John')
    expect(result.postcode).toBe('D24')
    expect(result.phone).toBe('087 123 4567')
    expect(result.equipmentType).toBe('Boiler')
  })
})
