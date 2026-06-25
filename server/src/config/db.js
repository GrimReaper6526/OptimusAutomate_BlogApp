import mongoose from 'mongoose'

/**
 * Connect to MongoDB Atlas. Exits the process on failure so the app
 * never runs in a half-broken state (DB is a hard dependency).
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri || uri.includes('USER:PASSWORD')) {
    console.error('❌ MONGODB_URI is not configured. Edit server/.env with your Atlas connection string.')
    process.exit(1)
  }

  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(uri)
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  }

  // Graceful shutdown on process termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close()
    console.log('\n🔌 MongoDB connection closed (SIGINT)')
    process.exit(0)
  })
}
