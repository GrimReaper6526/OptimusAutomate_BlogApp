import { useState } from 'react'
import { postService } from '../services/postService.js'

/**
 * Image upload hook — wraps the Cloudinary upload endpoint.
 * Returns the uploaded { url, publicId } on success.
 */
export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const upload = async (file) => {
    if (!file) return null
    setIsUploading(true)
    setProgress(0)
    try {
      const result = await postService.uploadImage(file)
      setProgress(100)
      return result
    } finally {
      setIsUploading(false)
    }
  }

  return { upload, isUploading, progress }
}

export default useImageUpload
