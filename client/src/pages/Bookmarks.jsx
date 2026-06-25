import { useNavigate } from 'react-router-dom'
import { Bookmark, Trash2, BookOpen } from 'lucide-react'
import PostCard from '../components/blog/PostCard.jsx'
import Button from '../components/ui/Button.jsx'
import { useBookmarkStore } from '../store/bookmarkStore.js'
import { useAuth } from '../hooks/useAuth.js'
import toast from 'react-hot-toast'

export default function Bookmarks() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { bookmarks, clearBookmarks } = useBookmarkStore()

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-12 h-12 rounded-md bg-[var(--accent-subtle)] border border-transparent flex items-center justify-center mb-5 text-[var(--accent-text)]">
          <Bookmark size={24} />
        </div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Sign in to view bookmarks</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm">
          Create an account to start saving your favorite articles and access them anytime.
        </p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    )
  }

  const handleClearAll = () => {
    if (bookmarks.length === 0) return
    if (window.confirm('Remove all bookmarks? This cannot be undone.')) {
      clearBookmarks()
      toast.success('All bookmarks cleared')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[var(--accent-subtle)] border border-transparent flex items-center justify-center text-[var(--accent-text)]">
              <Bookmark size={16} />
            </div>
            Saved Articles
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            {bookmarks.length} article{bookmarks.length !== 1 ? 's' : ''} saved to your reading list
          </p>
        </div>
        {bookmarks.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="flex items-center gap-2 !text-[var(--error-text)] border-[var(--error-border)] hover:bg-[var(--error-bg)]"
          >
            <Trash2 size={12} />
            Clear All
          </Button>
        )}
      </div>

      {/* Empty State */}
      {bookmarks.length === 0 && (
        <div className="glass-card p-16 text-center">
          <div className="w-12 h-12 rounded-md bg-[var(--accent-subtle)] border border-transparent flex items-center justify-center mx-auto mb-5 text-[var(--accent-text)]">
            <BookOpen size={24} />
          </div>
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">No saved articles yet</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-6">
            Click the bookmark icon on any post to save it here for later reading.
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Browse Articles
          </Button>
        </div>
      )}

      {/* Bookmarks Grid */}
      {bookmarks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {bookmarks.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
