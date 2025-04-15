import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Undo,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-gray-50 rounded-t-md">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          'p-2 rounded hover:bg-gray-200',
          editor.isActive('heading', { level: 1 }) && 'bg-gray-200'
        )}
        title="Heading 1"
      >
        <Heading1 className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          'p-2 rounded hover:bg-gray-200',
          editor.isActive('heading', { level: 2 }) && 'bg-gray-200'
        )}
        title="Heading 2"
      >
        <Heading2 className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
          'p-2 rounded hover:bg-gray-200',
          editor.isActive('heading', { level: 3 }) && 'bg-gray-200'
        )}
        title="Heading 3"
      >
        <Heading3 className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn('p-2 rounded hover:bg-gray-200', editor.isActive('bold') && 'bg-gray-200')}
        title="Bold"
      >
        <Bold className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn('p-2 rounded hover:bg-gray-200', editor.isActive('italic') && 'bg-gray-200')}
        title="Italic"
      >
        <Italic className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={cn(
          'p-2 rounded hover:bg-gray-200',
          editor.isActive({ textAlign: 'left' }) && 'bg-gray-200'
        )}
        title="Align Left"
      >
        <AlignLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={cn(
          'p-2 rounded hover:bg-gray-200',
          editor.isActive({ textAlign: 'center' }) && 'bg-gray-200'
        )}
        title="Align Center"
      >
        <AlignCenter className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={cn(
          'p-2 rounded hover:bg-gray-200',
          editor.isActive({ textAlign: 'right' }) && 'bg-gray-200'
        )}
        title="Align Right"
      >
        <AlignRight className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          'p-2 rounded hover:bg-gray-200',
          editor.isActive('bulletList') && 'bg-gray-200'
        )}
        title="Bullet List"
      >
        <List className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          'p-2 rounded hover:bg-gray-200',
          editor.isActive('orderedList') && 'bg-gray-200'
        )}
        title="Ordered List"
      >
        <ListOrdered className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200"
        title="Undo"
      >
        <Undo className="h-5 w-5" />
      </button>
    </div>
  )
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-3',
          },
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  if (!isMounted) {
    return null
  }

  return (
    <div className={cn('border rounded-md overflow-hidden', className)}>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="p-3 min-h-[200px] prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  )
}
