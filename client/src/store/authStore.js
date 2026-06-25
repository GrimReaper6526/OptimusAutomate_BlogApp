import { create } from 'zustand'

/**
 * Global client auth state.
 * The access token lives in memory only (XSS-safe — not in localStorage, §7).
 * The long-lived refresh token lives in an HttpOnly cookie handled by the API.
 */
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  hasTriedRestore: false,

  setAuth: (accessToken, user) =>
    set({ accessToken, user, isAuthenticated: !!accessToken, hasTriedRestore: true }),

  setAccessToken: (accessToken) => set({ accessToken }),

  setUser: (user) => set({ user }),

  clearAuth: () =>
    set({ accessToken: null, user: null, isAuthenticated: false, hasTriedRestore: true }),
}))
