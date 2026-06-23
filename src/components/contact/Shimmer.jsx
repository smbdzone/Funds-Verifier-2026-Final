/**
 * Reusable shimmer block for skeleton loaders.
 */
export function Shimmer({ className = '', variant = 'default' }) {
  const base =
    variant === 'gold'
      ? 'fv-shimmer-gold'
      : variant === 'light'
        ? 'fv-shimmer-light'
        : 'fv-shimmer'
  return (
    <div
      className={`rounded-lg ${base} ${className}`}
      aria-hidden='true'
    />
  )
}

export function ShimmerLine({ className = '', variant = 'default' }) {
  return <Shimmer className={`h-3 ${className}`} variant={variant} />
}
