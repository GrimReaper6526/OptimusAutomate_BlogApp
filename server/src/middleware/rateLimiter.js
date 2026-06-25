import rateLimit from 'express-rate-limit'

/**
 * Rate limiters (PROJECT_SECURITY_CHECKLIST §3.2).
 * Each is a separate limiter so auth/upload endpoints can be stricter.
 */

// General API traffic — 100 requests / 15 min / IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

// Auth (login/register) — strict brute-force protection (5 / 15 min / IP)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again in 15 minutes.' },
})

// Image uploads — 20 / hour / IP
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Upload limit reached, please try again later.' },
})
