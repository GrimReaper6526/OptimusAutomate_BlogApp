import { Link, useNavigate } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button.jsx'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[72vh] text-center animate-fade-in px-4">
      {/* 404 number */}
      <h1 className="text-[100px] sm:text-[140px] font-extrabold leading-none select-none text-[var(--text-secondary)] opacity-20 mb-6">
        404
      </h1>

      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Page not found</h2>
      <p className="text-[var(--text-secondary)] mb-8 max-w-md leading-relaxed text-sm">
        The page you're looking for doesn't exist, has been removed, or was moved to a different URL.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => navigate(-1)} variant="ghost" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Go Back
        </Button>
        <Link to="/">
          <Button className="flex items-center gap-2">
            <Home size={16} />
            Home
          </Button>
        </Link>
        <Link to="/search">
          <Button variant="outline" className="flex items-center gap-2">
            <Search size={16} />
            Search
          </Button>
        </Link>
      </div>
    </div>
  )
}
