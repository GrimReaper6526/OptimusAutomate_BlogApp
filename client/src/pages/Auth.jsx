import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles, Users, BookOpen, Zap } from 'lucide-react'
import LoginForm from '../components/auth/LoginForm.jsx'
import RegisterForm from '../components/auth/RegisterForm.jsx'
import { useAuth } from '../hooks/useAuth.js'

const FEATURES = [
  { icon: BookOpen, title: 'Rich Editing', desc: 'Full-featured editor with media support' },
  { icon: Users, title: 'Build Audience', desc: 'Grow followers and track engagement' },
  { icon: Zap, title: 'Instant Deploy', desc: 'Publish anywhere in seconds' },
  { icon: Sparkles, title: 'AI Assisted', desc: 'Smart suggestions and auto-drafts' },
]

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const navigate = useNavigate()
  const { setAuth, isAuthenticated } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const handleSuccess = (data) => {
    if (data?.accessToken) {
      setAuth(data.accessToken, data.user)
    }
    navigate('/')
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[var(--bg-page)]">
      {/* ── Left brand panel ─────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden border-r border-[var(--border-default)] bg-[var(--bg-subtle)]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline z-10">
          <div className="w-9 h-9 rounded-md flex items-center justify-center">
            <svg className="w-7 h-7 text-[var(--accent-primary)]" viewBox="0 0 24 24" fill="none">
              <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-semibold text-lg text-[var(--text-primary)]">BlogFlow</span>
        </Link>

        {/* Center copy */}
        <div className="z-10 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--accent-subtle)] border border-transparent text-[var(--accent-text)] text-xs font-semibold mb-5">
              <Sparkles size={11} />
              The modern blogging platform
            </div>
            <h1 className="text-3xl xl:text-4xl font-semibold text-[var(--text-primary)] leading-tight tracking-tight">
              Your ideas, <span className="text-[var(--accent-primary)]">amplified.</span>
            </h1>
            <p className="mt-4 text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm">
              The premier publishing platform built for creators, developers, and teams who value quality writing.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-4 rounded-md bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-colors duration-150"
              >
                <div className="w-8 h-8 rounded-md bg-[var(--accent-subtle)] text-[var(--accent-text)] flex items-center justify-center mb-2.5">
                  <Icon size={14} />
                </div>
                <p className="text-xs font-bold text-[var(--text-primary)] mb-0.5">{title}</p>
                <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="z-10 p-4 rounded-md bg-[var(--surface-raised)] border border-[var(--border-default)] max-w-sm">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic mb-3">
            "BlogFlow transformed how I share ideas. The editor is a joy to use and my readership has tripled."
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-xs font-bold">S</div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">Umar Shabbir</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Software Engineer · 1k followers</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right auth panel ──────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-y-auto">
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 no-underline mb-8 lg:hidden">
          <svg className="w-6 h-6 text-[var(--accent-primary)]" viewBox="0 0 24 24" fill="none">
            <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold text-lg text-[var(--text-primary)]">BlogFlow</span>
        </Link>

        {/* Form Card */}
        <div className="w-full max-w-[420px] bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-md p-8 shadow-[var(--shadow-lg)] animate-fade-in">
          {/* Tab switcher */}
          <div className="flex items-center gap-1 p-1 rounded-md bg-[var(--bg-muted)] border border-[var(--border-default)] mb-6">
            {['login', 'register'].map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 cursor-pointer border-none capitalize ${
                  mode === tab
                    ? 'bg-[var(--surface-raised)] border border-[var(--border-default)] text-[var(--text-primary)] shadow-sm'
                    : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <LoginForm onSuccess={handleSuccess} switchToRegister={() => setMode('register')} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} switchToLogin={() => setMode('login')} />
          )}
        </div>

        {/* Footer */}
        <p className="text-[10px] text-[var(--text-tertiary)] mt-6 text-center max-w-xs">
          By continuing, you agree to BlogFlow's{' '}
          <span className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors">Terms of Service</span>
          {' '}and{' '}
          <span className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
