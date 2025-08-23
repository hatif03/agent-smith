"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Send, Bot } from "lucide-react"
import type { Message } from "../types"
// Utility functions copied from lib files
// Simulate API delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Generate unique IDs to prevent React key duplication
let idCounter = 0
function generateUniqueId(): string {
  idCounter += 1
  return `${Date.now()}-${idCounter}-${Math.random().toString(36).substr(2, 9)}`
}

// Mock agent responses for the chat interface
const simulateAgentResponse = async (userInput: string): Promise<string> => {
  await delay(1000 + Math.random() * 2000) // Simulate thinking time (1-3 seconds)
  
  const input = userInput.toLowerCase()
  
  // Generate contextual responses based on user input
  if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
    return "Hello! I'm your AI agent. How can I help you today? I'm here to assist with any questions or tasks you might have."
  }
  
  if (input.includes("help") || input.includes("support")) {
    return "I'm here to help! I can assist with various tasks including data analysis, code generation, content creation, and more. What specific area do you need help with?"
  }
  
  if (input.includes("data") || input.includes("analysis") || input.includes("report")) {
    return "I can help you with data analysis! I can process datasets, create visualizations, generate reports, and provide insights. What kind of data are you working with?"
  }
  
  if (input.includes("code") || input.includes("programming") || input.includes("develop")) {
    return "I'm great with code! I can help you write, debug, and optimize code in Python, JavaScript, TypeScript, and other languages. What are you trying to build?"
  }
  
  if (input.includes("write") || input.includes("content") || input.includes("article")) {
    return "I can help you create content! Whether it's articles, marketing copy, technical documentation, or creative writing, I'm here to assist. What type of content do you need?"
  }
  
  if (input.includes("research") || input.includes("information") || input.includes("find")) {
    return "I can help you research topics, gather information, and provide comprehensive answers to your questions. What would you like to learn more about?"
  }
  
  if (input.includes("project") || input.includes("plan") || input.includes("organize")) {
    return "I can help you plan and organize projects! I can create timelines, break down tasks, and help you stay on track. What kind of project are you working on?"
  }
  
  if (input.includes("thank")) {
    return "You're welcome! I'm happy to help. Is there anything else you'd like assistance with?"
  }
  
  // Default response for other inputs
  const responses = [
    "That's an interesting question! Let me think about how I can best help you with that.",
    "I understand what you're asking. Let me provide you with some helpful information.",
    "Great question! I can definitely assist you with that. Let me break it down for you.",
    "I'm here to help with exactly that kind of request. Let me give you a comprehensive answer.",
    "That's a good point! I can provide you with some insights and solutions for that."
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your newly created AI agent. I'm here to help with customer support inquiries. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: generateUniqueId(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await simulateAgentResponse(input)
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error getting agent response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Customer Support Agent</h3>
            <p className="text-sm text-gray-600 font-medium">Test your AI agent</p>
          </div>
        </div>
      </div>

      {/* Messages - scrollable area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 animate-slide-in ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                message.role === "user"
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-white text-gray-900 border border-gray-200 shadow-md"
              }`}
            >
              {message.content}
            </div>
            {message.role === "user" && (
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-md">
                <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-700">U</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-4 animate-slide-in">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white text-gray-900 p-4 rounded-2xl text-sm border border-gray-200 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - fixed at bottom */}
      <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0 shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Test your agent..."
            className="flex-1 min-h-[48px] max-h-[120px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 resize-none text-sm font-medium focus:border-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 rounded-xl shadow-sm"
            rows={1}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="bg-gray-900 hover:bg-gray-800 text-white self-end rounded-xl h-12 w-12 p-0 shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
