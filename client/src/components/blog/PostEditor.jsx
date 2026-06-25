import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Code,
  Quote,
  Minus,
} from 'lucide-react'

const TOOLBAR_BUTTON_STYLE = {
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: 'var(--radius-md)',
  padding: '0.4rem',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const ACTIVE_STYLE = {
  background: 'var(--accent-subtle)',
  border: '1px solid var(--accent-subtle)',
  color: 'var(--accent-text)',
}

function ToolbarButton({ onClick, active, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{ ...TOOLBAR_BUTTON_STYLE, ...(active ? ACTIVE_STYLE : {}) }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--bg-subtle)'
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return (
    <div
      style={{
        width: 1,
        height: 20,
        background: 'var(--border-default)',
        margin: '0 4px',
        flexShrink: 0,
      }}
    />
  )
}

export default function PostEditor({ content, onChange, placeholder = 'Start writing your post...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-md max-w-full' },
      }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor: ed }) => onChange?.(ed.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose-blog max-w-none focus:outline-none min-h-[300px] p-4 text-[var(--text-primary)]',
      },
    },
  })

  if (!editor) return null

  const addImage = () => {
    const url = prompt('Enter the image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const setLink = () => {
    const prev = editor.getAttributes('link').href
    const url = prompt('Enter URL:', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div
      className="rounded-md overflow-hidden bg-[var(--bg-page)] border border-[var(--border-default)] shadow-sm"
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-1 p-2 bg-[var(--bg-subtle)] border-b border-[var(--border-default)]"
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={16} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={addImage}
          active={editor.isActive('image')}
          title="Insert Image"
        >
          <ImageIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={setLink}
          active={editor.isActive('link')}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus size={16} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="relative">
        {placeholder && !editor.getText() && (
          <div
            className="absolute top-4 left-4 pointer-events-none text-[var(--text-tertiary)] text-sm"
            style={{ zIndex: 10 }}
          >
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} className="text-[var(--text-primary)]" />
      </div>
    </div>
  )
}
