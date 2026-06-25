import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, X } from 'lucide-react'
import PostCard from '../components/blog/PostCard.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { usePosts } from '../hooks/usePosts.js'
import Button from '../components/ui/Button.jsx'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('search') || '')

  const { data, isLoading } = usePosts({
    search: params.get('search') || undefined,
    limit: 12,
  })

  const posts = data?.pages.flatMap((p) => p.posts) ?? []

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setParams({ search: query.trim() })
    }
  }

  const clearSearch = () => {
    setQuery('')
    setParams({})
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Search Posts</h1>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative flex gap-2 mb-8">
        <div className="relative flex-1">
          <SearchIcon
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, content, or tags..."
            className="w-full h-10 px-3 pl-10 pr-10 rounded-md text-sm text-[var(--text-primary)] bg-[var(--bg-page)] border border-[var(--border-default)] hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 shadow-sm transition-colors duration-150"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer border-none bg-transparent"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button type="submit" size="md">
          Search
        </Button>
      </form>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      )}

      {/* Results */}
      {params.get('search') && !isLoading && (
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {posts.length} result{posts.length !== 1 ? 's' : ''} for &ldquo;
          <span className="text-[var(--text-primary)] font-medium">{params.get('search')}</span>&rdquo;
        </p>
      )}

      {posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {params.get('search') && !isLoading && posts.length === 0 && (
        <div className="glass-card p-12 text-center">
          <SearchIcon size={36} className="mx-auto text-[var(--text-secondary)] mb-4" />
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">No results found</h3>
          <p className="text-sm text-[var(--text-secondary)]">Try different keywords or browse categories.</p>
        </div>
      )}

      {/* Initial state */}
      {!params.get('search') && !isLoading && (
        <div className="glass-card p-12 text-center">
          <SearchIcon size={36} className="mx-auto text-[var(--text-secondary)] mb-4" />
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
            Start searching
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Type something above to find articles, tutorials, and insights.
          </p>
        </div>
      )}
    </div>
  )
}
