import { useCallback, useEffect, useState } from 'react'
import { LocalStorageLeadStore } from '../../services/storage/LocalStorageLeadStore'
import type { Lead, LeadStatus } from '../../types'

const LOAD_ERROR_MESSAGE = "We couldn't load your requests. Please try again."
const UPDATE_ERROR_MESSAGE = "We couldn't update this request. Please try again."

/**
 * Data access for the dashboard lead list. Route components stay thin —
 * this owns loading, refreshing, and status updates through the LeadStore
 * abstraction so nothing in routes/ ever touches localStorage directly.
 */
export function useLeads() {
  const [leadStore] = useState(() => new LocalStorageLeadStore())
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // No synchronous setState before the first await: `isLoading` already
  // starts true, and background refreshes (e.g. cross-tab) should update
  // silently rather than flash a loading state.
  const refresh = useCallback(async () => {
    try {
      const result = await leadStore.list()
      setLeads(result)
      setError(null)
    } catch (err) {
      console.error('Failed to load leads:', err)
      setError(LOAD_ERROR_MESSAGE)
    } finally {
      setIsLoading(false)
    }
  }, [leadStore])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // Cross-tab: if another tab writes a lead, pick it up here too. Simple
  // "always refresh" handler — not worth tracking per-key diffs for a demo.
  useEffect(() => {
    const handleStorageEvent = () => void refresh()
    window.addEventListener('storage', handleStorageEvent)
    return () => window.removeEventListener('storage', handleStorageEvent)
  }, [refresh])

  const updateLeadStatus = useCallback(
    async (id: string, status: LeadStatus): Promise<boolean> => {
      try {
        const updated = await leadStore.updateStatus(id, status)
        if (!updated) {
          setError('That request could not be found.')
          return false
        }
        setLeads((prev) => prev.map((lead) => (lead.id === id ? updated : lead)))
        return true
      } catch (err) {
        console.error('Failed to update lead status:', err)
        setError(UPDATE_ERROR_MESSAGE)
        return false
      }
    },
    [leadStore],
  )

  return { leads, isLoading, error, refresh, updateLeadStatus }
}
