/**
 * Lightweight operational error with an HTTP status code.
 * Thrown from controllers/handlers; converted to JSON by errorHandler.
 *
 * Usage: throw new AppError('Post not found', 404)
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace?.(this, this.constructor)
  }
}
