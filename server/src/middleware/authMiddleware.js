import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { AppError } from '../utils/AppError.js'

/**
 * Verify the Bearer access token and attach req.user = { userId, username, role }.
 *
 * Security (PROJECT_SECURITY_CHECKLIST §1.2):
 *  - Algorithm is explicitly pinned to HS256 (the "none" alg attack is rejected).
 *  - Missing/invalid tokens return 401 with a generic message.
 *  - Deleted users are rejected even with a valid token.
 */
export async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    if (!header.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401)
    }
    const token = header.slice('Bearer '.length).trim()

    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    })

    // Ensure the user still exists (revocation for deleted/banned users, §1.3)
    const user = await User.findById(payload.userId).lean()
    if (!user) {
      throw new AppError('Authentication required', 401)
    }

    req.user = { userId: user._id, username: user.username, role: user.role }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Session expired, please log in again', 401))
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid authentication token', 401))
    }
    next(err)
  }
}

/** Optional auth — attaches req.user if a valid token is present, but never errors. */
export async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    if (!header.startsWith('Bearer ')) return next()
    const token = header.slice('Bearer '.length).trim()
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    const user = await User.findById(payload.userId).lean()
    if (user) {
      req.user = { userId: user._id, username: user.username, role: user.role }
    }
    next()
  } catch {
    next()
  }
}

/** Restrict a route to certain roles. Use AFTER authenticate. */
export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }
    next()
  }
}
