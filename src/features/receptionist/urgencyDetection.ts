import type { LeadPriority } from '../../types'

export type EmergencyCategory = 'gas' | 'fire' | 'flooding' | 'general'

const GAS_PATTERNS = [
  /smell.*gas/i,
  /gas.*smell/i,
  /gas leak/i,
  /carbon monoxide/i,
  /\bco\b.*(alarm|detector)/i,
  /rotten egg/i,
]

const FIRE_PATTERNS = [/\bsmoke\b/i, /\bfire\b/i, /spark(ing)?/i, /burning smell/i]

const FLOODING_PATTERNS = [/severe flooding/i, /flooding badly/i, /water everywhere/i, /burst pipe/i]

const HIGH_PATTERNS = [
  /no heating/i,
  /no heat\b/i,
  /without heating/i,
  /no hot water/i,
  /without hot water/i,
  /complete(ly)? (boiler )?failure/i,
  /boiler.*(completely|totally|not working at all)/i,
  /major leak/i,
  /\bvulnerable\b/i,
  /\belderly\b/i,
  /(new ?born|baby|infant)/i,
]

/** Returns the emergency category detected in this message, or null if none. */
export function detectEmergencyCategory(text: string): EmergencyCategory | null {
  if (GAS_PATTERNS.some((pattern) => pattern.test(text))) return 'gas'
  if (FIRE_PATTERNS.some((pattern) => pattern.test(text))) return 'fire'
  if (FLOODING_PATTERNS.some((pattern) => pattern.test(text))) return 'flooding'
  return null
}

/** Priority signalled by this single message, or undefined if nothing stood out. */
export function detectPriority(text: string): LeadPriority | undefined {
  if (detectEmergencyCategory(text)) return 'emergency'
  if (HIGH_PATTERNS.some((pattern) => pattern.test(text))) return 'high'
  return undefined
}

const PRIORITY_RANK: Record<LeadPriority, number> = { normal: 0, high: 1, emergency: 2 }

/** Priority only ever escalates across a conversation, never downgrades. */
export function mergePriority(
  existing: LeadPriority | undefined,
  detected: LeadPriority | undefined,
): LeadPriority {
  const current = existing ?? 'normal'
  if (!detected) return current
  return PRIORITY_RANK[detected] > PRIORITY_RANK[current] ? detected : current
}
