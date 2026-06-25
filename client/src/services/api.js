import axios from 'axios'
import { useAuthStore } from '../store/authStore.js'

// Base axios instance. withCredentials so the refresh-token cookie is sent.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

// Attach the access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Single-flight refresh: avoid hammering /auth/refresh when many requests 401
let isRefreshing = false
let refreshPromise = null

function getRefresh() {
  if (!isRefreshing) {
    isRefreshing = true
    refreshPromise = axios
      .post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true })
      .then(({ data }) => {
        useAuthStore.getState().setAccessToken(data.accessToken)
        return data.accessToken
      })
      .finally(() => {
        isRefreshing = false
      })
  }
  return refreshPromise
}

// On 401: transparently refresh once, then retry the original request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    // Don't try to refresh on the refresh endpoint itself, or when already retried
    if (status === 401 && !original._retry && !original.url.includes('/auth/refresh')) {
      original._retry = true
      try {
        const newToken = await getRefresh()
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        useAuthStore.getState().clearAuth()
        if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
          window.location.href = '/auth'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
