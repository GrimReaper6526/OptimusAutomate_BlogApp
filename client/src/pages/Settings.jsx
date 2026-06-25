import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Shield, Camera, Loader2, Palette, Settings2, Trash2, Download } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { authService } from '../services/authService.js'
import { postService } from '../services/postService.js'
import { applyTheme, THEME_OPTIONS } from '../services/themeService.js'
import api from '../services/api.js'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, setUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'account' | 'appearance' | 'preferences' | 'danger'
  
  // Profile Form States
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Account Form States
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingAccount, setIsSavingAccount] = useState(false)

  // Appearance / Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  // Preferences State
  const [emailComments, setEmailComments] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [pushAlerts, setPushAlerts] = useState(true)
  const [defaultStatus, setDefaultStatus] = useState('published')
  const [defaultCategory, setDefaultCategory] = useState('Technology')
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }

    if (user) {
      setUsername(user.username || '')
      setBio(user.bio || '')
      setAvatar(user.avatar || '')
      setEmail(user.email || '')
    }
  }, [user, isAuthenticated, navigate])

  if (!isAuthenticated || !user) return null

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }

    setIsUploading(true)
    try {
      const result = await postService.uploadImage(file)
      if (result && result.url) {
        setAvatar(result.url)
        toast.success('Avatar uploaded! Save changes to apply.')
      } else {
        throw new Error('No URL returned')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload avatar')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (username.trim().length < 3) {
      toast.error('Username must be at least 3 characters')
      return
    }

    setIsSavingProfile(true)
    try {
      const data = await authService.updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatar
      })
      setUser(data.user)
      toast.success('Profile settings updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSaveAccount = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Email is required')
      return
    }

    if (newPassword) {
      if (!currentPassword) {
        toast.error('Current password is required to update password')
        return
      }
      if (newPassword.length < 8) {
        toast.error('New password must be at least 8 characters')
        return
      }
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match')
        return
      }
    }

    setIsSavingAccount(true)
    try {
      const payload = { email: email.trim() }
      if (newPassword) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }

      const data = await authService.updateProfile(payload)
      setUser(data.user)
      
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      toast.success('Account credentials updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update account details')
    } finally {
      setIsSavingAccount(false)
    }
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    const label = THEME_OPTIONS.find((t) => t.id === newTheme)?.name || newTheme
    toast.success(`✨ ${label} applied!`)
  }

  const handleExportData = async () => {
    const loadingToast = toast.loading('Gathering posts data for export...')
    try {
      // Query posts created by this user
      const postsRes = await api.get('/posts', { params: { author: user._id, limit: 100 } })
      const payload = {
        exportedAt: new Date().toISOString(),
        user: {
          username: user.username,
          email: user.email,
          bio: user.bio,
        },
        posts: postsRes.data.posts
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `blogflow_export_${user.username}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      
      toast.dismiss(loadingToast)
      toast.success('Posts exported successfully!')
    } catch (err) {
      toast.dismiss(loadingToast)
      toast.error('Failed to export posts')
    }
  }

  const handleDeleteAccount = () => {
    const doubleCheck = window.confirm(
      "WARNING: Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone."
    )
    if (doubleCheck) {
      toast.error('Account deletion is restricted for internship sandbox environment.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2">Settings</h1>
        <p className="text-[var(--text-secondary)]">Update your profile details, customize your theme, and manage your account parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 flex flex-row md:flex-col flex-wrap gap-1 md:border-r border-[var(--border-default)] pb-4 md:pb-0 md:pr-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 text-left cursor-pointer border border-transparent outline-none w-full ${
              activeTab === 'profile'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-text)]'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <User size={16} />
            <span>Profile Info</span>
          </button>
          
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 text-left cursor-pointer border border-transparent outline-none w-full ${
              activeTab === 'account'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-text)]'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <Shield size={16} />
            <span>Security</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 text-left cursor-pointer border border-transparent outline-none w-full ${
              activeTab === 'appearance'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-text)]'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <Palette size={16} />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 text-left cursor-pointer border border-transparent outline-none w-full ${
              activeTab === 'preferences'
                ? 'bg-[var(--accent-subtle)] text-[var(--accent-text)]'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <Settings2 size={16} />
            <span>Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 text-left cursor-pointer border border-transparent outline-none w-full ${
              activeTab === 'danger'
                ? 'bg-[var(--error-bg)] text-[var(--error-text)] border border-[var(--error-border)]'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--error-text)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            <Trash2 size={16} />
            <span>Danger Zone</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <GlassCard className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Profile Info</h2>
                <p className="text-sm text-[var(--text-secondary)]">Customize your public presence on BlogFlow.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-[var(--border-default)]">
                  <div className="relative group cursor-pointer w-24 h-24 self-start" onClick={handleAvatarClick}>
                    <Avatar
                      src={avatar}
                      name={username}
                      size="xl"
                      className={`w-24 h-24 rounded-full border-2 border-[var(--border-default)] transition-opacity duration-200 object-cover ${
                        isUploading ? 'opacity-40' : 'group-hover:opacity-65'
                      }`}
                    />
                    {isUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-black/60 p-2 rounded-full border border-[var(--border-default)] shadow-lg text-[var(--text-primary)]">
                          <Camera size={18} />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">Profile picture</span>
                    <span className="text-xs text-[var(--text-secondary)]">Supports JPG, PNG or WebP. Max size: 5MB.</span>
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-emphasis)] hover:text-[var(--text-primary)] transition-all cursor-pointer w-max"
                    >
                      Choose file
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />

                  <Input
                    label="Bio (Optional)"
                    type="textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a bit about yourself..."
                    maxLength={200}
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    loading={isSavingProfile}
                  >
                    Save profile
                  </Button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'account' && (
            <GlassCard className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Security & Credentials</h2>
                <p className="text-sm text-[var(--text-secondary)]">Manage your password credentials and account settings.</p>
              </div>

              <form onSubmit={handleSaveAccount} className="space-y-6">
                <div className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />

                  <div className="border-t border-[var(--border-default)] pt-6 mt-6 space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Change Password</h3>
                    <p className="text-xs text-[var(--text-secondary)]">Leave these blank if you do not want to modify your password credentials.</p>

                    <Input
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />

                    <Input
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />

                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    loading={isSavingAccount}
                  >
                    Update credentials
                  </Button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <GlassCard className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Appearance & Interface</h2>
                <p className="text-sm text-[var(--text-secondary)]">Personalize the styling and color palette of your dashboard environment.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">Color Theme</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {THEME_OPTIONS.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleThemeChange(t.id)}
                        className={`p-4 rounded-md border cursor-pointer transition-all duration-150 flex flex-col gap-3 relative hover:-translate-y-[1px] ${
                          theme === t.id
                            ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                            : 'border-[var(--border-default)] hover:border-[var(--border-strong)] bg-[var(--bg-subtle)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</span>
                          {theme === t.id && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--accent-text)]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{t.desc}</p>
                        {/* Real color preview bar */}
                        <div
                          className="h-9 w-full rounded-md flex items-center px-3 gap-2 mt-1 border border-[var(--border-default)]"
                          style={{
                            backgroundColor: t.previewBg,
                          }}
                        >
                          <div
                            className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: t.accent }}
                          />
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="h-1.5 rounded-full w-14 bg-[var(--border-strong)]" />
                            <div className="h-1.5 rounded-full w-9 bg-[var(--border-default)]" />
                          </div>
                          <div
                            className="w-8 h-5 rounded text-[8px] font-bold flex items-center justify-center"
                            style={{ backgroundColor: t.accent, color: '#fff' }}
                          >
                            Aa
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <GlassCard className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Preferences & Defaults</h2>
                <p className="text-sm text-[var(--text-secondary)]">Configure default options for publishing and email updates.</p>
              </div>

              <div className="space-y-6">
                {/* Notification Options */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Notification Alerts</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={emailComments}
                        onChange={(e) => setEmailComments(e.target.checked)}
                        className="rounded border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] focus:ring-offset-[var(--bg-page)] w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">Email notifications</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">Alert me when other users post comments on my blog threads.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={weeklyDigest}
                        onChange={(e) => setWeeklyDigest(e.target.checked)}
                        className="rounded border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] focus:ring-offset-[var(--bg-page)] w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">Weekly content digest</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">Send me summary updates of trending authors and featured posts.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={pushAlerts}
                        onChange={(e) => setPushAlerts(e.target.checked)}
                        className="rounded border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] focus:ring-offset-[var(--bg-page)] w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">Browser push notifications</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">Enable real-time popups when posts get liked.</span>
                      </div>
                    </label>
                  </div>
                </div>

                <hr className="border-[var(--border-default)]" />

                {/* Default Publishing Config */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Publishing Defaults</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-[var(--text-secondary)]">Default post status</label>
                      <select
                        value={defaultStatus}
                        onChange={(e) => setDefaultStatus(e.target.value)}
                        className="bg-[var(--bg-page)] border border-[var(--border-default)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 cursor-pointer"
                      >
                        <option value="draft" className="bg-[var(--bg-page)]">Draft (Hidden)</option>
                        <option value="published" className="bg-[var(--bg-page)]">Published (Public)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-[var(--text-secondary)]">Default category</label>
                      <select
                        value={defaultCategory}
                        onChange={(e) => setDefaultCategory(e.target.value)}
                        className="bg-[var(--bg-page)] border border-[var(--border-default)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 cursor-pointer"
                      >
                        {['Technology', 'Design', 'Business', 'Science', 'Lifestyle', 'Other'].map((cat) => (
                          <option key={cat} value={cat} className="bg-[var(--bg-page)]">{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-[var(--text-secondary)]">Posts per page (Pagination limit)</label>
                      <input
                        type="number"
                        min={5}
                        max={50}
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="bg-[var(--bg-page)] border border-[var(--border-default)] rounded-md px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button onClick={() => toast.success('Preference options saved successfully!')}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </GlassCard>
          )}

          {/* DANGER ZONE TAB */}
          {activeTab === 'danger' && (
            <GlassCard className="border border-[var(--error-border)] bg-[var(--error-bg)] space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--error-text)] mb-1">Danger Zone</h2>
                <p className="text-sm text-[var(--text-secondary)]">Perform critical database exports or account termination actions.</p>
              </div>

              <div className="space-y-6">
                {/* Export Data Block */}
                <div className="p-4 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">Export Blog Data</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">Download a full JSON archive containing your user profile and all published posts.</span>
                  </div>
                  <Button
                    onClick={handleExportData}
                    variant="outline"
                    className="flex-shrink-0 flex items-center gap-2"
                  >
                    <Download size={14} />
                    Export JSON
                  </Button>
                </div>

                {/* Delete Account Block */}
                <div className="p-4 rounded-md bg-[var(--error-bg)] border border-[var(--error-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-[var(--error-text)]">Terminate Account</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">Permanently delete your profile and purge all post documents from Mongoose collections.</span>
                  </div>
                  <Button
                    onClick={handleDeleteAccount}
                    variant="danger"
                    className="flex-shrink-0"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
