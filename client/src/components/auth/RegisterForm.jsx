import { useState } from 'react'
import { Eye, EyeOff, Github, ArrowRight, Check } from 'lucide-react'
import { authService } from '../../services/authService.js'

export default function RegisterForm({ onSuccess, switchToLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordStrength = () => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++
    return score
  }

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['', 'bg-[var(--error-icon)]', 'bg-[var(--warning-icon)]', 'bg-[var(--info-icon)]', 'bg-[var(--success-icon)]']
  const strength = passwordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers and underscores')
      return
    }
    setLoading(true)
    try {
      const data = await authService.register({ username, email, password })
      onSuccess(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = `
    w-full h-10 px-3 rounded-md text-sm text-[var(--text-primary)]
    bg-[var(--bg-page)] border border-[var(--border-default)] shadow-sm
    placeholder:text-[var(--text-tertiary)] hover:border-[var(--border-strong)]
    focus:outline-none focus:border-[var(--border-focus)]
    focus:ring-2 focus:ring-[var(--accent-primary)]/20
    transition-colors duration-150
  `

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Heading */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">Create your account</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Start your writing journey today</p>
      </div>

      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Username
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-sm font-medium pointer-events-none">
            @
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_handle"
            required
            className={`${inputClasses} pl-7`}
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className={inputClasses}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            required
            className={`${inputClasses} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer border-none bg-transparent"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {/* Strength bar */}
        {password && (
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-150 ${
                    i <= strength ? strengthColors[strength] : 'bg-[var(--bg-emphasis)]'
                  }`}
                />
              ))}
            </div>
            <span className={`text-[10px] font-semibold ${
              strength <= 1 ? 'text-[var(--error-text)]' : strength === 2 ? 'text-[var(--warning-text)]' : strength === 3 ? 'text-[var(--info-text)]' : 'text-[var(--success-text)]'
            }`}>
              {strengthLabels[strength]}
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--error-bg)] border border-[var(--error-border)] text-xs text-[var(--error-text)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--error-icon)] flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 rounded-md bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium shadow-sm transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border border-transparent"
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <>Create Account <ArrowRight size={14} /></>
        )}
      </button>

      {/* Free tag */}
      <div className="flex items-center justify-center gap-1.5 -mt-2">
        <Check size={11} className="text-[var(--success-icon)]" strokeWidth={3} />
        <span className="text-[10px] text-[var(--text-secondary)]">Free forever · No credit card required</span>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--border-default)]" />
        <span className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase tracking-wider">or sign up with</span>
        <div className="flex-1 h-px bg-[var(--border-default)]" />
      </div>

      {/* OAuth */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 h-10 rounded-md bg-[var(--bg-page)] border border-[var(--border-default)] text-[var(--text-primary)] text-xs font-semibold hover:bg-[var(--bg-subtle)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
        >
          <Github size={14} />
          GitHub
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 h-10 rounded-md bg-[var(--bg-page)] border border-[var(--border-default)] text-[var(--text-primary)] text-xs font-semibold hover:bg-[var(--bg-subtle)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
      </div>

      {/* Switch */}
      <p className="text-sm text-center text-[var(--text-secondary)] mt-2">
        Already have an account?{' '}
        <button
          type="button"
          onClick={switchToLogin}
          className="text-[var(--text-link)] hover:underline font-semibold transition-colors cursor-pointer border-none bg-transparent"
        >
          Sign in →
        </button>
      </p>
    </form>
  )
}
