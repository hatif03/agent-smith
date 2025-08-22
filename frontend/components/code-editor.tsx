"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, Maximize2, Minimize2, X } from "lucide-react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  placeholder?: string
  className?: string
  label?: string
}

export function CodeEditor({ value, onChange, language = "python", placeholder, className, label }: CodeEditorProps) {
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const HeaderContent = () => (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{language}</span>
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-3 text-xs rounded-xl">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="h-8 px-3 rounded-xl">
          {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
        </Button>
      </div>
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Fullscreen Header */}
        <div className="border-b border-gray-100 p-6 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              {label ? `Editing: ${label}` : `${language.toUpperCase()} Code Editor`}
            </h2>
            <p className="text-sm text-gray-500 font-light">Press Escape or click minimize to exit fullscreen</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-10 px-3 text-gray-500 hover:text-gray-900 rounded-xl"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Fullscreen Toolbar */}
        <div className="border-b border-gray-100 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{language}</span>
              <div className="w-px h-4 bg-gray-300" />
              <span className="text-xs text-gray-500">{value.split("\n").length} lines</span>
              <span className="text-xs text-gray-500">{value.length} characters</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-3 text-xs text-gray-600 hover:text-gray-900 rounded-xl"
            >
              {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Fullscreen Editor */}
        <div className="flex-1 p-6">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full font-mono text-sm bg-white text-gray-900 border-gray-200 resize-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 rounded-xl"
            spellCheck={false}
          />
        </div>

        {/* Fullscreen Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={toggleFullscreen}
              className="border-gray-200 text-gray-700 hover:bg-gray-100"
            >
              Done Editing
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <HeaderContent />
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-mono text-sm min-h-[200px] bg-white text-gray-900 border-gray-200 resize-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 rounded-xl"
        spellCheck={false}
      />
    </div>
  )
}
