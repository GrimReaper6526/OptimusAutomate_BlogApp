import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { BookOpen, TrendingUp } from 'lucide-react'
import PostCard from '../components/blog/PostCard.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Button from '../components/ui/Button.jsx'
import { usePosts } from '../hooks/usePosts.js'

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const category = searchParams.get('category') || ''
  const [sidebarCategory, setSidebarCategory] = useState(category)

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts({
    category: sidebarCategory || undefined,
    limit: 8,
  })

  const posts = data?.pages.flatMap((p) => p.posts) ?? []
  const pagination = data?.pages[data.pages.length - 1]?.pagination

  const handleCategoryChange = (cat) => {
    setSidebarCategory(cat)
    if (cat) {
      setSearchParams({ category: cat })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-2">
      {/* Centered Hero Header */}
      {!sidebarCategory && (
        <div className="text-center py-16 px-4 mb-10 relative overflow-hidden animate-fade-in border-b border-[var(--border-default)]">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[var(--text-primary)] mb-4 leading-tight">
            Elevate Your Narrative.
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
            The premier modern publishing platform for creative minds and teams.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button 
              onClick={() => navigate('/create')}
            >
              Start Blogging Free
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/search')}
            >
              Explore Features
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-8">
        <Sidebar active={sidebarCategory} onChange={handleCategoryChange} />

        <div className="flex-1 min-w-0">
          {/* Header of feed */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              {sidebarCategory ? (
                <>
                  <span className="text-[var(--text-secondary)] uppercase text-xs font-semibold tracking-wider">Category /</span>
                  {sidebarCategory}
                </>
              ) : (
                'Recent posts'
              )}
            </h2>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center py-16">
              <Spinner size={32} />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && posts.length === 0 && (
            <div className="glass-card p-12 text-center">
              <BookOpen size={36} className="mx-auto text-[var(--text-secondary)] mb-4" />
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">No posts yet</h3>
              <p className="text-sm text-[var(--text-secondary)]">Be the first to share something amazing!</p>
            </div>
          )}

          {/* Posts grid */}
          {posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Load more */}
          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={fetchNextPage}
                loading={isFetchingNextPage}
              >
                <TrendingUp size={14} />
                Load more
                {pagination && (
                  <span className="text-xs opacity-60 ml-1">
                    ({pagination.page}/{pagination.pages})
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
