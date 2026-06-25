import { z } from 'zod'
import { Comment } from '../models/Comment.js'
import { Post } from '../models/Post.js'
import { AppError } from '../utils/AppError.js'

const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  parent: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
})

/* ------------------------- List comments for a post ------------------------- */
export async function getComments(req, res) {
  const postId = String(req.params.postId)
  if (!postId.match(/^[0-9a-fA-F]{24}$/)) throw new AppError('Invalid post id', 400)

  // Verify the post exists
  const post = await Post.findById(postId).lean()
  if (!post) throw new AppError('Post not found', 404)

  const comments = await Comment.find({ post: postId })
    .populate('author', 'username avatar')
    .sort({ createdAt: 1 })
    .lean()

  // Nest replies under their parents (one level deep)
  const byParent = new Map()
  const top = []
  for (const c of comments) {
    c.replies = []
    byParent.set(String(c._id), c)
  }
  for (const c of comments) {
    if (c.parent && byParent.has(String(c.parent))) {
      byParent.get(String(c.parent)).replies.push(c)
    } else {
      top.push(c)
    }
  }

  res.json({ comments: top })
}

/* ------------------------------ Create comment ------------------------------ */
export async function createComment(req, res) {
  const { content, parent } = createCommentSchema.parse(req.body)
  const postId = String(req.params.postId)
  if (!postId.match(/^[0-9a-fA-F]{24}$/)) throw new AppError('Invalid post id', 400)

  const post = await Post.findById(postId).lean()
  if (!post) throw new AppError('Post not found', 404)

  // Only allow one level of nesting
  if (parent) {
    const parentComment = await Comment.findById(parent).lean()
    if (!parentComment) throw new AppError('Parent comment not found', 404)
    if (parentComment.parent) {
      throw new AppError('Replies can only be one level deep', 400)
    }
  }

  const comment = await Comment.create({
    content,
    post: postId,
    author: req.user.userId,
    parent: parent || null,
  })
  await comment.populate('author', 'username avatar')
  res.status(201).json(comment)
}

/* ------------------------------ Delete comment ------------------------------ */
export async function deleteComment(req, res) {
  const comment = await Comment.findById(req.params.id)
  if (!comment) throw new AppError('Comment not found', 404)

  // Ownership check (IDOR protection, §1.3)
  if (comment.author.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new AppError('You are not authorized to delete this comment', 403)
  }

  // Also remove nested replies
  await Comment.deleteMany({ $or: [{ _id: comment._id }, { parent: comment._id }] })
  res.json({ message: 'Comment deleted successfully' })
}

/* ------------------------------ Like comment ------------------------------- */
export async function toggleCommentLike(req, res) {
  const comment = await Comment.findById(req.params.id)
  if (!comment) throw new AppError('Comment not found', 404)

  const userId = req.user.userId
  const liked = comment.likes.some((id) => id.toString() === userId)
  if (liked) {
    comment.likes.pull(userId)
  } else {
    comment.likes.push(userId)
  }
  await comment.save()

  res.json({ liked: !liked, likeCount: comment.likes.length })
}
