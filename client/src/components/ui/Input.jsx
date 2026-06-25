import { forwardRef } from 'react'

/**
 * Styled form input — clean design system aesthetic.
 */
const Input = forwardRef(function Input(
  { label, error, type = 'text', className = '', style, ...props },
  ref
) {
  const inputClasses = `
    w-full px-3 py-2
    text-sm text-[var(--text-primary)]
    bg-[var(--bg-page)]
    border rounded-md shadow-sm
    placeholder:text-[var(--text-tertiary)]
    hover:border-[var(--border-strong)]
    focus:outline-none focus:border-[var(--border-focus)]
    focus:ring-2 focus:ring-[var(--accent-primary)]/20
    transition-colors duration-150
    disabled:bg-[var(--bg-muted)] disabled:cursor-not-allowed
    ${error ? 'border-[var(--error-icon)] focus:border-[var(--error-icon)]' : 'border-[var(--border-default)]'}
  `

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} style={style}>
      {label && (
        <label
          className="text-sm font-medium text-[var(--text-primary)]"
          htmlFor={props.id || props.name}
        >
          {label}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          ref={ref}
          rows={5}
          className={inputClasses}
          {...props}
        />
      ) : (
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
      )}
      {error && (
        <p className="text-xs text-[var(--error-text)]">{error}</p>
      )}
    </div>
  )
})

export default Input
