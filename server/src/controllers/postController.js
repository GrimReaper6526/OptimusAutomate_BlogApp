import { z } from 'zod'
import { Post } from '../models/Post.js'
import { Comment } from '../models/Comment.js'
import { User } from '../models/User.js'
import { cloudinary } from '../config/cloudinary.js'
import { AppError } from '../utils/AppError.js'

const CATEGORIES = ['Technology', 'Design', 'Business', 'Science', 'Lifestyle', 'Other']

const postSchema = z.object({
  title: z.string().min(5).max(150),
  content: z.string().min(50),
  excerpt: z.string().max(300).optional(),
  coverImage: z
    .object({ url: z.string().url().optional(), publicId: z.string().optional() })
    .optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  category: z.enum(CATEGORIES).optional(),
  status: z.enum(['draft', 'published']).optional(),
})

const updatePostSchema = postSchema.partial()

/* --------------------------- Create post --------------------------- */
export async function createPost(req, res) {
  const data = postSchema.parse(req.body)
  const post = await Post.create({ ...data, author: req.user.userId })
  await post.populate('author', 'username avatar')
  res.status(201).json(post)
}

/* ---------------------------- List posts --------------------------- */
export async function getPosts(req, res) {
  // All inputs coerced to safe types + bounded (NoSQL-injection safe, §2.2)
  const page = Math.max(1, parseInt(req.query.page, 10) || 1)
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 10))

  const filter = { status: 'published' }

  if (req.query.category && CATEGORIES.includes(String(req.query.category))) {
    filter.category = String(req.query.category)
  }
  if (req.query.tag) {
    filter.tags = String(req.query.tag).toLowerCase().slice(0, 30)
  }
  if (req.query.author) {
    const a = String(req.query.author)
    if (a.match(/^[0-9a-fA-F]{24}$/)) {
      filter.author = a
    } else {
      const u = await User.findOne({ username: { $regex: new RegExp(`^${a}$`, 'i') } })
      filter.author = u ? u._id : '000000000000000000000000'
    }
  }
  if (req.query.search) {
    // Cap search length; $text is parameterized by MongoDB (safe)
    filter.$text = { $search: String(req.query.search).slice(0, 100) }
  }

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content')
      .populate({ path: 'commentCount' }),
    Post.countDocuments(filter),
  ])

  res.json({
    posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 0 },
  })
}

/* --------------------------- Get single post ----------------------- */
export async function getPost(req, res) {
  const identifier = String(req.params.slugOrId).slice(0, 200)

  const query = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier }

  // Show drafts only to their author (authorization, §1.3)
  const baseFilter = { ...query }
  if (req.user) {
    baseFilter.$or = [{ status: 'published' }, { status: 'draft', author: req.user.userId }]
  } else {
    baseFilter.status = 'published'
  }

  const post = await Post.findOne(baseFilter)
    .populate('author', 'username avatar bio createdAt')
    .populate({ path: 'commentCount' })

  if (!post) throw new AppError('Post not found', 404)

  // Increment views (non-blocking, fire-and-forget)
  Post.updateOne({ _id: post._id }, { $inc: { views: 1 } }).exec()

  res.json(post)
}

/* --------------------------- Update post --------------------------- */
export async function updatePost(req, res) {
  const data = updatePostSchema.parse(req.body)
  const post = await Post.findById(req.params.id)
  if (!post) throw new AppError('Post not found', 404)

  // Ownership check — IDOR protection (§1.3)
  if (post.author.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new AppError('You are not authorized to edit this post', 403)
  }

  // If cover image changed, delete the old one from Cloudinary
  if (data.coverImage?.publicId && post.coverImage?.publicId &&
      data.coverImage.publicId !== post.coverImage.publicId) {
    cloudinary.uploader.destroy(post.coverImage.publicId).catch(() => {})
  }

  Object.assign(post, data)
  await post.save()
  await post.populate('author', 'username avatar')
  res.json(post)
}

/* --------------------------- Delete post --------------------------- */
export async function deletePost(req, res) {
  const post = await Post.findById(req.params.id)
  if (!post) throw new AppError('Post not found', 404)

  if (post.author.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new AppError('You are not authorized to delete this post', 403)
  }

  // Clean up Cloudinary asset + all related comments
  if (post.coverImage?.publicId) {
    cloudinary.uploader.destroy(post.coverImage.publicId).catch(() => {})
  }
  await Comment.deleteMany({ post: post._id })
  await post.deleteOne()

  res.json({ message: 'Post deleted successfully' })
}

/* ----------------------------- Like ------------------------------- */
export async function toggleLike(req, res) {
  const post = await Post.findById(req.params.id)
  if (!post) throw new AppError('Post not found', 404)

  const userId = req.user.userId
  const liked = post.likes.some((id) => id.toString() === userId)

  if (liked) {
    post.likes.pull(userId)
  } else {
    post.likes.push(userId)
  }
  await post.save()

  res.json({ liked: !liked, likeCount: post.likes.length })
}

/* -------------------------- Upload image -------------------------- */
/**
 * multer (configured in cloudinary.js) has already validated MIME type +
 * size and streamed the file to Cloudinary. Here we just return the result.
 */
export async function uploadImage(req, res) {
  if (!req.file) throw new AppError('No file uploaded', 400)
  res.json({
    url: req.file.path,
    publicId: req.file.filename,
  })
}
