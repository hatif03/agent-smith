"use client"

import { useState, useEffect } from "react"
import { Progress } from "./ui/progress"
import { MessageSquare, Settings, Bot, Download, Github } from "lucide-react"
import type { AppState } from "@/types"
import { simulateAgentBuilding } from "@/lib/mock-api"
import { AgentChat } from "./agent-chat"
import { AgentConfig } from "./agent-config"
import { Button } from "./ui/button"
import { codeGenerator } from "@/lib/code-generator"
import { fetchAgentConfig } from "@/lib/agent-api"

interface AppPreviewProps {
  isVisible: boolean
}

export function AppPreview({ isVisible }: AppPreviewProps) {
  const [appState, setAppState] = useState<AppState>({
    isBuilding: true,
    isComplete: false,
    progress: 0,
  })
  const [activeTab, setActiveTab] = useState<"chat" | "config">("chat")
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (isVisible && appState.isBuilding) {
      simulateAgentBuilding((progress) => {
        setAppState((prev) => ({ ...prev, progress }))
        if (progress === 100) {
          setTimeout(() => {
            setAppState((prev) => ({
              ...prev,
              isBuilding: false,
              isComplete: true,
            }))
          }, 500)
        }
      })
    }
  }, [isVisible, appState.isBuilding])

  const handleDownloadCode = async () => {
    setDownloading(true)
    try {
      const config = await fetchAgentConfig()
      await codeGenerator.generateAndDownload(config)
    } catch (error) {
      console.error("Failed togenerate code:", error)
    } finally {
      setDownloading(false)
    }
  }

  if (!isVisible) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-50 flex items-center justify-center">
            <Bot className="w-10 h-10" />
          </div>
          <p className="text-base font-light">Your AI agent will appear here</p>
        </div>
      </div>
    )
  }

  if (appState.isBuilding) {
    return (
      <div className="h-full bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gray-900 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">Building your AI agent...</h3>
            <p className="text-base text-gray-600 font-light">Training the model and setting up capabilities</p>
          </div>

          <div className="space-y-4">
            <Progress value={appState.progress} className="h-2 bg-gray-100" />
            <p className="text-sm text-gray-500 font-light">{appState.progress}% complete</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header with Tabs */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-6">
          <h3 className="text-base font-medium text-gray-900">AI Agent Preview</h3>
          <div className="flex bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "chat" ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2 inline" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "config" ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Settings className="w-4 h-4 mr-2 inline" />
              Config
            </button>
          </div>
        </div>

        {/* Download and GitHub buttons - moved to right corner */}
        {appState.isComplete && (
          <div className="flex gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadCode}
              disabled={downloading}
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all duration-200 text-sm px-4 py-2 h-10 font-medium rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading ? "Generating..." : "Download Agent Code"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all duration-200 text-sm px-4 py-2 h-10 font-medium rounded-xl"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>
        )}
      </div>

      {/* Tab Content - constrained height */}
      <div className="flex-1 min-h-0 animate-fade-in">{activeTab === "chat" ? <AgentChat /> : <AgentConfig />}</div>
    </div>
  )
}
