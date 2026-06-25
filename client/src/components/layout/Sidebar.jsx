import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Hash, Code, Palette, Briefcase, FlaskConical, Coffee, Bookmark, TrendingUp } from 'lucide-react'
import { useBookmarkStore } from '../../store/bookmarkStore.js'
import { useAuth } from '../../hooks/useAuth.js'
import api from '../../services/api.js'

const CATEGORIES = [
  { value: 'Technology', label: 'Technology', icon: Code },
  { value: 'Design', label: 'Design', icon: Palette },
  { value: 'Business', label: 'Business', icon: Briefcase },
  { value: 'Science', label: 'Science', icon: FlaskConical },
  { value: 'Lifestyle', label: 'Lifestyle', icon: Coffee },
]

const POPULAR_TAGS = ['react', 'ui', 'design', 'tailwind', 'saas', 'startup', 'ai', 'webdev']

export default function Sidebar({ active, onChange }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { bookmarks } = useBookmarkStore()

  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api.get('/auth/authors')
      .then(({ data }) => {
        if (active) {
          setAuthors(data.authors || [])
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch authors:', err)
        if (active) {
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <aside
      className="hidden lg:block w-60 flex-shrink-0 sticky top-24 self-start space-y-8 pr-4"
    >
      {/* Categories Section */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Categories
        </h3>
        <nav className="flex flex-col gap-1">
          <SidebarLink
            active={active === ''}
            onClick={() => onChange?.('')}
            icon={Hash}
            label="All Posts"
          />
          {CATEGORIES.map((cat) => (
            <SidebarLink
              key={cat.value}
              active={active === cat.value}
              onClick={() => onChange?.(cat.value)}
              icon={cat.icon}
              label={cat.label}
            />
          ))}
        </nav>
      </div>

      {/* Bookmarks quick link */}
      {isAuthenticated && (
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Reading List
          </h3>
          <Link
            to="/bookmarks"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] no-underline"
          >
            <Bookmark size={16} />
            Saved Articles
            {bookmarks.length > 0 && (
              <span className="ml-auto text-[10px] bg-[var(--accent-subtle)] text-[var(--accent-text)] font-bold px-1.5 py-0.5 rounded-full">
                {bookmarks.length}
              </span>
            )}
          </Link>
        </div>
      )}

      {/* Popular Tags Section */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => navigate(`/search?search=${tag}`)}
              className="text-[11px] px-2 py-1 rounded-md bg-[var(--bg-muted)] border border-[var(--border-default)] text-[var(--text-secondary)] font-medium cursor-pointer hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors outline-none"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Top Authors Section */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Top Authors
        </h3>
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-[var(--bg-muted)] rounded-md animate-pulse w-3/4" />
              <div className="h-4 bg-[var(--bg-muted)] rounded-md animate-pulse w-1/2" />
            </div>
          ) : (
            authors.map((author) => (
              <Link
                key={author._id || author.username}
                to={`/profile/${author.username}`}
                className="flex items-center gap-2.5 no-underline group"
              >
                <img
                  src={author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={author.username}
                  className="w-7 h-7 rounded-full object-cover border border-[var(--border-default)] group-hover:border-[var(--border-strong)] transition-colors"
                />
                <div className="flex flex-col text-[11px] min-w-0">
                  <span className="font-semibold text-[var(--text-primary)] leading-none mb-0.5 group-hover:text-[var(--accent-primary)] transition-colors truncate">
                    {author.username}
                  </span>
                  <span className="text-[var(--text-secondary)] leading-none truncate">
                    {author.bio || `${author.postsCount || 0} posts · ${author.totalLikes || 0} likes`}
                  </span>
                </div>
              </Link>
            ))
          )}
          {!loading && authors.length === 0 && (
            <span className="text-[11px] text-[var(--text-secondary)]">No registered authors yet.</span>
          )}
        </div>
      </div>

      {/* Trending Section */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
          <TrendingUp size={11} />
          Trending
        </h3>
        <div className="space-y-2.5">
          {[
            'Building Scalable React Apps in 2025',
            'The AI Design Revolution',
            'Zero to SaaS in 30 Days',
          ].map((title, i) => (
            <button
              key={title}
              onClick={() => navigate(`/search?search=${encodeURIComponent(title.split(' ').slice(0, 3).join(' '))}`)}
              className="flex items-start gap-2 w-full text-left cursor-pointer border-none bg-transparent p-0 group"
            >
              <span className="text-[11px] font-bold text-[var(--accent-primary)] pt-0.5 flex-shrink-0 w-4 text-center">
                {i + 1}
              </span>
              <span className="text-[12px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-snug line-clamp-2 font-medium">
                {title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Promo Card */}
      <div className="glass-card p-4">
        <h4 className="text-xs font-bold text-[var(--text-primary)] mb-1">Build with BlogFlow</h4>
        <p className="text-[11px] text-[var(--text-secondary)] mb-3 leading-relaxed">
          The premier modern publishing platform for creative minds and teams.
        </p>
        <Link
          to="/create"
          className="inline-block text-center w-full px-3 py-1.5 rounded-md text-[11px] font-medium bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white transition-colors no-underline cursor-pointer"
        >
          Start Writing →
        </Link>
      </div>
    </aside>
  )
}

function SidebarLink({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 w-full text-left cursor-pointer border-none bg-transparent ${
        active
          ? 'bg-[var(--accent-subtle)] text-[var(--accent-text)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}
