import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

// Validate Cloudinary credentials
const hasCredentials =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  !process.env.CLOUDINARY_CLOUD_NAME.startsWith('your_')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/**
 * Multer storage that streams uploads straight to Cloudinary.
 * Files are stored under the "blogapp" folder and use random public ids
 * (original filenames are discarded to avoid path-traversal / collisions).
 *
 * MIME-type and size enforcement happens here too (defense in depth),
 * not only in the controller.
 */
const maxBytes = (parseInt(process.env.MAX_UPLOAD_MB, 10) || 5) * 1024 * 1024

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'blogapp',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    // Random public id — original name is never used
    public_id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  }),
})

export const isCloudinaryConfigured = () => hasCredentials

export const upload = multer({
  storage,
  limits: { fileSize: maxBytes },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, WebP and GIF images are allowed'), false)
    }
  },
})

export { cloudinary }
