import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { BookOpen, Calendar, UserPlus, UserCheck, Share2 } from 'lucide-react'
import api from '../services/api.js'
import Avatar from '../components/ui/Avatar.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import Badge from '../components/ui/Badge.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Button from '../components/ui/Button.jsx'
import PostCard from '../components/blog/PostCard.jsx'
import { formatDate } from '../utils/formatDate.js'
import { useAuth } from '../hooks/useAuth.js'
import toast from 'react-hot-toast'

export default function Profile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user: currentUser, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('posts') // 'posts' | 'about'

  const isOwnProfile = isAuthenticated && currentUser?.username === username

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        // Fetch user profile details directly
        const profileRes = await api.get(`/auth/profile/${username}`)
        setProfile(profileRes.data.user)

        // Fetch user posts separately
        try {
          const postsRes = await api.get('/posts', { params: { author: username, limit: 20 } })
          setPosts(postsRes.data.posts)
        } catch (postsErr) {
          console.error('Failed to fetch posts for user:', postsErr)
        }
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    })()
  }, [username])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={32} />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="glass-card p-12 text-center max-w-lg mx-auto">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">User not found</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          This profile doesn't exist or may have been removed.
        </p>
        <Link to="/" className="text-[var(--accent-primary)] hover:underline text-sm font-medium">
          ← Back to feed
        </Link>
      </div>
    )
  }

  const handleFollow = () => {
    setIsFollowing((prev) => !prev)
    toast.success(isFollowing ? `Unfollowed @${username}` : `Following @${username}`)
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast.success('Profile link copied!')
  }

  const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)
  const joinDate = profile.createdAt ? formatDate(profile.createdAt) : 'Unknown'

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Profile hero header */}
      <GlassCard className="p-0 overflow-hidden mb-6">
        {/* Cover banner */}
        <div className="h-32 bg-[var(--bg-subtle)] border-b border-[var(--border-default)] relative" />

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <Avatar
                src={profile.avatar}
                name={profile.username}
                size="xl"
                className="w-24 h-24 rounded-full border-4 border-[var(--bg-page)] shadow-[var(--shadow-lg)]"
              />
              {/* Online dot */}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--success-icon)] border-2 border-[var(--bg-page)] shadow-sm" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleShare}
                className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-default)] transition-colors cursor-pointer bg-transparent"
                title="Share profile"
              >
                <Share2 size={16} />
              </button>

              {isOwnProfile ? (
                <Button
                  variant="outline"
                  onClick={() => navigate('/settings')}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  onClick={handleFollow}
                  variant={isFollowing ? 'outline' : 'primary'}
                  className="flex items-center gap-2"
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
          </div>

          {/* Name & bio */}
          <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-0.5">{profile.username}</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-3">@{profile.username}</p>

          {profile.bio && (
            <p className="text-sm text-[var(--text-primary)] mb-4 leading-relaxed max-w-xl">{profile.bio}</p>
          )}

          {/* Meta tags */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--text-secondary)] mb-5">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              Joined {joinDate}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={12} />
              {posts.length} published article{posts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Articles', value: posts.length },
              { label: 'Total Likes', value: totalLikes },
              { label: 'Following', value: isFollowing ? 1 : 0 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-md p-3 text-center"
              >
                <p className="text-lg font-semibold text-[var(--text-primary)]">{stat.value}</p>
                <p className="text-[11px] text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6 border-b border-[var(--border-default)] pb-0">
        {['posts', 'about'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold capitalize transition-all duration-150 cursor-pointer border-none bg-transparent border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-[var(--text-primary)] border-[var(--accent-primary)]'
                : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <>
          {posts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <BookOpen size={36} className="mx-auto text-[var(--text-secondary)] mb-3" />
              <p className="text-sm text-[var(--text-secondary)]">No posts published yet.</p>
              {isOwnProfile && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/create')}
                  className="mt-4"
                >
                  Write your first post
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <GlassCard className="space-y-5">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">About</h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-[var(--text-primary)]">
              <Calendar size={16} className="text-[var(--text-secondary)] flex-shrink-0" />
              <span>Member since <strong className="text-[var(--text-primary)]">{joinDate}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-[var(--text-primary)]">
              <BookOpen size={16} className="text-[var(--text-secondary)] flex-shrink-0" />
              <span><strong className="text-[var(--text-primary)]">{posts.length}</strong> articles published on BlogFlow</span>
            </div>
          </div>

          {profile.bio && (
            <div className="border-t border-[var(--border-default)] pt-5">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2 font-semibold">Bio</p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  )
}
