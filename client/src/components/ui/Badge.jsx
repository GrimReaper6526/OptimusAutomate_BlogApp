export default function Badge({ children, tone = 'neutral', className = '', ...props }) {
  const styles = {
    neutral: 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-default)]',
    success: 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]',
    warning: 'bg-[var(--warning-bg)] text-[var(--warning-text)] border border-[var(--warning-border)]',
    danger:   'bg-[var(--error-bg)]   text-[var(--error-text)]   border border-[var(--error-border)]',
    error:    'bg-[var(--error-bg)]   text-[var(--error-text)]   border border-[var(--error-border)]',
    info:    'bg-[var(--info-bg)]    text-[var(--info-text)]    border border-[var(--info-border)]',
    cyan:    'bg-[var(--info-bg)]    text-[var(--info-text)]    border border-[var(--info-border)]',
    accent:  'bg-[var(--accent-subtle)] text-[var(--accent-text)] border border-transparent',
    indigo:  'bg-[var(--accent-subtle)] text-[var(--accent-text)] border border-transparent',
  }

  const styleClass = styles[tone] || styles.neutral

  return (
    <span className={`
      inline-flex items-center gap-1
      px-2 py-0.5
      text-xs font-semibold
      rounded-md
      ${styleClass}
      ${className}
    `} {...props}>
      {children}
    </span>
  )
}
