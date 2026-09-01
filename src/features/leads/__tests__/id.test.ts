import { describe, expect, it } from 'vitest'
import { generateId } from '../id'

describe('generateId', () => {
  it('generates a non-empty, unique id', () => {
    const a = generateId()
    const b = generateId()
    expect(a).toBeTruthy()
    expect(b).toBeTruthy()
    expect(a).not.toBe(b)
  })
})
