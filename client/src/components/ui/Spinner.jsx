/**
 * Simple CSS spinner — works everywhere, no external deps.
 */
export default function Spinner({ size = 24, className = '' }) {
  return (
    <span
      className={`inline-block rounded-full border-[3px] border-indigo-500/25 border-t-indigo-500 animate-spin ${className}`}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}
