import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverted'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950 focus-visible:ring-neutral-900/40 focus-visible:ring-offset-white',
  secondary:
    'bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:ring-neutral-900/40 focus-visible:ring-offset-white',
  ghost:
    'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-900/40 focus-visible:ring-offset-white',
  // Used on the dark closing-CTA section — needs a light ring visible
  // against that dark background instead of the default dark ring.
  inverted:
    'bg-white text-neutral-900 hover:bg-neutral-200 focus-visible:ring-white/60 focus-visible:ring-offset-neutral-900',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
