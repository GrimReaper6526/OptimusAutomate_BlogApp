import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit3, Trash2, Share2, Clock, Eye, MessageCircle, Bookmark } from 'lucide-react'
import PostDetail from '../components/blog/PostDetail.jsx'
import CommentSection from '../components/blog/CommentSection.jsx'
import LikeButton from '../components/blog/LikeButton.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Badge from '../components/ui/Badge.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { usePost, useDeletePost } from '../hooks/usePosts.js'
import { formatDate } from '../utils/formatDate.js'
import { useBookmarkStore } from '../store/bookmarkStore.js'
import toast from 'react-hot-toast'

export default function PostPage() {
  const { slugOrId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { data: post, isLoading, error } = usePost(slugOrId)
  const deletePost = useDeletePost()
  const { isBookmarked, toggleBookmark } = useBookmarkStore()

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={40} />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="glass-card p-12 text-center max-w-lg mx-auto">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Post not found</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {error?.response?.data?.error || 'This post may have been deleted or doesn\'t exist.'}
        </p>
        <Link to="/" className="text-[var(--accent-primary)] hover:underline text-sm">
          ← Back to feed
        </Link>
      </div>
    )
  }

  const isOwner = isAuthenticated && post.author?._id === user?.id

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return
    try {
      await deletePost.mutateAsync(post._id)
      toast.success('Post deleted')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete post')
    }
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6 group cursor-pointer border-none bg-transparent"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <PostDetail post={post} />

      {/* Action bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 py-4 mb-6 border-t border-b border-[var(--border-default)]">
        <div className="flex items-center gap-4">
          <LikeButton
            postId={post._id}
            initialLiked={post.likes?.includes(user?.id)}
            initialCount={post.likes?.length || 0}
          />
          <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
            <MessageCircle size={16} /> {post.commentCount || 0} comments
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer border-none bg-transparent"
            title="Copy link"
          >
            <Share2 size={16} />
          </button>

          <button
            onClick={() => {
              const added = toggleBookmark(post)
              toast.success(added ? 'Saved to bookmarks 🔖' : 'Removed from bookmarks')
            }}
            className={`p-2 rounded-lg transition-all cursor-pointer border-none bg-transparent ${
              isBookmarked(post._id)
                ? 'text-[var(--accent-text)] bg-[var(--accent-subtle)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
            title={isBookmarked(post._id) ? 'Remove bookmark' : 'Save post'}
          >
            <Bookmark size={16} fill={isBookmarked(post._id) ? 'currentColor' : 'none'} />
          </button>

          {isOwner && (
            <>
              <Link
                to={`/edit/${post._id}`}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-subtle)] transition-all"
                title="Edit"
              >
                <Edit3 size={16} />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--error-text)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer border-none bg-transparent"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Author card */}
      <div className="glass-card p-4 flex items-center gap-3 mb-8">
        <Avatar src={post.author?.avatar} name={post.author?.username} size="md" />
        <div>
          <Link
            to={`/profile/${post.author?.username}`}
            className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors no-underline"
          >
            {post.author?.username}
          </Link>
          {post.author?.bio && (
            <p className="text-xs text-[var(--text-secondary)]">{post.author.bio}</p>
          )}
        </div>
      </div>

      {/* Comments */}
      <CommentSection postId={post._id} />
    </div>
  )
}
