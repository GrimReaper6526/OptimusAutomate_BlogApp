import api from './api.js'

export const commentService = {
  list: (postId) => api.get(`/comments/${postId}`).then((r) => r.data),
  create: (postId, payload) => api.post(`/comments/${postId}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/comments/${id}`).then((r) => r.data),
  toggleLike: (id) => api.post(`/comments/${id}/like`).then((r) => r.data),
}
