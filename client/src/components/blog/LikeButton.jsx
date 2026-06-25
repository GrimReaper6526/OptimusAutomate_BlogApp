import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { postService } from '../../services/postService.js'
import toast from 'react-hot-toast'

export default function LikeButton({ postId, initialLiked = false, initialCount = 0 }) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const { isAuthenticated } = useAuth()
  const [animating, setAnimating] = useState(false)

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast('Sign in to like posts', { icon: '💡' })
      return
    }
    // Optimistic update
    setLiked(!liked)
    setCount((c) => (liked ? c - 1 : c + 1))
    if (!liked) setAnimating(true)
    setTimeout(() => setAnimating(false), 400)

    try {
      await postService.toggleLike(postId)
    } catch {
      // Revert on failure
      setLiked(liked)
      setCount((c) => (liked ? c + 1 : c - 1))
      toast.error('Failed to update like')
    }
  }

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1.5 text-sm transition-all duration-150 px-3 py-1.5 rounded-md active:scale-95 cursor-pointer border-none bg-transparent ${
        liked 
          ? 'text-[var(--error-text)] bg-[var(--error-bg)]' 
          : 'text-[var(--text-secondary)] hover:text-[var(--error-text)] hover:bg-[var(--bg-subtle)]'
      }`}
    >
      <Heart
        size={18}
        fill={liked ? 'currentColor' : 'none'}
        className={`transition-transform duration-300 ${
          animating ? 'scale-[1.35]' : 'scale-100'
        }`}
      />
      <span className="font-medium">{count}</span>
    </button>
  )
}
