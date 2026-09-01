import { describe, expect, it } from 'vitest'
import { detectPriority, mergePriority } from '../urgencyDetection'

describe('detectPriority', () => {
  it('flags gas smell as emergency', () => {
    expect(detectPriority('I can smell gas in the kitchen')).toBe('emergency')
  })

  it('flags gas leak as emergency', () => {
    expect(detectPriority('I think there is a gas leak')).toBe('emergency')
  })

  it('flags carbon monoxide as emergency', () => {
    expect(detectPriority('My carbon monoxide alarm is going off')).toBe('emergency')
  })

  it('flags no heating as high priority', () => {
    expect(detectPriority('We have no heating')).toBe('high')
  })

  it('flags no hot water as high priority', () => {
    expect(detectPriority('I have no hot water')).toBe('high')
  })

  it('treats routine service as no signal (normal by default)', () => {
    expect(detectPriority('I need an annual service')).toBeUndefined()
  })
})

describe('mergePriority', () => {
  it('defaults to normal when nothing detected yet', () => {
    expect(mergePriority(undefined, undefined)).toBe('normal')
  })

  it('escalates from normal to high', () => {
    expect(mergePriority('normal', 'high')).toBe('high')
  })

  it('escalates from high to emergency', () => {
    expect(mergePriority('high', 'emergency')).toBe('emergency')
  })

  it('never downgrades an existing emergency', () => {
    expect(mergePriority('emergency', undefined)).toBe('emergency')
    expect(mergePriority('emergency', 'normal')).toBe('emergency')
  })
})
