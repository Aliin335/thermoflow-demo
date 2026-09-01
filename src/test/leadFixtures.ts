import type { Lead } from '../types'

export function makeLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: overrides.id ?? `lead-${Math.random().toString(36).slice(2, 8)}`,
    customerName: 'John',
    phone: '+353 87 123 4567',
    email: 'john@example.com',
    postcode: 'D24',
    issueType: 'boiler',
    description: "My boiler isn't working",
    priority: 'high',
    status: 'new',
    createdAt: new Date().toISOString(),
    conversation: [],
    ...overrides,
  }
}
