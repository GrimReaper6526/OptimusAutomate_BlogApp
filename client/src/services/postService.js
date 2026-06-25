import api from './api.js'

export const postService = {
  list: (params = {}) => api.get('/posts', { params }).then((r) => r.data),
  get: (slugOrId) => api.get(`/posts/${slugOrId}`).then((r) => r.data),
  create: (payload) => api.post('/posts', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/posts/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/posts/${id}`).then((r) => r.data),
  toggleLike: (id) => api.post(`/posts/${id}/like`).then((r) => r.data),
  uploadImage: (file) => {
    const form = new FormData()
    form.append('image', file)
    return api
      .post('/posts/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data)
  },
}
