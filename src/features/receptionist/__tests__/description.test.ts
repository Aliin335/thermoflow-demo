import { describe, expect, it } from 'vitest'
import { appendDescriptionFragment } from '../description'

describe('appendDescriptionFragment', () => {
  it('returns the fragment as-is when there is no existing description', () => {
    expect(appendDescriptionFragment(undefined, "My boiler isn't working")).toBe(
      "My boiler isn't working",
    )
  })

  it('joins fragments without punctuation with a sentence break', () => {
    const result = appendDescriptionFragment(
      "My boiler isn't working",
      'Just heating, hot water is fine',
    )
    expect(result).toBe("My boiler isn't working. Just heating, hot water is fine")
  })

  it('does not add a duplicate period when the existing fragment already ends with punctuation', () => {
    const result = appendDescriptionFragment(
      "My boiler isn't working.",
      'Just heating, hot water is fine',
    )
    expect(result).toBe("My boiler isn't working. Just heating, hot water is fine")
    expect(result).not.toMatch(/\.\s*\./)
  })

  it('does not duplicate punctuation when the existing fragment ends with ! or ?', () => {
    expect(appendDescriptionFragment('The boiler is leaking!', 'Water everywhere')).toBe(
      'The boiler is leaking! Water everywhere',
    )
    expect(appendDescriptionFragment('Is this normal?', 'It smells odd too')).toBe(
      'Is this normal? It smells odd too',
    )
  })

  it('accumulates three or more fragments with sentence breaks throughout', () => {
    let description: string | undefined
    description = appendDescriptionFragment(description, "My boiler isn't working")
    description = appendDescriptionFragment(description, 'Just heating')
    description = appendDescriptionFragment(description, 'Hot water is fine though')

    expect(description).toBe(
      "My boiler isn't working. Just heating. Hot water is fine though",
    )
    expect(description).not.toMatch(/\.\s*\./)
  })

  it('never introduces repeated spaces around the join', () => {
    const result = appendDescriptionFragment('My boiler is broken  ', '  and very loud')
    expect(result).not.toMatch(/\s{2,}/)
    expect(result).toBe('My boiler is broken. and very loud')
  })

  it('preserves the fragment exactly when there is nothing to join against', () => {
    expect(appendDescriptionFragment('', 'Just heating')).toBe('Just heating')
  })

  it('does not add a stray separator when the new fragment is empty', () => {
    expect(appendDescriptionFragment("My boiler isn't working", '   ')).toBe(
      "My boiler isn't working",
    )
  })
})
