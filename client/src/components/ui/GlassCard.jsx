export default function GlassCard({ children, className = '', hover = false, ...props }) {
  const hoverClasses = hover
    ? 'hover:-translate-y-[1px] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] cursor-pointer'
    : ''

  return (
    <div
      className={`glass-card p-6 transition-all duration-150 ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
