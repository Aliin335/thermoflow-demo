import { describe, expect, it } from 'vitest'
import { makeLead } from '../../../test/leadFixtures'
import { calculateLeadMetrics } from '../leadMetrics'

describe('calculateLeadMetrics', () => {
  it('returns all zeros for no leads', () => {
    expect(calculateLeadMetrics([])).toEqual({
      newRequests: 0,
      highPriority: 0,
      emergency: 0,
      total: 0,
    })
  })

  it('counts each metric correctly across a mixed set of leads', () => {
    const leads = [
      makeLead({ id: '1', status: 'new', priority: 'normal' }),
      makeLead({ id: '2', status: 'new', priority: 'high' }),
      makeLead({ id: '3', status: 'contacted', priority: 'high' }),
      makeLead({ id: '4', status: 'resolved', priority: 'emergency' }),
      makeLead({ id: '5', status: 'booked', priority: 'normal' }),
    ]

    const metrics = calculateLeadMetrics(leads)

    expect(metrics.newRequests).toBe(2)
    expect(metrics.highPriority).toBe(2)
    expect(metrics.emergency).toBe(1)
    expect(metrics.total).toBe(5)
  })

  it('never double-counts a lead across high priority and emergency', () => {
    const leads = [
      makeLead({ id: '1', priority: 'emergency' }),
      makeLead({ id: '2', priority: 'emergency' }),
      makeLead({ id: '3', priority: 'high' }),
    ]

    const metrics = calculateLeadMetrics(leads)

    expect(metrics.emergency).toBe(2)
    expect(metrics.highPriority).toBe(1)
  })
})
