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
    return "Hello! I'm your customer support agent. How can I assist you today? I'm here to help with any questions about our products, services, or account-related inquiries."
  }
  
  if (input.includes("help") || input.includes("support")) {
    return "I'm here to provide excellent customer support! I can help with order inquiries, product information, account issues, returns, and general questions. What can I assist you with today?"
  }
  
  if (input.includes("order") || input.includes("purchase") || input.includes("buy")) {
    return "I can help you with your order! I can check order status, help with purchases, process returns, and answer questions about our products. Do you have an order number or need help finding something specific?"
  }
  
  if (input.includes("product") || input.includes("item") || input.includes("catalog")) {
    return "I'd be happy to help you find the right product! I can provide information about our products, check availability, compare options, and help you make the best choice. What are you looking for?"
  }
  
  if (input.includes("return") || input.includes("refund") || input.includes("exchange")) {
    return "I can help you with returns and exchanges! I can process return requests, explain our return policy, and help you get a refund or exchange. What item would you like to return?"
  }
  
  if (input.includes("account") || input.includes("login") || input.includes("password")) {
    return "I can help you with account-related issues! I can assist with login problems, password resets, account updates, and general account questions. What account issue are you experiencing?"
  }
  
  if (input.includes("shipping") || input.includes("delivery") || input.includes("track")) {
    return "I can help you with shipping and delivery! I can track your package, provide shipping estimates, explain delivery options, and help resolve any delivery issues. What shipping information do you need?"
  }
  
  if (input.includes("price") || input.includes("cost") || input.includes("discount")) {
    return "I can help you with pricing information! I can check current prices, apply available discounts, explain pricing policies, and help you find the best deals. What pricing information do you need?"
  }
  
  if (input.includes("thank")) {
    return "You're very welcome! I'm glad I could help. Is there anything else you need assistance with today?"
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
