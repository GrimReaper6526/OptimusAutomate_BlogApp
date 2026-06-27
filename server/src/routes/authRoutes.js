import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate.js'
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import {
  register,
  login,
  refresh,
  logout,
  me,
  updateProfile,
  getProfileByUsername,
  getTopAuthors,
  toggleFollow,
} from '../controllers/authController.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const authRoutes = Router()

const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only'),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only')
    .optional(),
  email: z.string().email().optional(),
  bio: z.string().max(200).optional().nullable(),
  avatar: z.string().optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).max(128).optional(),
})

// Strict rate-limit on credential endpoints (brute-force protection)
authRoutes.post('/register', authLimiter, validate(registerSchema), asyncHandler(register))
authRoutes.post('/login', authLimiter, validate(loginSchema), asyncHandler(login))
authRoutes.post('/refresh', asyncHandler(refresh))
authRoutes.post('/logout', asyncHandler(logout))
authRoutes.get('/me', authenticate, asyncHandler(me))
authRoutes.put('/profile', authenticate, validate(updateProfileSchema), asyncHandler(updateProfile))
authRoutes.get('/authors', asyncHandler(getTopAuthors))
authRoutes.get('/profile/:username', optionalAuth, asyncHandler(getProfileByUsername))
authRoutes.post('/profile/:username/follow', authenticate, asyncHandler(toggleFollow))
