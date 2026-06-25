import { ZodError } from 'zod'
import multer from 'multer'

/**
 * Centralized error handler — last middleware on the Express stack.
 *
 * Security rules applied (PROJECT_SECURITY_CHECKLIST §9.1):
 *  - Never expose stack traces or internal error details to clients.
 *  - Generic messages for 500s.
 *  - Detailed info only for operational client errors (validation/4xx).
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // 1. Zod validation errors → 400 with field details
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Invalid input',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  // 2. Multer file-upload errors → 400
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `File too large (max ${process.env.MAX_UPLOAD_MB || 5}MB)`
        : 'File upload error'
    return res.status(400).json({ error: message })
  }
  if (err?.message === 'Only JPEG, PNG, WebP and GIF images are allowed') {
    return res.status(400).json({ error: err.message })
  }

  // 3. Our operational errors (AppError) → use the given status
  if (err?.isOperational) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  // 4. Unknown errors → log full detail server-side, generic message to client
  console.error('❌ Unhandled error:', err)
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again.'
      : err.message
  return res.status(err?.statusCode || 500).json({ error: message })
}

/** Wrap an async route handler so rejections go to errorHandler automatically. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
