import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ImageIcon, X } from 'lucide-react'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import PostEditor from '../components/blog/PostEditor.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { usePost, useCreatePost, useUpdatePost } from '../hooks/usePosts.js'
import { postService } from '../services/postService.js'
import toast from 'react-hot-toast'

const CATEGORIES = ['Technology', 'Design', 'Business', 'Science', 'Lifestyle', 'Other']

export default function CreatePost() {
  const { id } = useParams() // if editing
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const isEdit = !!id

  const { data: existingPost, isLoading: loadingPost } = usePost(
    isEdit ? id : '__skip__'
  )
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('Technology')
  const [status] = useState('draft')
  const [coverImage, setCoverImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (isEdit && existingPost) {
      setTitle(existingPost.title || '')
      setContent(existingPost.content || '')
      setExcerpt(existingPost.excerpt || '')
      setTags(existingPost.tags?.join(', ') || '')
      setCategory(existingPost.category || 'Technology')
      setCoverImage(existingPost.coverImage || null)
    }
  }, [isEdit, existingPost])

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) navigate('/auth')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  if (isEdit && loadingPost) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={32} />
      </div>
    )
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const result = await postService.uploadImage(file)
      setCoverImage(result)
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed')
    }
  }

  const removeImage = () => setCoverImage(null)

  const handleSubmit = async (publish = false) => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setIsSubmitting(true)
    const payload = {
      title: title.trim(),
      content,
      excerpt: excerpt.trim() || content.replace(/<[^>]*>/g, '').slice(0, 300),
      tags: tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 10),
      category,
      status: publish ? 'published' : status,
      coverImage: coverImage || undefined,
    }

    try {
      let result
      if (isEdit) {
        result = await updatePost.mutateAsync({ id, payload })
      } else {
        result = await createPost.mutateAsync(payload)
      }
      toast.success(publish ? 'Post published!' : 'Post saved as draft')
      navigate(`/post/${result.slug}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
        {isEdit ? 'Edit Post' : 'Create New Post'}
      </h1>

      {/* Cover image upload */}
      <div className="mb-6">
        {coverImage?.url ? (
          <div className="relative rounded-md overflow-hidden group border border-[var(--border-default)]">
            <img
              src={coverImage.url}
              alt="Cover"
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={removeImage}
                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer border-none"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <label
            className="flex flex-col items-center justify-center gap-2 rounded-md py-10 cursor-pointer transition-colors duration-150 bg-[var(--bg-subtle)] border border-dashed border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-muted)]"
          >
            <ImageIcon size={20} className="text-[var(--text-secondary)]" />
            <span className="text-sm text-[var(--text-secondary)]">Click to add a cover image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Form */}
      <div className="flex flex-col gap-5">
        <Input
          label="Title"
          placeholder="Give your post a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Category selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-150 cursor-pointer border ${
                  category === cat
                    ? 'bg-[var(--accent-subtle)] border-transparent text-[var(--accent-text)]'
                    : 'bg-[var(--bg-page)] border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Tags (comma separated)"
          placeholder="react, javascript, webdev"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <Input
          label="Excerpt (optional)"
          placeholder="A short summary..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />

        {/* Rich text editor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">
            Content
          </label>
          <PostEditor content={content} onChange={setContent} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={() => handleSubmit(true)}
            loading={isSubmitting}
          >
            Publish
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
        </div>
      </div>
    </div>
  )
}
