import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { Post } from '../models/Post.js'
import { AppError } from '../utils/AppError.js'

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m'
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d'
const REFRESH_COOKIE = 'refreshToken'
const REFRESH_MS = 7 * 24 * 60 * 60 * 1000 // 7 days in ms (cookie maxAge)

/** Sign a short-lived access token. Algorithm pinned to HS256. */
function signAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES,
    algorithm: 'HS256',
  })
}

/** Sign a long-lived refresh token (stored in DB for rotation/revocation). */
function signRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
    algorithm: 'HS256',
  })
}

/** Set refresh token as a hardened cookie: HttpOnly + Secure + SameSite=Strict. (§7) */
function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_MS,
    path: '/api/auth',
  })
}

function publicUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    role: user.role,
    followers: user.followers || [],
    following: user.following || [],
    createdAt: user.createdAt,
  }
}

/* ----------------------------- Register ----------------------------- */
export async function register(req, res) {
  const { username, email, password } = req.body

  // Unique check with a single query (NoSQL-injection safe — values are strings)
  const existing = await User.findOne({
    $or: [{ email: String(email) }, { username: String(username) }],
  }).lean()
  if (existing) {
    throw new AppError(
      existing.email === email ? 'Email already registered' : 'Username already taken',
      409
    )
  }

  const user = await User.create({ username, email, password })

  const accessToken = signAccessToken(user._id)
  const refreshToken = signRefreshToken(user._id)
  user.refreshToken = refreshToken
  await user.save()

  setRefreshCookie(res, refreshToken)
  res.status(201).json({ accessToken, user: publicUser(user) })
}

/* ------------------------------ Login ------------------------------- */
export async function login(req, res) {
  const { email, password } = req.body

  const user = await User.findOne({ email: String(email) }).select('+password')
  // Same message for both "no user" and "wrong password" (anti-enumeration, §1.1)
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401)
  }

  const accessToken = signAccessToken(user._id)
  const refreshToken = signRefreshToken(user._id)
  user.refreshToken = refreshToken
  await user.save()

  setRefreshCookie(res, refreshToken)
  res.json({ accessToken, user: publicUser(user) })
}

/* --------------------- Refresh access token ------------------------- */
/**
 * Validates the refresh token from the cookie against BOTH the signature
 * and the DB (rotation/revocation, §1.2). Issues a brand-new refresh token
 * and invalidates the old one.
 */
export async function refresh(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE]
  if (!token) throw new AppError('Refresh token missing', 401)

  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] })
  } catch {
    throw new AppError('Invalid or expired refresh token', 401)
  }

  // The stored token MUST match (rejects reused / revoked tokens)
  const user = await User.findById(payload.userId).select('+refreshToken')
  if (!user || user.refreshToken !== token) {
    throw new AppError('Refresh token is no longer valid', 401)
  }

  const accessToken = signAccessToken(user._id)
  const newRefreshToken = signRefreshToken(user._id)
  user.refreshToken = newRefreshToken
  await user.save()

  setRefreshCookie(res, newRefreshToken)
  res.json({ accessToken, user: publicUser(user) })
}

/* ------------------------------ Logout ------------------------------ */
/** Clears the cookie and nulls the DB token (server-side invalidation, §1.2). */
export async function logout(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE]
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] })
      await User.updateOne({ _id: payload.userId }, { $unset: { refreshToken: '' } })
    } catch {
      /* token already invalid — nothing to revoke */
    }
  }
  res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' })
  res.json({ message: 'Logged out successfully' })
}

/* ------------------------------ Profile ----------------------------- */
/** Returns the currently authenticated user (used by the frontend on load). */
export async function me(req, res) {
  const user = await User.findById(req.user.userId)
  if (!user) throw new AppError('User not found', 404)
  res.json({ user: publicUser(user) })
}

/* ------------------------- Update Profile --------------------------- */
export async function updateProfile(req, res) {
  const userId = req.user.userId
  const { username, email, bio, avatar, currentPassword, newPassword } = req.body

  const user = await User.findById(userId).select('+password')
  if (!user) throw new AppError('User not found', 404)

  // If changing username, check conflict
  if (username && username !== user.username) {
    const existing = await User.findOne({ username: String(username).toLowerCase() })
    if (existing) throw new AppError('Username already taken', 409)
    user.username = username
  }

  // If changing email, check conflict
  if (email && email !== user.email) {
    const existing = await User.findOne({ email: String(email).toLowerCase() })
    if (existing) throw new AppError('Email already registered', 409)
    user.email = email
  }

  if (bio !== undefined) {
    user.bio = bio
  }

  if (avatar !== undefined) {
    user.avatar = avatar
  }

  // If newPassword is provided, we must check currentPassword
  if (newPassword) {
    if (!currentPassword) {
      throw new AppError('Current password is required to set a new password', 400)
    }
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      throw new AppError('Incorrect current password', 401)
    }
    user.password = newPassword
  }

  await user.save()

  res.json({ user: publicUser(user) })
}

/* -------------------- Public User Profile by Username ------------------ */
export async function getProfileByUsername(req, res) {
  const username = String(req.params.username)
  const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })
  if (!user) throw new AppError('User not found', 404)

  const currentUserId = req.user?.userId
  const isFollowing = currentUserId
    ? user.followers.some(id => String(id) === String(currentUserId))
    : false

  res.json({
    user: {
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      followers: user.followers || [],
      following: user.following || [],
      isFollowing,
      createdAt: user.createdAt,
    },
  })
}

/* -------------------- Get Top Authors sorted by total likes ------------------ */
export async function getTopAuthors(req, res) {
  const authors = await Post.aggregate([
    { $match: { status: 'published' } },
    {
      $project: {
        author: 1,
        likesCount: {
          $cond: {
            if: { $isArray: "$likes" },
            then: { $size: "$likes" },
            else: 0
          }
        }
      }
    },
    {
      $group: {
        _id: "$author",
        totalLikes: { $sum: "$likesCount" },
        postsCount: { $sum: 1 }
      }
    },
    { $sort: { totalLikes: -1, postsCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'authorInfo'
      }
    },
    { $unwind: "$authorInfo" },
    {
      $project: {
        _id: 1,
        totalLikes: 1,
        postsCount: 1,
        username: "$authorInfo.username",
        avatar: "$authorInfo.avatar",
        bio: "$authorInfo.bio"
      }
    }
  ]);

  if (authors.length < 5) {
    const existingIds = authors.map((a) => String(a._id));
    const extraUsers = await User.find({ _id: { $nin: existingIds } })
      .limit(5 - authors.length)
      .select('username avatar bio')
      .lean();

    extraUsers.forEach((u) => {
      authors.push({
        _id: u._id,
        totalLikes: 0,
        postsCount: 0,
        username: u.username,
        avatar: u.avatar,
        bio: u.bio
      });
    });
  }

  res.json({ authors });
}

/* -------------------- Toggle Follow/Unfollow ------------------ */
export async function toggleFollow(req, res) {
  const targetUsername = String(req.params.username)
  const currentUserId = req.user.userId

  const targetUser = await User.findOne({ username: { $regex: new RegExp(`^${targetUsername}$`, 'i') } })
  if (!targetUser) throw new AppError('User to follow not found', 404)

  if (String(targetUser._id) === String(currentUserId)) {
    throw new AppError('You cannot follow yourself', 400)
  }

  const isFollowing = targetUser.followers.some(id => String(id) === String(currentUserId))

  if (isFollowing) {
    // Atomic unfollow using $pull
    await User.findByIdAndUpdate(targetUser._id, { $pull: { followers: currentUserId } })
    await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUser._id } })
  } else {
    // Atomic follow using $addToSet (ensures uniqueness!)
    await User.findByIdAndUpdate(targetUser._id, { $addToSet: { followers: currentUserId } })
    await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUser._id } })
  }

  // Fetch updated target user to get the latest followers/following arrays
  const updatedTarget = await User.findById(targetUser._id).lean()

  res.json({
    message: isFollowing ? `Unfollowed @${targetUser.username}` : `Following @${targetUser.username}`,
    isFollowing: !isFollowing,
    followersCount: updatedTarget.followers?.length || 0,
    followingCount: updatedTarget.following?.length || 0,
  })
}
