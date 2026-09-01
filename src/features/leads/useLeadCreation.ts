import { useCallback, useEffect, useRef, useState } from 'react'
import { LocalStorageLeadStore } from '../../services/storage/LocalStorageLeadStore'
import type { Lead, ReceptionistState } from '../../types'
import { createLeadFromReceptionistState } from './createLeadFromReceptionistState'

export type LeadCreationStatus = 'idle' | 'creating' | 'success' | 'error'
type LeadCreationPhase = 'idle' | 'pending' | 'done'

/**
 * Pure decision logic, kept separate from the hook so duplicate-prevention
 * can be unit tested without rendering React. A creation attempt should
 * only start once per completed conversation: not on every re-render, not
 * while one is already in flight, and not again once a lead already exists
 * for this state.
 */
export function shouldAttemptLeadCreation(
  isComplete: boolean,
  existingLeadId: string | undefined,
  phase: LeadCreationPhase,
): boolean {
  return isComplete && !existingLeadId && phase === 'idle'
}

const GENERIC_ERROR_MESSAGE = "We couldn't save your request. Please try again."

interface UseLeadCreationResult {
  status: LeadCreationStatus
  lead: Lead | null
  errorMessage: string | null
  retry: () => void
}

/**
 * Watches a receptionist conversation and, exactly once per completion,
 * derives a Lead and persists it via LeadStore. Resets automatically when
 * the conversation is reset (isComplete goes back to false).
 */
export function useLeadCreation(
  receptionistState: ReceptionistState,
  onLeadCreated: (leadId: string) => void,
): UseLeadCreationResult {
  const [leadStore] = useState(() => new LocalStorageLeadStore())
  const [status, setStatus] = useState<LeadCreationStatus>('idle')
  const [lead, setLead] = useState<Lead | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // Ref, not state: mutations here must be visible synchronously (including
  // across React StrictMode's double-invoked effects) to reliably prevent a
  // second attempt starting before the first has updated state.
  const phaseRef = useRef<LeadCreationPhase>('idle')

  // A reset conversation (isComplete flips back to false) should clear any
  // previous creation result so a later completion can create a new lead.
  // Adjusting state during render (React's recommended pattern for
  // resetting state when a prop changes) instead of in an effect, so it
  // takes effect before paint rather than triggering an extra render pass.
  // The ref itself is mutated separately below, in an effect — refs must
  // never be written during render.
  const [trackedIsComplete, setTrackedIsComplete] = useState(receptionistState.isComplete)
  if (receptionistState.isComplete !== trackedIsComplete) {
    setTrackedIsComplete(receptionistState.isComplete)
    if (!receptionistState.isComplete) {
      setStatus('idle')
      setLead(null)
      setErrorMessage(null)
    }
  }

  useEffect(() => {
    if (!receptionistState.isComplete) {
      phaseRef.current = 'idle'
    }
  }, [receptionistState.isComplete])

  const attemptCreate = useCallback(() => {
    if (phaseRef.current === 'pending') return
    phaseRef.current = 'pending'
    setStatus('creating')
    setErrorMessage(null)

    void (async () => {
      try {
        const newLead = createLeadFromReceptionistState(receptionistState)
        await leadStore.create(newLead)
        phaseRef.current = 'done'
        setLead(newLead)
        setStatus('success')
        onLeadCreated(newLead.id)
      } catch (error) {
        phaseRef.current = 'idle'
        console.error('Lead creation failed:', error)
        setStatus('error')
        setErrorMessage(GENERIC_ERROR_MESSAGE)
      }
    })()
  }, [receptionistState, leadStore, onLeadCreated])

  useEffect(() => {
    if (shouldAttemptLeadCreation(receptionistState.isComplete, receptionistState.leadId, phaseRef.current)) {
      attemptCreate()
    }
  }, [receptionistState.isComplete, receptionistState.leadId, attemptCreate])

  return { status, lead, errorMessage, retry: attemptCreate }
}
