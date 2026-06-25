import { Link } from 'react-router-dom'
import { Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border-default)] bg-[var(--bg-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center gap-6 text-sm text-[var(--text-secondary)]">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 font-medium text-[var(--text-secondary)]">
          <Link to="/" className="hover:text-[var(--text-primary)] transition-colors no-underline">Dashboard</Link>
          <Link to="/create" className="hover:text-[var(--text-primary)] transition-colors no-underline">Content</Link>
          <Link to="/settings" className="hover:text-[var(--text-primary)] transition-colors no-underline">Analytics</Link>
          <Link to="/search" className="hover:text-[var(--text-primary)] transition-colors no-underline">Authors</Link>
          <Link to="/settings" className="hover:text-[var(--text-primary)] transition-colors no-underline">Settings</Link>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-5 text-[var(--text-secondary)]">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-colors">
            <Twitter size={16} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-colors">
            <Github size={16} />
          </a>
        </div>

        {/* Logo and Copyright */}
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--accent-primary)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-semibold text-[var(--text-primary)] tracking-tight">BlogFlow</span>
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">© 2026 BlogFlow Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
