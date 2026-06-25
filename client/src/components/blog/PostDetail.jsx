import DOMPurify from 'dompurify'
import Badge from '../ui/Badge.jsx'
import Avatar from '../ui/Avatar.jsx'

/**
 * Renders a post's HTML content — sanitized with DOMPurify to prevent XSS (§2.3).
 * Never use dangerouslySetInnerHTML without sanitization.
 */
export default function PostDetail({ post }) {
  if (!post) return null

  const safeHTML = DOMPurify.sanitize(post.content || '', {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  })

  return (
    <div className="animate-fade-in">
      {/* Cover image */}
      {post.coverImage?.url && (
        <div className="relative rounded-md overflow-hidden mb-6 max-h-[420px] border border-[var(--border-default)]">
          <img
            src={post.coverImage.url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <Badge tone="accent">{post.category}</Badge>
          <span className="text-xs text-[var(--text-secondary)]">{post.readingTime} min read</span>
          <span className="text-xs text-[var(--text-secondary)]">{post.views || 0} views</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3">
          <Avatar
            src={post.author?.avatar}
            name={post.author?.username}
            size="md"
          />
          <div>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {post.author?.username}
            </span>
            {post.author?.bio && (
              <p className="text-xs text-[var(--text-secondary)]">{post.author.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-default)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Body — sanitized HTML */}
      <div
        className="prose-blog mb-8"
        dangerouslySetInnerHTML={{ __html: safeHTML }}
      />
    </div>
  )
}
