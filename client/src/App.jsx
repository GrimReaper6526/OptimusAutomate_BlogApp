import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import PostPage from './pages/PostPage.jsx'
import CreatePost from './pages/CreatePost.jsx'
import Profile from './pages/Profile.jsx'
import Search from './pages/Search.jsx'
import Settings from './pages/Settings.jsx'
import Bookmarks from './pages/Bookmarks.jsx'
import Auth from './pages/Auth.jsx'
import NotFound from './pages/NotFound.jsx'
import { useAuthStore } from './store/authStore.js'
import { authService } from './services/authService.js'
import { loadStoredTheme } from './services/themeService.js'

export default function App() {
  const { setAuth, clearAuth } = useAuthStore()

  // Apply persisted theme on startup
  useEffect(() => {
    loadStoredTheme()
  }, [])

  // On first load: try to restore the session using the refresh-token cookie.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await authService.refresh()
        if (!cancelled) setAuth(data.accessToken, data.user)
      } catch {
        if (!cancelled) clearAuth()
      }
    })()
    return () => {
      cancelled = true
    }
  }, [setAuth, clearAuth])

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slugOrId" element={<PostPage />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<CreatePost />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<Search />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
