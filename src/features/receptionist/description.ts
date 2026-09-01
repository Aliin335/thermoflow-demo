/**
 * Joins accumulated description fragments so they read as natural, separate
 * sentences instead of one run-on string. Only touches the join point
 * between fragments — never rewrites a fragment's own wording, punctuation,
 * or capitalization, so user meaning is always preserved as typed.
 */
export function appendDescriptionFragment(existing: string | undefined, fragment: string): string {
  const trimmedFragment = fragment.trim()
  const trimmedExisting = existing?.trim()

  if (!trimmedExisting) return trimmedFragment
  if (!trimmedFragment) return trimmedExisting

  const endsWithPunctuation = /[.!?]$/.test(trimmedExisting)
  const separator = endsWithPunctuation ? ' ' : '. '
  return `${trimmedExisting}${separator}${trimmedFragment}`
}
