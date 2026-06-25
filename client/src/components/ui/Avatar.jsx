const SIZE = { sm: 24, md: 32, lg: 48, xl: 96 }

const fallback = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || 'user')}&backgroundColor=b6e3f4,c0aede,d1f4d6`

export default function Avatar({ src, name = 'user', size = 'md', className = '', ...props }) {
  const px = SIZE[size] || SIZE.md
  return (
    <img
      src={src || fallback(name)}
      alt={name}
      width={px}
      height={px}
      className={`rounded-full object-cover border border-[var(--border-default)] bg-[var(--bg-muted)] ${className}`}
      style={{
        width: px,
        height: px,
      }}
      onError={(e) => {
        if (!e.currentTarget.dataset.fallback) {
          e.currentTarget.dataset.fallback = '1'
          e.currentTarget.src = fallback(name)
        }
      }}
      {...props}
    />
  )
}
