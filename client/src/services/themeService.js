/**
 * BlogFlow Theme Service
 * Applies themes by injecting a <style> tag with !important overrides
 * that work even with hardcoded Tailwind hex color classes.
 */

const THEMES = {
  light: {
    '--bg-page': '#FFFFFF',
    '--bg-subtle': '#F9FAFB',
    '--bg-muted': '#F3F4F6',
    '--bg-emphasis': '#E5E7EB',
    '--surface-raised': '#FFFFFF',
    '--surface-overlay': '#FFFFFF',
    '--border-default': '#E5E7EB',
    '--border-strong': '#D1D5DB',
    '--border-focus': '#6366F1',
    '--text-primary': '#111827',
    '--text-secondary': '#6B7280',
    '--text-tertiary': '#9CA3AF',
    '--text-inverse': '#FFFFFF',
    '--text-link': '#4F46E5',
    '--accent-primary': '#4F46E5',
    '--accent-hover': '#4338CA',
    '--accent-subtle': '#EEF2FF',
    '--accent-text': '#4338CA',
    '--success-bg': '#F0FDF4',
    '--success-border': '#BBF7D0',
    '--success-text': '#15803D',
    '--success-icon': '#22C55E',
    '--warning-bg': '#FFFBEB',
    '--warning-border': '#FDE68A',
    '--warning-text': '#B45309',
    '--warning-icon': '#F59E0B',
    '--error-bg': '#FFF1F2',
    '--error-border': '#FECDD3',
    '--error-text': '#BE123C',
    '--error-icon': '#F43F5E',
    '--info-bg': '#EFF6FF',
    '--info-border': '#BFDBFE',
    '--info-text': '#1D4ED8',
    '--info-icon': '#3B82F6',
    bodyBg: '#FFFFFF',
    textColor: '#111827',
    colorScheme: 'light',
  },
  dark: {
    '--bg-page': '#0D0D0D',
    '--bg-subtle': '#141414',
    '--bg-muted': '#1A1A1A',
    '--bg-emphasis': '#262626',
    '--surface-raised': '#171717',
    '--surface-overlay': '#1C1C1C',
    '--border-default': '#2A2A2A',
    '--border-strong': '#3A3A3A',
    '--border-focus': '#6366F1',
    '--text-primary': '#EDEDED',
    '--text-secondary': '#A3A3A3',
    '--text-tertiary': '#737373',
    '--text-inverse': '#0D0D0D',
    '--text-link': '#818CF8',
    '--accent-primary': '#6366F1',
    '--accent-hover': '#818CF8',
    '--accent-subtle': '#1E1B4B',
    '--accent-text': '#A5B4FC',
    '--success-bg': '#052E16',
    '--success-border': '#14532D',
    '--success-text': '#4ADE80',
    '--success-icon': '#22C55E',
    '--warning-bg': '#1C1400',
    '--warning-border': '#422006',
    '--warning-text': '#FCD34D',
    '--warning-icon': '#F59E0B',
    '--error-bg': '#1C0A0A',
    '--error-border': '#450A0A',
    '--error-text': '#FCA5A5',
    '--error-icon': '#F87171',
    '--info-bg': '#0C1A33',
    '--info-border': '#1E3A5F',
    '--info-text': '#93C5FD',
    '--info-icon': '#60A5FA',
    bodyBg: '#0D0D0D',
    textColor: '#EDEDED',
    colorScheme: 'dark',
  },
}

function buildOverrideCSS(t) {
  if (!t) return ''
  return `
    html, body, #root {
      background-color: ${t.bodyBg} !important;
      color: ${t.textColor} !important;
      color-scheme: ${t.colorScheme} !important;
    }
    nav {
      background-color: var(--bg-page) !important;
      border-bottom-color: var(--border-default) !important;
    }
    /* Override all common hardcoded card backgrounds */
    [class*="bg-\\[#0a0a0f\\]"],
    [class*="bg-\\[#12121a\\]"],
    [class*="bg-\\[#0d0d14\\]"],
    [class*="bg-\\[#0d0115\\]"],
    [class*="bg-\\[#040410\\]"] {
      background-color: var(--surface-raised) !important;
    }
    .glass-card {
      background: var(--surface-raised) !important;
      border-color: var(--border-default) !important;
    }
    /* Scrollbar */
    ::-webkit-scrollbar-track {
      background: ${t.bodyBg} !important;
    }
  `
}

export function applyTheme(themeName) {
  const theme = THEMES[themeName] || THEMES.dark
  const root = document.documentElement

  // Remove old theme classes
  root.classList.remove('theme-cyberpunk', 'theme-space', 'theme-light')
  if (themeName !== 'dark') {
    root.classList.add(`theme-${themeName}`)
  }

  // Inject CSS variables as inline style on <html>
  Object.entries(theme).forEach(([key, val]) => {
    if (key.startsWith('--')) {
      root.style.setProperty(key, val)
    }
  })

  // Inject override <style> tag for hardcoded Tailwind classes
  let overrideTag = document.getElementById('blogflow-theme-override')
  if (!overrideTag) {
    overrideTag = document.createElement('style')
    overrideTag.id = 'blogflow-theme-override'
    document.head.appendChild(overrideTag)
  }
  overrideTag.textContent = buildOverrideCSS(theme)

  // Persist
  localStorage.setItem('theme', themeName)
}

export function loadStoredTheme() {
  const stored = localStorage.getItem('theme') || 'dark'
  applyTheme(stored)
  return stored
}

export const THEME_OPTIONS = [
  {
    id: 'light',
    name: 'Minimalist Light',
    desc: 'Clean daylight interface for bright environments',
    previewBg: '#FFFFFF',
    accent: '#4F46E5',
  },
  {
    id: 'dark',
    name: 'Obsidian Dark',
    desc: 'Deep Obsidian Space — Vercel/Linear inspired',
    previewBg: '#0D0D0D',
    accent: '#6366F1',
  },
]
