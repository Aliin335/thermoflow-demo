/** Flexible, country-agnostic: alphanumeric, 2-10 chars, must contain a digit. */
export function isValidPostcode(value: string): boolean {
  const trimmed = value.trim()
  return /^[A-Za-z0-9][A-Za-z0-9\s-]{1,9}$/.test(trimmed) && /\d/.test(trimmed)
}

/** Digits, spaces, +, (), - only; 7-15 digits total. */
export function isValidPhone(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed || !/^[+\d()\-\s]+$/.test(trimmed)) return false
  const digitCount = (trimmed.match(/\d/g) ?? []).length
  return digitCount >= 7 && digitCount <= 15
}

/** Basic shape check, not full RFC 5322 validation. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

export function isValidName(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.length < 2 || trimmed.length > 60) return false
  return /^[A-Za-z][A-Za-z'\s-]*$/.test(trimmed)
}

export function looksLikeUnsureResponse(text: string): boolean {
  return /\b(i )?(don'?t|do not) know\b|not sure|no idea|\bn\/a\b|skip (that|this)?/i.test(text.trim())
}

export function looksLikeQuestion(text: string): boolean {
  const trimmed = text.trim()
  if (trimmed.endsWith('?')) return true
  return /^(what|how|when|where|why|who|can you|could you|do you|does|is it|are you)\b/i.test(trimmed)
}
