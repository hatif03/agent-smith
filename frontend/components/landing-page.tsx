"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Send, Bot } from "lucide-react"
import { mockPrompts } from "@/lib/mock-api"
import type { PromptSuggestion } from "@/types"

interface LandingPageProps {
  onSubmit: (message: string) => void
}

export function LandingPage({ onSubmit }: LandingPageProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input.trim())
    }
  }

  const handlePromptClick = (prompt: PromptSuggestion) => {
    setInput(prompt.title)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8">
      <div className="w-full max-w-3xl mx-auto animate-fade-in">
        {/* Brand Header */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-gray-900">Agent Smith</h1>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-xs font-semibold shadow-sm"
              >
                Beta
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">Build AI agents with ease</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
            Create intelligent AI agents for your business needs. Define their personality, knowledge, and capabilities
            through simple conversation.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the AI agent you want to build..."
              className="min-h-[140px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 resize-none pr-16 text-base font-medium focus:border-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-lg"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim()}
              className="absolute bottom-4 right-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg h-10 w-10 p-0 shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Prompt Suggestions */}
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {mockPrompts.map((prompt, index) => (
              <button
                key={prompt.id}
                onClick={() => handlePromptClick(prompt)}
                className="group px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 rounded-full text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 animate-slide-in whitespace-nowrap font-medium shadow-md hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {prompt.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
