import type { ReceptionistCollectedInfo } from '../../types'
import { isValidEmail, isValidName, isValidPhone, isValidPostcode } from './validation'

const NAME_PATTERNS = [
  /\bmy name is ([A-Za-z][A-Za-z'-]{1,20})/i,
  /\bthis is ([A-Za-z][A-Za-z'-]{1,20})\b/i,
  /\bi'?m ([A-Za-z][A-Za-z'-]{1,20})\b/i,
  /\bi am ([A-Za-z][A-Za-z'-]{1,20})\b/i,
]

// Words that commonly follow "I'm"/"I am" but aren't a name ("I'm not sure").
const NAME_STOPWORDS = new Set([
  'not',
  'just',
  'trying',
  'having',
  'looking',
  'calling',
  'still',
  'also',
  'currently',
  'fine',
  'ok',
  'okay',
  'good',
  'sure',
  'unsure',
  'sorry',
  'worried',
  'concerned',
  'afraid',
  'here',
])

export function extractName(text: string): string | undefined {
  for (const pattern of NAME_PATTERNS) {
    const match = text.match(pattern)
    const candidate = match?.[1]?.trim()
    if (!candidate) continue
    if (NAME_STOPWORDS.has(candidate.toLowerCase())) continue
    if (isValidName(candidate)) return candidate
  }
  return undefined
}

export function extractPostcode(text: string): string | undefined {
  const cueMatch = text.match(/post\s?code\s*(?:is|:)?\s*([A-Za-z0-9][A-Za-z0-9\s-]{1,9})/i)
  const cueCandidate = cueMatch?.[1]?.trim()
  if (cueCandidate && isValidPostcode(cueCandidate)) return cueCandidate.toUpperCase()

  const cueRegex = /\b(?:in|at|near)\s+([A-Za-z0-9]{2,8})\b/gi
  for (const match of text.matchAll(cueRegex)) {
    const candidate = match[1]
    if (candidate && /\d/.test(candidate) && isValidPostcode(candidate)) {
      return candidate.toUpperCase()
    }
  }

  const zipMatch = text.match(/\b\d{4,6}\b/)
  if (zipMatch && isValidPostcode(zipMatch[0])) return zipMatch[0]

  return undefined
}

export function extractPhone(text: string): string | undefined {
  const matches = text.match(/\+?[\d()\-\s]{7,20}\d/g)
  if (!matches) return undefined
  for (const candidate of matches) {
    const trimmed = candidate.trim()
    if (isValidPhone(trimmed)) return trimmed
  }
  return undefined
}

export function extractEmail(text: string): string | undefined {
  const match = text.match(/[^\s<>()]+@[^\s<>()]+\.[^\s<>()]+/)
  if (!match) return undefined
  const candidate = match[0].replace(/[.,;:!?]+$/, '')
  return isValidEmail(candidate) ? candidate : undefined
}

export function extractEquipmentType(text: string): string | undefined {
  if (/\bboiler\b/i.test(text)) return 'Boiler'
  if (/\bheating\b|\bradiator\b/i.test(text)) return 'Central heating system'
  if (/\bair ?con(ditioning)?\b|\ba\/c\b|\bac\b/i.test(text)) return 'Air conditioning unit'
  if (/\bimmersion\b|\bcylinder\b|\bhot water tank\b/i.test(text)) return 'Hot water cylinder'
  return undefined
}

/** Runs every opportunistic extractor over a single message. */
export function extractInformation(text: string): Partial<ReceptionistCollectedInfo> {
  const result: Partial<ReceptionistCollectedInfo> = {}
  const postcode = extractPostcode(text)
  if (postcode) result.postcode = postcode
  const phone = extractPhone(text)
  if (phone) result.phone = phone
  const email = extractEmail(text)
  if (email) result.email = email
  const equipmentType = extractEquipmentType(text)
  if (equipmentType) result.equipmentType = equipmentType
  const customerName = extractName(text)
  if (customerName) result.customerName = customerName
  return result
}
