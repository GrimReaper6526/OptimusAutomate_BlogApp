import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBookmarkStore = create(
  persist(
    (set, get) => ({
      bookmarks: [], // array of post objects

      addBookmark: (post) => {
        const exists = get().bookmarks.find((b) => b._id === post._id)
        if (!exists) {
          set((state) => ({ bookmarks: [post, ...state.bookmarks] }))
        }
      },

      removeBookmark: (postId) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b._id !== postId),
        }))
      },

      isBookmarked: (postId) => {
        return get().bookmarks.some((b) => b._id === postId)
      },

      toggleBookmark: (post) => {
        const { isBookmarked, addBookmark, removeBookmark } = get()
        if (isBookmarked(post._id)) {
          removeBookmark(post._id)
          return false
        } else {
          addBookmark(post)
          return true
        }
      },

      clearBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: 'blogflow-bookmarks',
    }
  )
)
