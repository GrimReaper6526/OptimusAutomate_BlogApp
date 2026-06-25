import { forwardRef } from 'react'

/**
 * Standard design system Button component.
 * Variants: primary | outline | ghost | danger.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    ...props
  },
  ref
) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed select-none'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }
  
  const variantClasses = {
    primary: 'bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white border border-transparent shadow-sm',
    outline: 'bg-[var(--bg-page)] hover:bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)]',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-transparent',
    danger: 'bg-[var(--error-icon)] hover:bg-red-600 text-white border border-transparent shadow-sm',
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : children}
    </button>
  )
})

export default Button
