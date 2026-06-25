import mongoose from 'mongoose'
import slugify from 'slugify'

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
      default: '',
    },
    coverImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }, // for Cloudinary deletion
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        maxlength: 30,
        trim: true,
        lowercase: true,
      },
    ],
    category: {
      type: String,
      enum: ['Technology', 'Design', 'Business', 'Science', 'Lifestyle', 'Other'],
      default: 'Other',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number, // minutes
      default: 1,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
)

/**
 * On save: generate a unique slug from the title and compute reading time.
 * (Plan's snippet used require() inside ESM — fixed to a top-level import.)
 */
postSchema.pre('validate', function generateSlug(next) {
  if (this.isModified('title') && !this.slug) {
    const base = slugify(this.title, { lower: true, strict: true }) || 'post'
    // Timestamp suffix guarantees uniqueness even for identical titles.
    this.slug = `${base}-${Date.now().toString(36)}`
  }
  next()
})

postSchema.pre('save', function computeReadingTime(next) {
  if (this.isModified('content')) {
    // Strip HTML tags then count words → minutes at ~200 wpm.
    const text = this.content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ')
    const words = text.split(/\s+/).filter(Boolean).length
    this.readingTime = Math.max(1, Math.ceil(words / 200))
  }
  next()
})

// Full-text search index for the search feature
postSchema.index({ title: 'text', content: 'text', tags: 'text' })

// Virtual comment count is computed at query time (see postController)
postSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
})

// Make virtuals + populated author visible in JSON
postSchema.set('toJSON', { virtuals: true })
postSchema.set('toObject', { virtuals: true })

export const Post = mongoose.model('Post', postSchema)
