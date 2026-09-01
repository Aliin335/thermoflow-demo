import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryStorage } from '../../../test/memoryStorage'
import { makeLead } from '../../../test/leadFixtures'
import { LocalStorageLeadStore } from '../LocalStorageLeadStore'

beforeEach(() => {
  ;(globalThis as { localStorage: Storage }).localStorage = new MemoryStorage()
})

describe('LocalStorageLeadStore', () => {
  it('creates and retrieves a lead by id', async () => {
    const store = new LocalStorageLeadStore()
    const lead = makeLead()

    await store.create(lead)
    const found = await store.get(lead.id)

    expect(found).toEqual(lead)
  })

  it('resolves undefined when looking up an id that does not exist', async () => {
    const store = new LocalStorageLeadStore()
    await store.create(makeLead({ id: 'lead-1' }))

    const found = await store.get('does-not-exist')

    expect(found).toBeUndefined()
  })

  it('lists all created leads', async () => {
    const store = new LocalStorageLeadStore()
    await store.create(makeLead({ id: 'lead-1' }))
    await store.create(makeLead({ id: 'lead-2' }))

    const leads = await store.list()
    expect(leads).toHaveLength(2)
    expect(leads.map((lead) => lead.id).sort()).toEqual(['lead-1', 'lead-2'])
  })

  it('lists leads newest first by createdAt', async () => {
    const store = new LocalStorageLeadStore()
    await store.create(makeLead({ id: 'oldest', createdAt: '2026-01-01T09:00:00.000Z' }))
    await store.create(makeLead({ id: 'middle', createdAt: '2026-01-02T09:00:00.000Z' }))
    await store.create(makeLead({ id: 'newest', createdAt: '2026-01-03T09:00:00.000Z' }))

    const leads = await store.list()

    expect(leads.map((lead) => lead.id)).toEqual(['newest', 'middle', 'oldest'])
  })

  it('persists leads across a fresh store instance (simulated refresh)', async () => {
    const storeA = new LocalStorageLeadStore()
    await storeA.create(makeLead({ id: 'lead-1' }))

    const storeB = new LocalStorageLeadStore()
    const leads = await storeB.list()

    expect(leads).toHaveLength(1)
    expect(leads[0].id).toBe('lead-1')
  })

  it('does not overwrite an unrelated lead when a duplicate id is created', async () => {
    const store = new LocalStorageLeadStore()
    const original = makeLead({ id: 'lead-1', customerName: 'John' })
    await store.create(original)

    const duplicate = makeLead({ id: 'lead-1', customerName: 'Someone Else' })
    await expect(store.create(duplicate)).rejects.toThrow()

    const stored = await store.get('lead-1')
    expect(stored?.customerName).toBe('John')
    const all = await store.list()
    expect(all).toHaveLength(1)
  })

  it('updates status without losing other leads', async () => {
    const store = new LocalStorageLeadStore()
    await store.create(makeLead({ id: 'lead-1' }))
    await store.create(makeLead({ id: 'lead-2' }))

    const updated = await store.updateStatus('lead-1', 'contacted')

    expect(updated?.status).toBe('contacted')
    const leads = await store.list()
    expect(leads.find((lead) => lead.id === 'lead-2')?.status).toBe('new')
  })

  it('walks a lead through the full status lifecycle, persisting each step', async () => {
    const store = new LocalStorageLeadStore()
    await store.create(makeLead({ id: 'lead-1', status: 'new' }))

    await store.updateStatus('lead-1', 'contacted')
    expect((await store.get('lead-1'))?.status).toBe('contacted')

    await store.updateStatus('lead-1', 'booked')
    expect((await store.get('lead-1'))?.status).toBe('booked')

    await store.updateStatus('lead-1', 'resolved')
    expect((await store.get('lead-1'))?.status).toBe('resolved')

    // Simulate a page refresh: a fresh store instance still sees it.
    const freshStore = new LocalStorageLeadStore()
    expect((await freshStore.get('lead-1'))?.status).toBe('resolved')
  })

  it('resolves undefined when updating the status of an id that does not exist', async () => {
    const store = new LocalStorageLeadStore()
    const result = await store.updateStatus('does-not-exist', 'contacted')
    expect(result).toBeUndefined()
  })

  it('surfaces a clear error instead of silently failing when storage write fails', async () => {
    const store = new LocalStorageLeadStore()
    const originalSetItem = localStorage.setItem.bind(localStorage)
    localStorage.setItem = () => {
      throw new Error('QuotaExceededError')
    }

    await expect(store.create(makeLead())).rejects.toThrow(/local storage/i)

    localStorage.setItem = originalSetItem
  })

  it('surfaces a clear error instead of silently failing when storage read fails', async () => {
    const store = new LocalStorageLeadStore()
    const originalGetItem = localStorage.getItem.bind(localStorage)
    localStorage.getItem = () => {
      throw new Error('SecurityError')
    }

    await expect(store.list()).rejects.toThrow(/local storage/i)

    localStorage.getItem = originalGetItem
  })
})
