import { useState } from 'react'
import { Heart, MessageCircle, Trash2, Reply } from 'lucide-react'
import { fromNow } from '../../utils/formatDate.js'
import Avatar from '../ui/Avatar.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { commentService } from '../../services/commentService.js'
import toast from 'react-hot-toast'

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const { isAuthenticated } = useAuth()

  const loadComments = async () => {
    if (loaded) return
    try {
      const data = await commentService.list(postId)
      setComments(data.comments)
      setLoaded(true)
    } catch {
      toast.error('Failed to load comments')
    }
  }

  // Auto-load on mount
  if (!loaded) loadComments()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      const comment = await commentService.create(postId, { content: newComment.trim() })
      setComments((prev) => [...prev, comment])
      setNewComment('')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post comment')
    }
  }

  const handleReply = async (parentCommentId) => {
    if (!replyText.trim()) return
    try {
      const comment = await commentService.create(postId, {
        content: replyText.trim(),
        parent: parentCommentId,
      })
      setComments((prev) =>
        prev.map((c) =>
          String(c._id) === String(parentCommentId)
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        )
      )
      setReplyText('')
      setReplyTo(null)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post reply')
    }
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await commentService.remove(commentId)
      // Remove from flat list + nested replies
      setComments((prev) =>
        prev
          .filter((c) => String(c._id) !== String(commentId))
          .map((c) => ({
            ...c,
            replies: (c.replies || []).filter((r) => String(r._id) !== String(commentId)),
          }))
      )
      toast.success('Comment deleted')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete comment')
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <MessageCircle size={18} className="text-[var(--accent-primary)]" />
        Comments ({comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0)})
      </h3>

      {/* New comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full rounded-md px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none bg-[var(--bg-page)] border border-[var(--border-default)] hover:border-[var(--border-strong)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-colors resize-y mb-2"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors border-none bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] ${
              newComment.trim()
                ? 'cursor-pointer opacity-100 shadow-sm'
                : 'cursor-not-allowed opacity-50'
            }`}
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          <a href="/auth" className="text-[var(--accent-primary)] hover:underline">
            Sign in
          </a>{' '}
          to join the conversation.
        </p>
      )}

      {/* Comments list */}
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            replyTo={replyTo}
            replyText={replyText}
            setReplyTo={setReplyTo}
            setReplyText={setReplyText}
            handleReply={handleReply}
            handleDelete={handleDelete}
            isAuthenticated={isAuthenticated}
            userId={useAuthStore.getState().user?.id}
          />
        ))}
        {loaded && comments.length === 0 && (
          <p className="text-sm text-[var(--text-secondary)]">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  replyTo,
  replyText,
  setReplyTo,
  setReplyText,
  handleReply,
  handleDelete,
  isAuthenticated,
  userId,
}) {
  const isAuthor =
    isAuthenticated && String(comment.author?._id) === String(userId)
  const isReplying = replyTo === comment._id

  return (
    <div className="glass-card p-4 rounded-md">
      <div className="flex items-start gap-3">
        <Avatar src={comment.author?.avatar} name={comment.author?.username} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {comment.author?.username}
            </span>
            <span className="text-xs text-[var(--text-tertiary)]">{fromNow(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            {isAuthenticated && (
              <button
                onClick={() =>
                  setReplyTo(isReplying ? null : comment._id)
                }
                className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer border-none bg-transparent"
              >
                <Reply size={12} /> Reply
              </button>
            )}
            {isAuthor && (
              <button
                onClick={() => handleDelete(comment._id)}
                className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--error-text)] transition-colors cursor-pointer border-none bg-transparent"
              >
                <Trash2 size={12} /> Delete
              </button>
            )}
          </div>

          {/* Reply form */}
          {isReplying && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleReply(comment._id)
              }}
              className="mt-3 flex gap-2"
            >
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 rounded-md px-3 py-1.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none bg-[var(--bg-page)] border border-[var(--border-default)] hover:border-[var(--border-strong)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-colors"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className={`px-3 py-1.5 rounded-md text-xs font-medium text-white border-none bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] ${
                  replyText.trim() ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50'
                }`}
              >
                Reply
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Nested replies (one level) */}
      {comment.replies?.length > 0 && (
        <div className="mt-3 ml-8 flex flex-col gap-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              replyTo={replyTo}
              replyText={replyText}
              setReplyTo={setReplyTo}
              setReplyText={setReplyText}
              handleReply={handleReply}
              handleDelete={handleDelete}
              isAuthenticated={isAuthenticated}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Lazy import to avoid top-level circular dep with hooks/useAuth
import { useAuthStore } from '../../store/authStore.js'
