import { useCallback, useEffect, useState } from 'react'
import { LocalStorageLeadStore } from '../../services/storage/LocalStorageLeadStore'
import type { Lead, LeadStatus } from '../../types'

const LOAD_ERROR_MESSAGE = "We couldn't load this request. Please try again."
const UPDATE_ERROR_MESSAGE = "We couldn't update this request. Please try again."

/**
 * Data access for a single lead (the dashboard detail page). `lead` is
 * `undefined` while loading, `null` once loading finished and no lead with
 * this id exists (a clean "not found" signal, distinct from "still
 * loading"), or the Lead itself.
 */
export function useLead(leadId: string | undefined) {
  const [leadStore] = useState(() => new LocalStorageLeadStore())
  const [lead, setLead] = useState<Lead | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  // Reset to a fresh loading (or immediate not-found) state whenever leadId
  // changes, so navigating between two different lead ids never shows the
  // previous lead's stale data. Adjusting state during render, not in an
  // effect — see useLeadCreation.ts for the same pattern.
  const [trackedLeadId, setTrackedLeadId] = useState(leadId)
  if (leadId !== trackedLeadId) {
    setTrackedLeadId(leadId)
    setLead(leadId ? undefined : null)
    setError(null)
  }

  // No synchronous setState before the first await.
  const fetchLead = useCallback(async () => {
    if (!leadId) return
    try {
      const result = await leadStore.get(leadId)
      setLead(result ?? null)
      setError(null)
    } catch (err) {
      console.error('Failed to load lead:', err)
      setError(LOAD_ERROR_MESSAGE)
      setLead(null)
    }
  }, [leadId, leadStore])

  useEffect(() => {
    void fetchLead()
  }, [fetchLead])

  const updateStatus = useCallback(
    async (status: LeadStatus): Promise<boolean> => {
      if (!leadId) return false
      try {
        const updated = await leadStore.updateStatus(leadId, status)
        if (!updated) {
          setError('That request could not be found.')
          return false
        }
        setLead(updated)
        return true
      } catch (err) {
        console.error('Failed to update lead status:', err)
        setError(UPDATE_ERROR_MESSAGE)
        return false
      }
    },
    [leadId, leadStore],
  )

  return { lead, isLoading: lead === undefined, error, refresh: fetchLead, updateStatus }
}
