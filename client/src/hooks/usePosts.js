import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { postService } from '../services/postService.js'

const POSTS_KEY = ['posts']

/** Infinite feed query (pagination). */
export function usePosts({ category, search, limit = 9 } = {}) {
  return useInfiniteQuery({
    queryKey: [...POSTS_KEY, { category, search, limit }],
    queryFn: ({ pageParam = 1 }) =>
      postService.list({ page: pageParam, limit, category, search }),
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.pages ? last.pagination.page + 1 : undefined,
    initialPageParam: 1,
  })
}

export function usePost(slugOrId) {
  return useQuery({
    queryKey: ['post', slugOrId],
    queryFn: () => postService.get(slugOrId),
    enabled: !!slugOrId,
  })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => postService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: POSTS_KEY }),
  })
}

export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => postService.update(id, payload),
    onSuccess: (post) => {
      qc.invalidateQueries({ queryKey: POSTS_KEY })
      qc.invalidateQueries({ queryKey: ['post', post.slug] })
    },
  })
}

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => postService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: POSTS_KEY }),
  })
}

export function useToggleLike() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => postService.toggleLike(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['post', id] })
      const prev = qc.getQueryData(['post', id])
      qc.setQueryData(['post', id], (old) => {
        if (!old) return old
        const liked = old.likes?.includes(prev?.author)
        return { ...old, likes: liked ? old.likes : [...(old.likes || []), 'me'] }
      })
      return { prev }
    },
    onError: (_e, id, ctx) => qc.setQueryData(['post', id], ctx.prev),
    onSettled: (data, _e, id) => {
      if (data) qc.setQueryData(['post', id], (old) => ({ ...old, ...data }))
      qc.invalidateQueries({ queryKey: POSTS_KEY })
    },
  })
}
