import { Router } from 'express'
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js'
import { uploadLimiter } from '../middleware/rateLimiter.js'
import { upload } from '../config/cloudinary.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  uploadImage,
} from '../controllers/postController.js'

export const postRoutes = Router()

// Public reads (optionalAuth so a logged-in user can see their own drafts)
postRoutes.get('/', optionalAuth, asyncHandler(getPosts))
postRoutes.get('/:slugOrId', optionalAuth, asyncHandler(getPost))

// Everything below requires authentication
postRoutes.use(authenticate)

postRoutes.post('/', asyncHandler(createPost))
postRoutes.put('/:id', asyncHandler(updatePost))
postRoutes.delete('/:id', asyncHandler(deletePost))
postRoutes.post('/:id/like', asyncHandler(toggleLike))

// Image upload — strict rate limit + multer single file field "image"
postRoutes.post(
  '/upload',
  uploadLimiter,
  upload.single('image'),
  asyncHandler(uploadImage)
)
