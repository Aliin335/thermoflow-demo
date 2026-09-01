import type { IssueType } from '../../types'

const QUOTE_PATTERNS = [/\bquote\b/i, /\bestimate\b/i, /how much (would|does|will|is)/i, /\bpricing\b/i]

const BOOKING_PATTERNS = [
  /\bbook\b/i,
  /\bappointment\b/i,
  /schedule a/i,
  /arrange a visit/i,
  /set up a (time|visit)/i,
]

const SERVICE_PATTERNS = [/service/i, /maintenance/i, /annual check/i, /checkup/i, /tune.?up/i]

const BOILER_PATTERNS = [/\bboiler\b/i]

const HEATING_PATTERNS = [
  /no heating/i,
  /not heating/i,
  /without heating/i,
  /no heat\b/i,
  /heating.*(stopped|broken|not working|isn'?t working|out|down|problem|issue)/i,
  /\bradiator\b/i,
  /\bcentral heating\b/i,
]

const HOT_WATER_PATTERNS = [
  /no hot water/i,
  /without hot water/i,
  /hot water.*(stopped|broken|not working|isn'?t working|out|problem|issue)/i,
]

const AC_PATTERNS = [/\bair con\b/i, /\bair conditioning\b/i, /\baircon\b/i, /\ba\/c\b/i, /\bac\b/i]

function matchesAny(patterns: RegExp[], text: string): boolean {
  return patterns.some((pattern) => pattern.test(text))
}

/**
 * Deterministic keyword-based intent classification. Order matters: explicit
 * requests (quote/booking/service) take precedence over equipment mentions,
 * and named equipment ("boiler") takes precedence over generic symptom
 * phrasing ("no heating") since it's more specific.
 */
export function detectIntent(text: string): IssueType {
  if (matchesAny(QUOTE_PATTERNS, text)) return 'quote'
  if (matchesAny(BOOKING_PATTERNS, text)) return 'booking'
  if (matchesAny(SERVICE_PATTERNS, text)) return 'service'
  if (matchesAny(BOILER_PATTERNS, text)) return 'boiler'
  if (matchesAny(HEATING_PATTERNS, text)) return 'heating'
  if (matchesAny(HOT_WATER_PATTERNS, text)) return 'hot-water'
  if (matchesAny(AC_PATTERNS, text)) return 'air-conditioning'
  return 'other'
}

export function hasChangeOfMindCue(text: string): boolean {
  return /\bactually\b|\binstead\b|never ?mind|change my mind|forget (that|what i said)/i.test(text)
}
