"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, CheckCircle, Clock, Settings } from "lucide-react"
import type { Message } from "@/types"
import { simulateAIResponse } from "@/lib/mock-api"

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
          id: Date.now().toString(),
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
      id: Date.now().toString(),
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
          id: (Date.now() + 1).toString(),
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
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />
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
      <div className="p-6 border-b border-gray-100 flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-medium text-gray-900">Agent Smith</h3>
          <p className="text-sm text-gray-500 font-light">AI Agent Builder</p>
        </div>
      </div>

      {/* Build Simulation */}
      {showBuildSimulation ? (
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Building Customer Support Agent</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowBuildSimulation(false)}
              className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1"
            >
              Hide
            </Button>
          </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Progress</span>
            <span>{buildProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${buildProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Build Steps */}
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {buildSteps.map((step) => (
            <div key={step.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-900">Step {step.id}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-600">{step.agent}</span>
                </div>
                <h5 className="text-xs font-medium text-gray-900 mb-1">{step.title}</h5>
                {step.result && (
                  <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                    <strong>Result:</strong> {formatResult(step.result)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Success Message */}
        {buildProgress === 100 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-800">Agent Successfully Built!</span>
            </div>
            <p className="text-xs text-green-700">
              Your customer support agent is ready for deployment with all the tools and capabilities you requested.
            </p>
          </div>
        )}
        </div>
      ) : (
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Build Simulation Hidden</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowBuildSimulation(true)}
              className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1"
            >
              Show
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 animate-slide-in ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-900 border border-gray-100"
              }`}
            >
              {message.content}
            </div>
            {message.role === "user" && (
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">U</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-4 animate-slide-in">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-50 text-gray-900 p-4 rounded-2xl border border-gray-100 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Continue building your agent..."
            className="flex-1 min-h-[48px] max-h-[120px] bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 resize-none text-sm font-light focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-xl"
            rows={1}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="bg-gray-900 hover:bg-gray-800 text-white self-end rounded-xl h-12 w-12 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
