"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Send, Bot, CheckCircle, Clock, Settings } from "lucide-react"
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

// Mock AI responses for the chat interface
const simulateAIResponse = async (userInput: string): Promise<string> => {
  await delay(800 + Math.random() * 1500) // Simulate thinking time (0.8-2.3 seconds)
  
  const input = userInput.toLowerCase()
  
  // Generate contextual responses based on user input for agent building
  if (input.includes("customer support") || input.includes("support agent")) {
    return "I'll help you create a customer support agent! This agent will be able to handle inquiries, troubleshoot issues, and provide helpful solutions. Let me set up the basic framework with tools for knowledge base access, ticket management, and customer database integration."
  }
  
  if (input.includes("data analysis") || input.includes("data analyst")) {
    return "Perfect! I'm creating a data analysis agent for you. This agent will be equipped with tools for data processing, statistical analysis, visualization generation, and report creation. It will be able to work with various data formats and provide insights."
  }
  
  if (input.includes("code") || input.includes("programming") || input.includes("developer")) {
    return "Excellent choice! I'm building a code generation and review agent. This agent will have capabilities for writing code in multiple languages, debugging, code review, and documentation generation. It will be your AI programming partner."
  }
  
  if (input.includes("content") || input.includes("writing") || input.includes("creative")) {
    return "Great idea! I'm creating a content creation agent for you. This agent will specialize in writing articles, marketing copy, technical documentation, and creative content. It will understand tone, style, and audience targeting."
  }
  
  if (input.includes("research") || input.includes("information") || input.includes("assistant")) {
    return "I'll build you a research assistant agent! This agent will be able to gather information from multiple sources, summarize research findings, answer complex questions, and provide comprehensive analysis on various topics."
  }
  
  if (input.includes("project") || input.includes("management") || input.includes("organize")) {
    return "Smart choice! I'm creating a project management agent for you. This agent will help with planning, task organization, timeline management, progress tracking, and team coordination. It will be your AI project coordinator."
  }
  
  // Default response for other inputs
  const responses = [
    "I understand what you're looking for! Let me create an AI agent that can help you with that. I'll configure it with the right tools and capabilities to meet your needs.",
    "That's a great use case for an AI agent! I'm setting up the framework with specialized tools and training it to handle your specific requirements.",
    "Perfect! I'll build an AI agent tailored to your needs. Let me configure the right combination of tools and capabilities to make it effective.",
    "Excellent idea! I'm creating an AI agent that will be perfect for your use case. I'll equip it with the necessary tools and train it on relevant knowledge.",
    "I love that concept! Let me build you an AI agent that can handle this task efficiently. I'll set it up with the right tools and training."
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

interface ChatInterfaceProps {
  initialMessage: string
  onFirstResponse: () => void
}

interface BuildStep {
  id: number
  title: string
  agent: string
  status: "completed" | "in_progress" | "pending"
  result?: any
}

export function ChatInterface({ initialMessage, onFirstResponse }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: initialMessage,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [buildProgress, setBuildProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showBuildSimulation, setShowBuildSimulation] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const buildSteps: BuildStep[] = [
    {
      id: 1,
      title: "Analyzing customer support requirements",
      agent: "requirements_analyzer",
      status: "completed",
      result: {
        purpose: "Handles customer inquiries with empathy and efficiency",
        main_capabilities: [
          "Ticket management",
          "Knowledge base search",
          "Escalation handling"
        ],
        suggested_tools: [
          "search_knowledge_base",
          "create_ticket",
          "escalate_issue"
        ],
        complexity: "medium"
      }
    },
    {
      id: 2,
      title: "Designing multi-agent support architecture",
      agent: "architecture_planner",
      status: "completed",
      result: {
        main_agent_name: "support_coordinator",
        agents: [
          {
            name: "support_coordinator",
            type: "sequential_agent",
            purpose: "Coordinates customer support workflow",
            sub_agents: [
              "inquiry_classifier",
              "issue_resolver",
              "escalation_handler"
            ]
          }
        ]
      }
    },
    {
      id: 3,
      title: "Setting up customer support project",
      agent: "create_project",
      status: "completed",
      result: {
        status: "success",
        project_id: "proj_support_001"
      }
    },
    {
      id: 4,
      title: "Building specialized support agents",
      agent: "agent_builder",
      status: "completed",
      result: {
        agents_created: ["inquiry_classifier", "issue_resolver"],
        status: "created"
      }
    },
    {
      id: 5,
      title: "Creating customer support tools",
      agent: "tool_builder",
      status: "completed",
      result: {
        tools_created: ["search_knowledge_base", "create_ticket"],
        status: "created"
      }
    },
    {
      id: 6,
      title: "Finalizing customer support system",
      agent: "generate_agent_code",
      status: "completed",
      result: {
        files_generated: [
          "agent.py",
          "requirements.txt",
          "README.md",
          ".env.example"
        ],
        agents_created: 3,
        tools_created: 4,
        ready_for_deployment: true
      }
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Simulate initial AI response and build progress
    const handleInitialResponse = async () => {
      // Start building progress
      const progressInterval = setInterval(() => {
        setBuildProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 1
        })
      }, 100)

      // Simulate AI response
      const response = await simulateAIResponse(initialMessage)
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ])
      setIsLoading(false)
      onFirstResponse()
    }

    handleInitialResponse()
  }, [initialMessage, onFirstResponse])

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
      const response = await simulateAIResponse(input)
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
      console.error("Error getting AI response:", error)
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

  const getStatusIcon = (status: BuildStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />
      case "pending":
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const formatResult = (result: any): string => {
    if (typeof result === "string") return result
    if (Array.isArray(result)) return result.join(", ")
    if (typeof result === "object") {
      return Object.entries(result)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
        .join(" | ")
    }
    return String(result)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Agent Smith</h3>
            <p className="text-sm text-gray-600 font-medium">AI Agent Builder</p>
          </div>
        </div>
      </div>

      {/* Build Simulation */}
      {showBuildSimulation ? (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900">Building Customer Support Agent</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowBuildSimulation(false)}
              className="text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg px-3 py-2 font-medium transition-colors"
            >
              Hide
            </Button>
          </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-2">
            <span>Progress</span>
            <span className="font-semibold">{buildProgress}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${buildProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Build Steps */}
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {buildSteps.map((step) => (
            <div key={step.id} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">Step {step.id}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs font-medium text-gray-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">{step.agent}</span>
                </div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2">{step.title}</h5>
                {step.result && (
                  <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <strong className="text-gray-900">Result:</strong> {formatResult(step.result)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Success Message */}
        {buildProgress === 100 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-800">Agent Successfully Built!</span>
            </div>
            <p className="text-xs text-green-700 font-medium">
              Your customer support agent is ready for deployment with all the tools and capabilities you requested.
            </p>
          </div>
        )}
        </div>
      ) : (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">Build Simulation Hidden</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowBuildSimulation(true)}
              className="text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg px-3 py-2 font-medium transition-colors"
            >
              Show
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
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
            <div className="bg-white text-gray-900 p-4 rounded-2xl border border-gray-200 text-sm shadow-md">
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

      {/* Input */}
      <div className="p-6 border-t border-gray-200 bg-white shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Continue building your agent..."
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
