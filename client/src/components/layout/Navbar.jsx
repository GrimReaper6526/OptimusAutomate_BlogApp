import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { PenSquare, Search, Menu, X, LogOut, User as UserIcon, Bell, Bookmark, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { authService } from '../../services/authService.js'
import { applyTheme } from '../../services/themeService.js'
import Avatar from '../ui/Avatar.jsx'
import Button from '../ui/Button.jsx'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, isAuthenticated, clearAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {
      /* ignore */
    }
    clearAuth()
    navigate('/')
  }

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/create', label: 'Content' },
    { path: '/search', label: 'Explore' },
    { path: '/bookmarks', label: 'Bookmarks' },
    { path: '/settings', label: 'Settings' }
  ]

  return (
    <nav className="sticky top-0 z-50 h-14 border-b border-[var(--border-default)] bg-[var(--bg-page)] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <svg className="w-5 h-5 text-[var(--accent-primary)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-semibold text-base tracking-tight text-[var(--text-primary)] hover:opacity-90 transition-opacity">BlogFlow</span>
          </Link>

          {/* Centered Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`py-1 text-sm font-medium transition-colors no-underline ${
                    isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Search, Notifications & Actions */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
            {/* Search Input Box */}
            <div className="relative w-48 lg:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--text-secondary)]">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search..."
                onClick={() => navigate('/search')}
                className="w-full bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-md py-1.5 pl-8 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--border-focus)] transition-colors cursor-pointer"
                readOnly
              />
            </div>

            {/* Notification Bell */}
            <button className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer border-none bg-transparent relative outline-none">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer border-none bg-transparent outline-none"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* User Dropdown / Sign in */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-0.5 rounded-full hover:bg-[var(--bg-subtle)] transition-colors outline-none cursor-pointer border-none bg-transparent"
                  title={user?.username || ''}
                >
                  <Avatar src={user?.avatar} name={user?.username} size="sm" />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-md bg-[var(--surface-overlay)] border border-[var(--border-default)] shadow-lg py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-[var(--border-default)]">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.username}</p>
                        <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to={`/profile/${user?.username}`}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] no-underline transition-colors"
                        >
                          <UserIcon size={14} />
                          My Profile
                        </Link>
                        <Link
                          to="/bookmarks"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] no-underline transition-colors"
                        >
                          <Bookmark size={14} />
                          Bookmarks
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] no-underline transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </Link>
                        <Link
                          to="/create"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] no-underline transition-colors"
                        >
                          <PenSquare size={14} />
                          Write a post
                        </Link>
                      </div>
                      <div className="border-t border-[var(--border-default)] pt-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false)
                            handleLogout()
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[var(--error-text)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer border-none bg-transparent"
                        >
                          <LogOut size={14} />
                          Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/auth" className="no-underline">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer border-none bg-transparent"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 z-50 bg-[var(--surface-overlay)] border-b border-[var(--border-default)] animate-fade-in shadow-md">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors no-underline"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/search"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors no-underline"
            >
              <Search size={16} /> Search
            </Link>
            {/* Mobile Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme()
                setMobileOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors border-none bg-transparent text-left cursor-pointer w-full"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Toggle Theme
            </button>
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors no-underline"
                >
                  <PenSquare size={16} /> Write a post
                </Link>
                <Link
                  to={`/profile/${user?.username || ''}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors no-underline"
                >
                  <UserIcon size={16} /> Profile
                </Link>
                <Link
                  to="/bookmarks"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors no-underline"
                >
                  <Bookmark size={16} /> Bookmarks
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    handleLogout()
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-[var(--error-text)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer border-none bg-transparent text-left w-full"
                >
                  <LogOut size={16} /> Log out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2 rounded-md text-sm font-medium no-underline text-center border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
