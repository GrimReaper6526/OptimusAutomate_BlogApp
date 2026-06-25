import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'
import { authRoutes } from './routes/authRoutes.js'
import { postRoutes } from './routes/postRoutes.js'
import { commentRoutes } from './routes/commentRoutes.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import { errorHandler, asyncHandler } from './middleware/errorHandler.js'
import { AppError } from './utils/AppError.js'

const app = express()
const isProd = process.env.NODE_ENV === 'production'

/* ------------------------- Security middleware ------------------------- */
app.use(helmet())

// CORS whitelist — never '*' in production (§3.3). Credentials required for cookies.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin(origin, cb) {
      // allow same-server / curl (no Origin) + whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      return cb(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '1mb' })) // body-size limit (DoS, §13)
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser()) // for refresh-token cookie
app.use(generalLimiter)

/* ----------------------------- Health check ----------------------------- */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/* ------------------------------- Routes -------------------------------- */
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)

// 404 for unknown API routes
app.use('/api', (_req, _res, next) => next(new AppError('Route not found', 404)))

/* ----------------------------- Error handler ---------------------------- */
app.use(errorHandler)

/* ------------------------------ Bootstrap ------------------------------- */
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} (${isProd ? 'production' : 'development'})`)
    console.log(`   Health: http://localhost:${PORT}/api/health`)
  })
})

// Catch unhandled rejections so they don't crash silently
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err)
})
