import { Router } from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import {
  getComments,
  createComment,
  deleteComment,
  toggleCommentLike,
} from '../controllers/commentController.js'

export const commentRoutes = Router()

// Reads are public (no auth) so logged-out visitors can view comments
commentRoutes.get('/:postId', asyncHandler(getComments))

commentRoutes.use(authenticate)

commentRoutes.post('/:postId', asyncHandler(createComment))
commentRoutes.delete('/:id', asyncHandler(deleteComment))
commentRoutes.post('/:id/like', asyncHandler(toggleCommentLike))
