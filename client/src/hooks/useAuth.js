import { useAuthStore } from '../store/authStore.js'

export function useAuth() {
  const { user, isAuthenticated, hasTriedRestore, setAuth, clearAuth, setUser } = useAuthStore()
  return { user, isAuthenticated, hasTriedRestore, setAuth, clearAuth, setUser }
}

export default useAuth
