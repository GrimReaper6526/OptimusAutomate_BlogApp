import { Link } from 'react-router-dom'
import { Heart, Bookmark } from 'lucide-react'
import { fromNow } from '../../utils/formatDate.js'
import Avatar from '../ui/Avatar.jsx'
import { useBookmarkStore } from '../../store/bookmarkStore.js'
import toast from 'react-hot-toast'

export default function PostCard({ post }) {
  const { isBookmarked, toggleBookmark } = useBookmarkStore()
  const saved = isBookmarked(post._id)

  const handleBookmark = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const added = toggleBookmark(post)
    toast.success(added ? 'Saved to bookmarks' : 'Removed from bookmarks', {
      icon: added ? '🔖' : '✓',
    })
  }

  return (
    <article
      className="group rounded-md overflow-hidden cursor-pointer bg-[var(--surface-raised)] border border-[var(--border-default)] shadow-[var(--shadow-sm)] hover:-translate-y-[2px] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] transition-all duration-150 flex flex-col h-full"
    >
      {/* Inset cover image */}
      <div className="p-3 pb-0 flex-shrink-0">
        {post.coverImage?.url ? (
          <div className="relative h-40 overflow-hidden rounded-md bg-[var(--bg-muted)] border border-[var(--border-default)]">
            <img
              src={post.coverImage.url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="h-40 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-md flex items-center justify-center">
            <span className="text-[var(--text-tertiary)] font-bold text-lg select-none">BlogFlow</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category tag */}
        <div className="mb-2">
          <span className="text-[10px] font-bold tracking-wider text-[var(--accent-text)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded uppercase">
            {post.category || 'Technology'}
          </span>
        </div>

        {/* Title */}
        <Link to={`/post/${post.slug}`} className="no-underline block mb-2">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 hover:text-[var(--accent-primary)] transition-colors leading-snug">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Author & Stats footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-default)] mt-auto">
          <div className="flex items-center gap-2">
            <Avatar
              src={post.author?.avatar}
              name={post.author?.username}
              size="sm"
              className="w-6 h-6"
            />
            <div className="flex flex-col text-[10px]">
              <span className="font-semibold text-[var(--text-primary)] leading-none mb-0.5">
                {post.author?.username}
              </span>
              <span className="text-[var(--text-secondary)] leading-none">
                {post.readingTime || 1} min read • {fromNow(post.createdAt)}
              </span>
            </div>
          </div>

          {/* Likes + Bookmark */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
              <Heart size={11} className="text-[var(--error-icon)]" fill="currentColor" />
              <span>{post.likes?.length || 0}</span>
            </div>
            <button
              onClick={handleBookmark}
              title={saved ? 'Remove bookmark' : 'Save post'}
              className={`p-1 rounded-md transition-colors duration-150 cursor-pointer border-none bg-transparent ${
                saved
                  ? 'text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'
              }`}
            >
              <Bookmark
                size={12}
                fill={saved ? 'currentColor' : 'none'}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
