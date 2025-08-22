"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Code, List, ListOrdered, Quote, Maximize2, Minimize2, X } from "lucide-react"
import { useState } from "react"

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  label?: string
}

export function TipTapEditor({ content, onChange, placeholder, className, label }: TipTapEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: "bg-gray-100 text-gray-700 p-4 rounded-xl font-mono text-sm border border-gray-200",
          },
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none p-4 text-gray-700 ${
          isFullscreen ? "min-h-[calc(100vh-200px)]" : "min-h-[120px]"
        }`,
      },
    },
  })

  if (!editor) {
    return (
      <div className={`border border-gray-200 rounded-xl ${className}`}>
        <div className="p-4 min-h-[120px] text-gray-500 text-sm font-light">Loading editor...</div>
      </div>
    )
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const ToolbarContent = () => (
    <div className="border-b border-gray-100 p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 px-3 rounded-lg ${editor.isActive("bold") ? "bg-gray-100" : ""}`}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 px-3 rounded-lg ${editor.isActive("italic") ? "bg-gray-100" : ""}`}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`h-8 px-3 rounded-lg ${editor.isActive("code") ? "bg-gray-100" : ""}`}
        >
          <Code className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-200 mx-2" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 px-3 rounded-lg ${editor.isActive("bulletList") ? "bg-gray-100" : ""}`}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 px-3 rounded-lg ${editor.isActive("orderedList") ? "bg-gray-100" : ""}`}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-8 px-3 rounded-lg ${editor.isActive("blockquote") ? "bg-gray-100" : ""}`}
        >
          <Quote className="w-4 h-4" />
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="h-8 px-3 rounded-lg">
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </Button>
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Fullscreen Header */}
        <div className="border-b border-gray-100 p-6 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              {label ? `Editing: ${label}` : "Full Screen Editor"}
            </h2>
            <p className="text-sm text-gray-600 font-light">Press Escape or click minimize to exit fullscreen</p>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="h-10 px-3 rounded-xl">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Fullscreen Toolbar */}
        <ToolbarContent />

        {/* Fullscreen Editor */}
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} className="h-full" />
        </div>

        {/* Fullscreen Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={toggleFullscreen} className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
              Done Editing
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`border border-gray-200 rounded-xl ${className}`}>
      <ToolbarContent />
      <EditorContent editor={editor} className="min-h-[120px]" />
    </div>
  )
}
