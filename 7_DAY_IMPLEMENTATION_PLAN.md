# 🚀 7-Day Full Stack Internship — Complete Implementation Plan
### OptimusAutomate Virtual Internship | Task 1 (Blog App) + Task 4 (PM Tool)

> **How to use this file:** Ye ek master reference document hai. Har din subah isko kholo, us din ka section follow karo, aur raat ko checklist tick karo. Isme design decisions, exact libraries, folder structure, aur UI style sab kuch hai.

---

## 📐 DESIGN PHILOSOPHY — Poore Project Ki Direction

### Visual Style: "3D Glassmorphism + Dark Professional"

Dono projects ek **consistent design language** follow karenge jo modern SaaS products jaisi feel degi. Ye style aaj kal Vercel, Linear, Notion jaise top products mein use hoti hai.

**Core Design Tokens:**

| Token | Value | Use |
|-------|-------|-----|
| Background | `#0a0a0f` (near-black) | Page background |
| Surface | `#12121a` | Cards, sidebars |
| Glass Card | `rgba(255,255,255,0.04)` + blur | Feature cards |
| Primary | `#6366f1` (Indigo) | Buttons, active states |
| Primary Glow | `rgba(99,102,241,0.3)` | Shadows on buttons |
| Accent | `#22d3ee` (Cyan) | Highlights, icons |
| Text Primary | `#f1f5f9` | Headings |
| Text Secondary | `#94a3b8` | Body text, labels |
| Border | `rgba(255,255,255,0.08)` | Card borders |
| Success | `#10b981` | Status badges |
| Warning | `#f59e0b` | Priority indicators |
| Danger | `#ef4444` | Delete, error states |

**3D Effect kaise aayega (CSS Techniques):**
```css
/* 1. Glassmorphism Card */
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1); /* top shine line */
}

/* 2. 3D Button Effect */
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  box-shadow: 
    0 0 20px rgba(99, 102, 241, 0.4),  /* glow */
    0 4px 12px rgba(0, 0, 0, 0.3),      /* depth */
    inset 0 1px 0 rgba(255,255,255,0.2); /* top shine */
  transform: translateY(0);
  transition: all 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);          /* 3D lift on hover */
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.6), 0 8px 20px rgba(0,0,0,0.4);
}
.btn-primary:active {
  transform: translateY(0px);           /* press down effect */
}

/* 3. Gradient Text (Headings pe) */
.gradient-text {
  background: linear-gradient(135deg, #6366f1, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 4. Floating Card Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
```

**Typography:**
- **Headings:** `Inter` ya `Geist` (Google Fonts se — modern, geometric)
- **Body:** `Inter` 16px, line-height 1.6
- **Code:** `JetBrains Mono` (code blocks ke liye)
- **Font weights:** 400 (body), 500 (labels), 600 (headings), 700 (hero text)

**Tailwind Config (tailwind.config.js):**
```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0f',
          surface: '#12121a',
          card: '#1a1a27',
          border: 'rgba(255,255,255,0.08)',
        },
        brand: {
          primary: '#6366f1',
          accent: '#22d3ee',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  }
}
```

---

## 📁 FOLDER STRUCTURE — Dono Projects Ka

### Task 1: Blog App — `OptimusAutomate_BlogApp/`

```
OptimusAutomate_BlogApp/
├── client/                          (React Frontend)
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  (Reusable UI components)
│   │   │   │   ├── Button.jsx       (3D button component)
│   │   │   │   ├── GlassCard.jsx    (Glassmorphism card)
│   │   │   │   ├── Avatar.jsx       (User avatar)
│   │   │   │   ├── Badge.jsx        (Status/tag badges)
│   │   │   │   ├── Modal.jsx        (Popup modal)
│   │   │   │   └── Toast.jsx        (Notifications)
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx       (Top navigation)
│   │   │   │   ├── Sidebar.jsx      (Category filter)
│   │   │   │   └── Footer.jsx
│   │   │   ├── blog/
│   │   │   │   ├── PostCard.jsx     (Blog post card with glass effect)
│   │   │   │   ├── PostEditor.jsx   (TipTap rich text editor)
│   │   │   │   ├── PostDetail.jsx   (Full post view)
│   │   │   │   ├── CommentSection.jsx
│   │   │   │   └── LikeButton.jsx   (Animated like button)
│   │   │   └── auth/
│   │   │       ├── LoginForm.jsx
│   │   │       └── RegisterForm.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx             (Feed with masonry grid)
│   │   │   ├── PostPage.jsx         (Single post)
│   │   │   ├── CreatePost.jsx       (Write new post)
│   │   │   ├── Profile.jsx          (User profile)
│   │   │   ├── Search.jsx           (Search results)
│   │   │   └── Auth.jsx             (Login/Register)
│   │   ├── hooks/
│   │   │   ├── useAuth.js           (Auth context hook)
│   │   │   ├── usePosts.js          (TanStack Query hooks)
│   │   │   └── useImageUpload.js    (Cloudinary upload)
│   │   ├── services/
│   │   │   ├── api.js               (Axios instance)
│   │   │   ├── authService.js
│   │   │   └── postService.js
│   │   ├── store/
│   │   │   └── authStore.js         (Zustand auth state)
│   │   ├── utils/
│   │   │   ├── readingTime.js       (Reading time calculator)
│   │   │   └── formatDate.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                         (VITE_API_URL=...)
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                          (Node.js Backend)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── postController.js
│   │   │   ├── commentController.js
│   │   │   └── uploadController.js
│   │   ├── models/
│   │   │   ├── User.js              (Mongoose schema)
│   │   │   ├── Post.js
│   │   │   └── Comment.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   └── commentRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    (JWT verify)
│   │   │   ├── rateLimiter.js       (express-rate-limit)
│   │   │   ├── validate.js          (Zod validation)
│   │   │   └── errorHandler.js
│   │   ├── config/
│   │   │   ├── db.js                (MongoDB connection)
│   │   │   └── cloudinary.js        (Cloudinary config)
│   │   └── app.js
│   ├── .env
│   └── package.json
│
├── README.md                        (Tech stack documentation)
└── .gitignore
```

### Task 4: PM Tool — `OptimusAutomate_PMTool/`

```
OptimusAutomate_PMTool/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  (Same reusable components)
│   │   │   ├── board/
│   │   │   │   ├── BoardView.jsx    (Main Kanban board)
│   │   │   │   ├── Column.jsx       (Todo/In Progress/Done column)
│   │   │   │   ├── TaskCard.jsx     (Draggable card — @dnd-kit)
│   │   │   │   ├── TaskModal.jsx    (Card detail popup)
│   │   │   │   └── AddCardBtn.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsBar.jsx     (Total/Done/Overdue counts)
│   │   │   │   └── ActivityFeed.jsx (Recent actions log)
│   │   │   └── members/
│   │   │       ├── MemberPicker.jsx (Assign member dropdown)
│   │   │       └── AvatarGroup.jsx  (Stacked avatars on card)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        (Overview + boards list)
│   │   │   ├── BoardPage.jsx        (Kanban view)
│   │   │   └── Auth.jsx
│   │   └── ...                      (same structure as Blog)
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── boardController.js
│   │   │   ├── listController.js
│   │   │   ├── cardController.js
│   │   │   └── activityController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Board.js
│   │   │   ├── List.js
│   │   │   ├── Card.js
│   │   │   └── Activity.js          (Action history log)
│   │   └── ...
└── ...
```

---

## 📅 DAY 1 — Foundation Setup (Dono Projects Ka Shared Base)

### Goal: Auth system + project scaffolding + DB connection ready

### Step 1: Environment Setup (1 ghanta)

```bash
# Node version check karo
node -v   # v18+ honi chahiye
npm -v

# MongoDB Atlas account banao (mongodb.com/atlas)
# Free tier (512MB) — kafi hai

# Cloudinary account banao (cloudinary.com)
# Free tier — 25GB storage

# GitHub pe 2 repositories banao:
# OptimusAutomate_BlogApp
# OptimusAutomate_PMTool
```

### Step 2: Backend Scaffold — Blog App (1.5 ghante)

```bash
mkdir OptimusAutomate_BlogApp
cd OptimusAutomate_BlogApp
mkdir server && cd server
npm init -y

# Required packages install karo
npm install express mongoose dotenv bcryptjs jsonwebtoken
npm install express-rate-limit helmet cors
npm install multer cloudinary multer-storage-cloudinary
npm install zod slugify
npm install --save-dev nodemon

# server/src/app.js banao — ye tumhara main entry point hai
```

**server/src/app.js — Complete Setup:**
```javascript
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { authRoutes } from './routes/authRoutes.js'
import { postRoutes } from './routes/postRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { generalLimiter } from './middleware/rateLimiter.js'

dotenv.config()

const app = express()

// Security middleware — sabse pehle
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(generalLimiter)  // rate limiting sab routes pe

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

// Health check (deployment ke liye zaroor)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler — sabse aakhir mein
app.use(errorHandler)

// DB connect + Server start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err)
    process.exit(1)
  })
```

**server/.env:**
```
PORT=5000
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/blogapp
JWT_SECRET=minimum_32_character_random_string_here_use_crypto
JWT_REFRESH_SECRET=another_different_32_char_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Step 3: User Model + Auth System (2 ghante)

**server/src/models/User.js:**
```javascript
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/  // only alphanumeric + underscore
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false  // IMPORTANT: password by default queries mein nahi aayega
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 200,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {
    type: String,
    select: false
  }
}, { timestamps: true })

// Password save karne se pehle hash karo
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Password compare method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export const User = mongoose.model('User', userSchema)
```

**server/src/controllers/authController.js:**
```javascript
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }   // short-lived
  )
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) {
      return res.status(409).json({
        error: existing.email === email ? 'Email already registered' : 'Username taken'
      })
    }

    const user = await User.create({ username, email, password })
    const { accessToken, refreshToken } = generateTokens(user._id)

    // Refresh token DB mein save karo (revocation ke liye)
    await User.findByIdAndUpdate(user._id, { refreshToken })

    // Refresh token secure cookie mein
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    })

    res.status(201).json({
      accessToken,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }
    })
  } catch (error) {
    // User ko generic message, server pe detailed log
    console.error('Register error:', error)
    res.status(500).json({ error: 'Registration failed. Please try again.' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      // Ek hi message dono cases mein (enumeration attack se bachao)
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const { accessToken, refreshToken } = generateTokens(user._id)
    await User.findByIdAndUpdate(user._id, { refreshToken })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      accessToken,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed. Please try again.' })
  }
}

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies
  if (refreshToken) {
    // DB se token hata do (invalidate karo)
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null })
  }
  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out successfully' })
}
```

**server/src/middleware/rateLimiter.js:**
```javascript
import rateLimit from 'express-rate-limit'

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,   // sirf 5 login attempts per 15 min
  message: { error: 'Too many login attempts, please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
})

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 20,   // 20 uploads per hour
  message: { error: 'Upload limit reached, please try again later.' }
})
```

### Step 4: React Frontend Setup (1 ghanta)

```bash
cd ../  # OptimusAutomate_BlogApp/ root mein
npm create vite@latest client -- --template react
cd client
npm install

# Required packages
npm install axios react-router-dom
npm install @tanstack/react-query
npm install zustand
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
npm install react-hot-toast
npm install date-fns
npm install lucide-react       # modern icons
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**client/src/services/api.js — Axios Setup:**
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,  // cookies ke liye
})

// Token header automatically attach karo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 pe auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const { data } = await api.post('/auth/refresh')
        localStorage.setItem('accessToken', data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
```

### Day 1 Checklist:
- [ ] MongoDB Atlas cluster banaya aur connection string mila
- [ ] Cloudinary account setup kiya
- [ ] Backend server run ho raha hai (`npm run dev`)
- [ ] `/api/health` endpoint kaam kar raha hai
- [ ] User register + login APIs Postman se test kiye
- [ ] React frontend run ho raha hai (`npm run dev`)
- [ ] Git commit: `git commit -m "feat: initial project setup with auth system"`

---

## 📅 DAY 2 — Blog App: Complete Backend APIs

### Goal: Posts, Comments, Likes, Image Upload APIs ready

### Step 1: Post Model (30 min)

**server/src/models/Post.js:**
```javascript
import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 150
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  coverImage: {
    url: String,
    publicId: String    // Cloudinary ke liye (delete karne ke liye zaroor)
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  category: {
    type: String,
    enum: ['Technology', 'Design', 'Business', 'Science', 'Lifestyle', 'Other'],
    default: 'Other'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,   // minutes mein
    default: 1
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, { timestamps: true })

// Save karne se pehle slug aur reading time calculate karo
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    const { slugify } = require('slugify')
    this.slug = slugify(this.title, { lower: true, strict: true }) +
                '-' + Date.now().toString(36)
  }
  if (this.isModified('content')) {
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length
    this.readingTime = Math.ceil(wordCount / 200) // 200 words per minute
  }
  next()
})

// Text search index
postSchema.index({ title: 'text', content: 'text', tags: 'text' })

export const Post = mongoose.model('Post', postSchema)
```

### Step 2: Post Controller (2 ghante)

**server/src/controllers/postController.js:**
```javascript
import { Post } from '../models/Post.js'
import { cloudinary } from '../config/cloudinary.js'
import { z } from 'zod'

// Input validation schema
const postSchema = z.object({
  title: z.string().min(5).max(150),
  content: z.string().min(50),
  excerpt: z.string().max(300).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  category: z.enum(['Technology', 'Design', 'Business', 'Science', 'Lifestyle', 'Other']).optional(),
  status: z.enum(['draft', 'published']).optional()
})

export const createPost = async (req, res) => {
  try {
    const data = postSchema.parse(req.body)
    const post = await Post.create({
      ...data,
      author: req.user.userId  // JWT se aata hai
    })
    await post.populate('author', 'username avatar')
    res.status(201).json(post)
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    console.error('Create post error:', error)
    res.status(500).json({ error: 'Failed to create post' })
  }
}

export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, author } = req.query

    // Input sanitize karo
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(20, parseInt(limit))  // max 20 per page

    const filter = { status: 'published' }
    if (category) filter.category = category
    if (author) filter.author = author
    if (search) filter.$text = { $search: search.slice(0, 100) } // max 100 chars

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .select('-content'),  // list mein full content mat do
      Post.countDocuments(filter)
    ])

    res.json({
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
}

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found' })

    const userId = req.user.userId
    const liked = post.likes.includes(userId)

    if (liked) {
      post.likes.pull(userId)
    } else {
      post.likes.push(userId)
    }

    await post.save()
    res.json({ liked: !liked, likeCount: post.likes.length })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update like' })
  }
}

// Image upload to Cloudinary
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    // File type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only JPEG, PNG, WebP, GIF allowed' })
    }

    res.json({
      url: req.file.path,           // Cloudinary URL
      publicId: req.file.filename   // delete ke liye
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Image upload failed' })
  }
}
```

### Step 3: Comment Model + Controller (1 ghanta)

**server/src/models/Comment.js:**
```javascript
import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null  // null = top-level comment, ObjectId = reply
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true })

export const Comment = mongoose.model('Comment', commentSchema)
```

### Step 4: API Routes Register Karo (30 min)

**server/src/routes/postRoutes.js:**
```javascript
import { Router } from 'express'
import { authenticate } from '../middleware/authMiddleware.js'
import { authLimiter, uploadLimiter } from '../middleware/rateLimiter.js'
import { upload } from '../config/cloudinary.js'
import {
  createPost, getPosts, getPost,
  updatePost, deletePost, toggleLike, uploadImage
} from '../controllers/postController.js'

const router = Router()

router.get('/', getPosts)                              // public
router.get('/:slug', getPost)                          // public

router.use(authenticate)                               // ye line ke baad sab protected
router.post('/', createPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.post('/:id/like', toggleLike)
router.post('/upload', uploadLimiter, upload.single('image'), uploadImage)

export { router as postRoutes }
```

### Day 2 Checklist:
- [ ] Post CRUD APIs Postman se test kiye
- [ ] Image upload Cloudinary pe ja rahi hai
- [ ] Like/Unlike kaam kar raha hai
- [ ] Comments API test kiya
- [ ] Rate limiting kaam kar rahi hai
- [ ] `git commit -m "feat: blog post and comment APIs complete"`

---

## 📅 DAY 3 — Blog App: Frontend + Deploy

### Goal: Beautiful UI build karo aur live deploy karo

### Step 1: 3D Glass Navbar Component (1 ghanta)

**client/src/components/layout/Navbar.jsx:**
```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PenSquare, Search, Bell, Menu, X } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
         style={{
           background: 'rgba(10, 10, 15, 0.8)',
           backdropFilter: 'blur(20px)',
           WebkitBackdropFilter: 'blur(20px)',
           borderBottom: '1px solid rgba(255,255,255,0.06)'
         }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}>
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-lg"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
              BlogFlow
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/search"
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Search size={20} />
            </Link>

            {user ? (
              <>
                <button
                  onClick={() => navigate('/create')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    boxShadow: '0 0 20px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <PenSquare size={16} />
                  Write
                </button>
                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                     alt={user.username}
                     className="w-8 h-8 rounded-full cursor-pointer border border-white/10"
                     onClick={() => navigate(`/profile/${user.username}`)} />
              </>
            ) : (
              <Link to="/auth"
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ border: '1px solid rgba(99,102,241,0.5)', color: '#6366f1' }}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

### Step 2: Post Card Component — Glass Style (1 ghanta)

**client/src/components/blog/PostCard.jsx:**
```jsx
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Clock, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function PostCard({ post }) {
  return (
    <article
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(12px)',
        // Hover pe card uthegi (3D lift)
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Cover Image */}
      {post.coverImage?.url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.coverImage.url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(10,10,15,0.9))' }} />

          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(99,102,241,0.2)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  color: '#a5b4fc'
                }}>
            {post.category}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Author Row */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username}`}
            alt={post.author?.username}
            className="w-7 h-7 rounded-full border border-white/10"
          />
          <div>
            <span className="text-sm font-medium text-gray-300">{post.author?.username}</span>
            <span className="text-xs text-gray-500 ml-2">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h2 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2 hover:text-indigo-400 transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag}
                    className="text-xs px-2 py-1 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-4"
             style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {post.readingTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Heart size={12} /> {post.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} /> {post.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} /> {post.commentCount || 0}
          </span>
        </div>
      </div>
    </article>
  )
}
```

### Step 3: TipTap Rich Text Editor (1 ghanta)

**client/src/components/blog/PostEditor.jsx:**
```jsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import {
  Bold, Italic, List, ListOrdered, Image as ImageIcon,
  Link as LinkIcon, Heading1, Heading2, Code, Quote
} from 'lucide-react'

const ToolbarButton = ({ onClick, active, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="p-2 rounded-lg transition-all"
    style={{
      background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
      color: active ? '#a5b4fc' : '#94a3b8',
      border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent'
    }}
    onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
    onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
  >
    {children}
  </button>
)

export default function PostEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4'
      }
    }
  })

  if (!editor) return null

  return (
    <div className="rounded-2xl overflow-hidden"
         style={{
           background: 'rgba(255,255,255,0.03)',
           border: '1px solid rgba(255,255,255,0.08)'
         }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3"
           style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}
                       active={editor.isActive('bold')} title="Bold">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}
                       active={editor.isActive('italic')} title="Italic">
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                       active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                       active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()}
                       active={editor.isActive('bulletList')} title="Bullet List">
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()}
                       active={editor.isActive('orderedList')} title="Numbered List">
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                       active={editor.isActive('codeBlock')} title="Code Block">
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()}
                       active={editor.isActive('blockquote')} title="Quote">
          <Quote size={16} />
        </ToolbarButton>
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} className="text-gray-200" />
    </div>
  )
}
```

### Step 4: Deploy Blog App (2 ghante)

**Backend — Render pe:**
1. render.com pe jao, New Web Service banao
2. GitHub repo connect karo (`OptimusAutomate_BlogApp`)
3. Root directory: `server`
4. Build command: `npm install`
5. Start command: `node src/app.js`
6. Environment Variables add karo (sab `.env` wale)
7. Deploy karo — URL milega: `https://blogapp-server.onrender.com`

**Frontend — Vercel pe:**
1. vercel.com pe jao, New Project banao
2. Same repo connect karo
3. Root directory: `client`
4. Environment Variable add karo: `VITE_API_URL=https://blogapp-server.onrender.com/api`
5. Deploy karo — URL milega: `https://blogapp.vercel.app`

**client/.env (production):**
```
VITE_API_URL=https://your-render-backend.onrender.com/api
```

### Day 3 Checklist:
- [ ] Navbar + Home page 3D glass style mein ban gaya
- [ ] Post card component ho gaya
- [ ] TipTap editor kaam kar raha hai
- [ ] Image upload frontend se kaam kar rahi hai
- [ ] Backend Render pe live hai
- [ ] Frontend Vercel pe live hai
- [ ] Live URL test kiya — register, login, post create, image upload
- [ ] `git commit -m "feat: blog app frontend complete and deployed"`

---

## 📅 DAY 4 — PM Tool: Complete Backend APIs

### Goal: Boards, Lists, Cards, Activity Log APIs

### Step 1: PM Tool Backend Setup (30 min)

```bash
cd ../  # root folder mein
mkdir OptimusAutomate_PMTool
# Same backend structure copy karo, sirf models change honge
```

### Step 2: Database Models (1.5 ghante)

**server/src/models/Board.js:**
```javascript
import mongoose from 'mongoose'

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, maxlength: 500, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member'], default: 'member' }
  }],
  coverColor: {
    type: String,
    enum: ['indigo', 'cyan', 'violet', 'emerald', 'rose', 'amber'],
    default: 'indigo'
  },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true })

export const Board = mongoose.model('Board', boardSchema)
```

**server/src/models/List.js:**
```javascript
import mongoose from 'mongoose'

const listSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  position: { type: Number, required: true },  // order maintain karne ke liye
  cardCount: { type: Number, default: 0 }
}, { timestamps: true })

export const List = mongoose.model('List', listSchema)
```

**server/src/models/Card.js:**
```javascript
import mongoose from 'mongoose'

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, maxlength: 2000, default: '' },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  position: { type: Number, required: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dueDate: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  labels: [{
    text: String,
    color: String  // hex color
  }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now }
  }],
  isArchived: { type: Boolean, default: false }
}, { timestamps: true })

export const Card = mongoose.model('Card', cardSchema)
```

**server/src/models/Activity.js:**
```javascript
import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema({
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['card_created', 'card_moved', 'card_assigned', 'card_due_date',
           'card_commented', 'list_created', 'member_added'],
    required: true
  },
  data: mongoose.Schema.Types.Mixed  // flexible data (card title, list name, etc.)
}, { timestamps: true })

export const Activity = mongoose.model('Activity', activitySchema)
```

### Step 3: Card Controller — Move Card (Drag & Drop Backend) (1 ghanta)

**server/src/controllers/cardController.js:**
```javascript
import { Card } from '../models/Card.js'
import { List } from '../models/List.js'
import { Activity } from '../models/Activity.js'
import { z } from 'zod'

const cardSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  dueDate: z.string().datetime().optional(),
  assignees: z.array(z.string()).optional()
})

// Card ko ek list se doosri mein move karo (Drag & Drop)
export const moveCard = async (req, res) => {
  try {
    const { cardId } = req.params
    const { targetListId, newPosition } = req.body

    const card = await Card.findById(cardId)
    if (!card) return res.status(404).json({ error: 'Card not found' })

    // Authorization: sirf board member move kar sakta hai
    // (board membership check)

    const oldListId = card.list.toString()
    const oldList = await List.findById(oldListId)
    const targetList = await List.findById(targetListId)

    if (!targetList) return res.status(404).json({ error: 'Target list not found' })

    // Positions update karo
    card.list = targetListId
    card.position = newPosition
    await card.save()

    // Activity log
    await Activity.create({
      board: card.board,
      user: req.user.userId,
      type: 'card_moved',
      data: {
        cardTitle: card.title,
        fromList: oldList.title,
        toList: targetList.title
      }
    })

    res.json({ success: true, card })
  } catch (error) {
    console.error('Move card error:', error)
    res.status(500).json({ error: 'Failed to move card' })
  }
}
```

### Day 4 Checklist:
- [ ] Board, List, Card, Activity models bane
- [ ] CRUD APIs sab test kiye
- [ ] Card move API kaam kar rahi hai
- [ ] Activity log save ho raha hai
- [ ] `git commit -m "feat: PM tool backend APIs complete"`

---

## 📅 DAY 5 — PM Tool: Drag & Drop Frontend

### Goal: Visual Kanban board with @dnd-kit

### Step 1: @dnd-kit Setup (30 min)

```bash
cd client
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install react-datepicker date-fns
npm install @headlessui/react   # accessible modal/dropdown
```

### Step 2: Main Kanban Board Component (3 ghante)

**client/src/components/board/BoardView.jsx:**
```jsx
import { useState, useEffect } from 'react'
import {
  DndContext, DragOverlay, closestCorners,
  PointerSensor, useSensor, useSensors
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import Column from './Column'
import TaskCard from './TaskCard'
import { Plus } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function BoardView({ boardId }) {
  const [lists, setLists] = useState([])
  const [cards, setCards] = useState({})  // { listId: [cards] }
  const [activeCard, setActiveCard] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }  // 8px drag se activate hoga
    })
  )

  useEffect(() => {
    fetchBoardData()
  }, [boardId])

  const fetchBoardData = async () => {
    try {
      const { data } = await api.get(`/boards/${boardId}`)
      setLists(data.lists)
      const cardMap = {}
      data.lists.forEach(list => {
        cardMap[list._id] = list.cards || []
      })
      setCards(cardMap)
    } catch {
      toast.error('Failed to load board')
    }
  }

  const handleDragStart = ({ active }) => {
    const card = Object.values(cards).flat().find(c => c._id === active.id)
    setActiveCard(card)
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveCard(null)
    if (!over) return

    const cardId = active.id
    const targetListId = over.data.current?.listId || over.id

    // Find current list
    const sourceListId = Object.entries(cards).find(
      ([, listCards]) => listCards.some(c => c._id === cardId)
    )?.[0]

    if (!sourceListId || sourceListId === targetListId) return

    // Optimistic UI update (instant feedback)
    const card = cards[sourceListId].find(c => c._id === cardId)
    setCards(prev => ({
      ...prev,
      [sourceListId]: prev[sourceListId].filter(c => c._id !== cardId),
      [targetListId]: [...(prev[targetListId] || []), card]
    }))

    // API call (backend update)
    try {
      await api.patch(`/cards/${cardId}/move`, {
        targetListId,
        newPosition: cards[targetListId].length
      })
      toast.success('Card moved!')
    } catch {
      // Revert on failure
      setCards(prev => ({
        ...prev,
        [targetListId]: prev[targetListId].filter(c => c._id !== cardId),
        [sourceListId]: [...(prev[sourceListId] || []), card]
      }))
      toast.error('Failed to move card')
    }
  }

  return (
    <div className="flex gap-4 p-6 overflow-x-auto min-h-screen"
         style={{ background: '#0a0a0f' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={lists.map(l => l._id)} strategy={horizontalListSortingStrategy}>
          {lists.map(list => (
            <Column
              key={list._id}
              list={list}
              cards={cards[list._id] || []}
              onCardAdded={fetchBoardData}
            />
          ))}
        </SortableContext>

        {/* Dragging card preview */}
        <DragOverlay>
          {activeCard && (
            <TaskCard card={activeCard} isDragging={true} />
          )}
        </DragOverlay>
      </DndContext>

      {/* Add List Button */}
      <button
        onClick={() => {/* add list modal */}}
        className="flex-shrink-0 w-72 h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#94a3b8'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
      >
        <Plus size={16} />
        Add list
      </button>
    </div>
  )
}
```

### Step 3: Task Card Component (1 ghanta)

**client/src/components/board/TaskCard.jsx:**
```jsx
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, User, AlertCircle } from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'

const priorityConfig = {
  low:      { color: '#10b981', bg: 'rgba(16,185,129,0.15)',  label: 'Low' },
  medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Medium' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.15)', label: 'High' },
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  label: 'Critical' }
}

export default function TaskCard({ card, isDragging, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } =
    useSortable({ id: card._id, data: { type: 'card', listId: card.list } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1
  }

  const priority = priorityConfig[card.priority] || priorityConfig.medium
  const isOverdue = card.dueDate && isPast(new Date(card.dueDate)) && !isToday(new Date(card.dueDate))

  return (
    <div
      ref={setNodeRef}
      style={{ ...style }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="group relative rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all duration-200"
      style={{
        ...style,
        background: isDragging
          ? 'rgba(99,102,241,0.1)'
          : 'rgba(255,255,255,0.04)',
        border: isDragging
          ? '1px solid rgba(99,102,241,0.5)'
          : '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(8px)',
        boxShadow: isDragging
          ? '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(99,102,241,0.2)'
          : 'none'
      }}
    >
      {/* Priority indicator — top-left colored bar */}
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
           style={{ background: priority.color }} />

      {/* Labels */}
      {card.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label, i) => (
            <span key={i}
                  className="h-1.5 w-8 rounded-full"
                  style={{ background: label.color }} />
          ))}
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-gray-200 mb-3 pl-2 line-clamp-2">
        {card.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pl-2">
        {/* Due date */}
        {card.dueDate && (
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                style={{
                  background: isOverdue ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
                  color: isOverdue ? '#ef4444' : '#64748b'
                }}>
            <Calendar size={10} />
            {format(new Date(card.dueDate), 'MMM d')}
            {isOverdue && ' ⚠'}
          </span>
        )}

        {/* Assignee avatars */}
        {card.assignees?.length > 0 && (
          <div className="flex -space-x-2">
            {card.assignees.slice(0, 3).map(user => (
              <img key={user._id}
                   src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                   className="w-6 h-6 rounded-full border border-gray-800"
                   title={user.username}
              />
            ))}
            {card.assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 border border-gray-800">
                +{card.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Priority badge */}
      <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full"
            style={{ background: priority.bg, color: priority.color }}>
        {priority.label}
      </span>
    </div>
  )
}
```

### Day 5 Checklist:
- [ ] Drag & Drop kaam kar raha hai (same list mein reorder)
- [ ] Cross-list card movement kaam kar raha hai
- [ ] Optimistic UI update ho raha hai (instant feedback)
- [ ] Task card priority colors dikh rahi hain
- [ ] Due date overdue indicator kaam kar raha hai
- [ ] Assignee avatars dikh rahe hain
- [ ] `git commit -m "feat: kanban board with drag-and-drop complete"`

---

## 📅 DAY 6 — PM Tool: Deploy + UI Polish

### Goal: Live URL + Dashboard + Full polish

### Step 1: Dashboard Stats (1 ghanta)

**client/src/components/dashboard/StatsBar.jsx:**
```jsx
export default function StatsBar({ stats }) {
  const items = [
    { label: 'Total Tasks',    value: stats.total,    color: '#6366f1', icon: '📋' },
    { label: 'Completed',      value: stats.done,     color: '#10b981', icon: '✅' },
    { label: 'In Progress',    value: stats.inProgress, color: '#f59e0b', icon: '⏳' },
    { label: 'Overdue',        value: stats.overdue,  color: '#ef4444', icon: '⚠️' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map(item => (
        <div key={item.label}
             className="rounded-2xl p-5 transition-all duration-300"
             style={{
               background: 'rgba(255,255,255,0.03)',
               border: '1px solid rgba(255,255,255,0.06)',
               backdropFilter: 'blur(12px)'
             }}
             onMouseEnter={e => e.currentTarget.style.borderColor = `${item.color}40`}
             onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
        >
          <div className="text-2xl mb-1">{item.icon}</div>
          <div className="text-3xl font-bold mb-1" style={{ color: item.color }}>
            {item.value}
          </div>
          <div className="text-sm text-gray-400">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
```

### Step 2: README.md — Tech Stack Documentation (Required by Internship)

**OptimusAutomate_PMTool/README.md:**
```markdown
# OptimusAutomate — Project Management Tool

A full-stack Trello-like project management app with drag-and-drop Kanban boards,
team collaboration, and real-time activity tracking.

## Live URL
- Frontend: https://optimusautomate-pmtool.vercel.app
- Backend API: https://optimusautomate-pmtool-api.onrender.com

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | UI Framework |
| Tailwind CSS | 3.x | Styling |
| @dnd-kit/core | 6.x | Drag & Drop |
| TanStack Query | 5.x | Server State |
| Zustand | 4.x | Client State |
| Lucide React | latest | Icons |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18.x | Runtime |
| Express | 4.x | Web Framework |
| MongoDB | 7.x | Database |
| Mongoose | 8.x | ODM |
| JWT | 9.x | Authentication |
| bcryptjs | 2.x | Password Hashing |
| Zod | 3.x | Input Validation |
| Helmet | 7.x | Security Headers |
| express-rate-limit | 7.x | Rate Limiting |

### DevOps
| Service | Purpose |
|---------|---------|
| Vercel | Frontend Deployment |
| Render | Backend Deployment |
| MongoDB Atlas | Cloud Database |

## Features
- JWT Authentication with refresh token rotation
- Drag & Drop Kanban board
- Team member assignment with avatar display
- Due dates with overdue detection
- Priority levels (Low/Medium/High/Critical)
- Card labels and color tags
- Activity feed / action history
- Board overview dashboard with stats
- Security: Rate limiting, input validation, bcrypt hashing

## Local Setup
...
```

### Step 3: Deploy PM Tool (1.5 ghante)
Same process as Blog App (Day 3, Step 4)

### Day 6 Checklist:
- [ ] Dashboard stats kaam kar rahi hain
- [ ] PM Tool Render pe live hai
- [ ] PM Tool Vercel pe live hai
- [ ] README.md mein tech stack complete documentation hai
- [ ] Dono live URLs test kiye
- [ ] `git commit -m "feat: PM tool deployed and dashboard complete"`

---

## 📅 DAY 7 — Security Audit + GitHub + LinkedIn

### Goal: Sab kuch polish karo aur submit-ready banao

### Step 1: Security Checklist Run Karo (2 ghante)

```bash
# 1. Dependencies vulnerabilities
npm audit --audit-level=high
npm audit fix

# 2. .env files git mein nahi hain?
git log --all --full-history -- "*.env"
cat .gitignore | grep ".env"

# 3. Hardcoded secrets check
grep -r "secret\|password\|apikey" src/ --include="*.js" | grep -v node_modules

# 4. CORS check (production mein '*' nahi hona chahiye)
grep -r "origin.*\*" src/

# 5. Rate limiter kaam kar raha hai?
# Login endpoint pe 6 baar galat password dalo — block hona chahiye
```

### Step 2: GitHub Repos Polish (1 ghanta)

**Har repo mein ye check karo:**
- [ ] `.gitignore` mein `.env`, `node_modules`, `dist` hain
- [ ] `README.md` complete hai (Live URL + Tech Stack + Screenshots)
- [ ] Commits meaningful hain (feat:, fix:, docs: prefix ke saath)
- [ ] `package.json` mein proper name aur description hai

**README mein screenshots add karo:**
1. App ka screenshot lo (browser mein Ctrl+Shift+P > Screenshot)
2. GitHub pe repo mein drag-drop karo image
3. README mein add karo: `![Screenshot](./screenshot.png)`

### Step 3: Demo Video Record Karo (1 ghanta)

**Kya cover karo video mein:**
1. Live URL pe jao (Vercel deployed version)
2. Register karo — show karo registration process
3. Main feature demo karo (Blog: post likho / PM: board create karo, cards drag karo)
4. Mobile responsive dikhao
5. 2-3 minute max video

**Free tools:** OBS Studio (desktop) ya Loom (browser extension)

### Step 4: LinkedIn Post (30 min)

**LinkedIn Post Template:**
```
🚀 Internship Project Complete!

Just finished building two full-stack projects during my @OptimusAutomate internship:

📝 Blog Platform
React + Node.js + MongoDB | TipTap editor | Cloudinary uploads | JWT auth
Live: [vercel link]

📋 Project Management Tool
Drag & Drop Kanban | @dnd-kit | Real-time updates | Team collaboration
Live: [vercel link]

Key learnings:
✅ JWT refresh token rotation
✅ Rate limiting & OWASP security practices
✅ Drag & Drop with @dnd-kit
✅ Cloudinary image management
✅ Vercel + Render deployment

GitHub: [github links]

#FullStack #ReactJS #NodeJS #MongoDB #WebDevelopment #Internship #OptimusAutomate
```

### Day 7 Checklist:
- [ ] `npm audit` — zero high/critical vulnerabilities
- [ ] `.env` files GitHub pe nahi hain
- [ ] Dono READMEs mein screenshots + Live URLs hain
- [ ] Demo videos record ho gaye
- [ ] LinkedIn post publish kiya (@OptimusAutomate tag ke saath)
- [ ] Submission form fill kiya
- [ ] GitHub repos: `OptimusAutomate_BlogApp` + `OptimusAutomate_PMTool`

---

## 🎯 QUICK REFERENCE — Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| CORS error frontend se | `CLIENT_URL` env variable check karo Render pe |
| MongoDB connection fail | Atlas IP whitelist mein `0.0.0.0/0` add karo (allow all) |
| Vercel deploy fail | `VITE_API_URL` env variable add kiya? |
| Image upload fail | Cloudinary credentials `.env` mein sahi hain? |
| JWT expired error | Refresh token rotation kaam kar raha hai? |
| Drag & Drop jerky | `PointerSensor` activationConstraint distance: 8 add karo |
| Rate limit block ho gaya testing mein | `windowMs` temporarily reduce karo development mein |
| Render pe server slow (cold start) | Free tier pe 1-2 min lag sakta hai first request mein — normal hai |

---

## 📦 FINAL SUBMISSION CHECKLIST

**Task 1 — Blog App:**
- [ ] GitHub: `OptimusAutomate_BlogApp` — public repo
- [ ] Live URL (Vercel): working link
- [ ] Features working: Register/Login, Create Post, Rich Text, Image Upload, Comments, Likes
- [ ] LinkedIn video posted with GitHub link

**Task 4 — PM Tool:**
- [ ] GitHub: `OptimusAutomate_PMTool` — public repo
- [ ] Live URL (Vercel): working link
- [ ] Features working: Board create, Lists, Cards, Drag & Drop, Member assign, Due dates, Comments
- [ ] README mein tech stack documented
- [ ] LinkedIn video posted with GitHub link

**Both Projects:**
- [ ] Security checklist passed (PROJECT_SECURITY_CHECKLIST.md)
- [ ] No secrets in git history
- [ ] Rate limiting working on auth endpoints
- [ ] Deployed and accessible from any device

---

*Made for OptimusAutomate Virtual Internship — Full Stack Development Track*
*Total estimated time: 7 days | 6-8 hours per day*
