"use client"

import { useState, useEffect } from "react"
import { Progress } from "./ui/progress"
import { MessageSquare, Settings, Bot, Download, Github } from "lucide-react"
import type { AppState } from "../types"
import { AgentChat } from "./agent-chat"
import { AgentConfig } from "./agent-config"
import { Button } from "./ui/button"

// Utility functions copied from lib files
// Simulate API delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock agent building simulation for the app preview
const simulateAgentBuilding = async (onProgress: (progress: number) => void): Promise<void> => {
  const steps = [
    { progress: 10, message: "Initializing agent framework..." },
    { progress: 25, message: "Loading language model..." },
    { progress: 40, message: "Configuring tools and capabilities..." },
    { progress: 60, message: "Training on domain knowledge..." },
    { progress: 80, message: "Setting up communication channels..." },
    { progress: 95, message: "Finalizing configuration..." },
    { progress: 100, message: "Agent ready!" }
  ]
  
  for (const step of steps) {
    await delay(800 + Math.random() * 1200) // Random delay between 0.8-2 seconds
    onProgress(step.progress)
  }
}

// Mock agent project configuration
const mockAgentProjectConfig: any = {
  project_name: "Customer Support AI Agent",
  description: "An intelligent AI agent designed to handle customer support inquiries and provide helpful solutions",
  version: "1.0.0",
  main_agent: "customer_support_main",
  agents: {
    customer_support_main: {
      name: "Customer Support Main Agent",
      type: "llm_agent",
      description: "Main agent that coordinates customer support operations",
      model: "gpt-4",
      instruction: "You are a helpful customer support agent. Always be polite, patient, and solution-oriented.",
      tools: ["knowledge_base", "ticket_system", "customer_database"],
      sub_agents: ["technical_specialist", "billing_specialist"],
      config: {
        temperature: 0.7,
        max_tokens: 2000
      }
    },
    technical_specialist: {
      name: "Technical Specialist Agent",
      type: "llm_agent",
      description: "Specialized agent for technical troubleshooting and support",
      model: "gpt-4",
      instruction: "You are a technical expert. Help customers with technical issues.",
      tools: ["system_diagnostics", "troubleshooting_guide", "remote_support"],
      sub_agents: [],
      config: {
        temperature: 0.3,
        max_tokens: 1500
      }
    },
    billing_specialist: {
      name: "Billing Specialist Agent",
      type: "llm_agent",
      description: "Specialized agent for billing inquiries and payment issues",
      model: "gpt-4",
      instruction: "You are a billing expert. Help customers understand their bills.",
      tools: ["billing_system", "payment_processor", "invoice_generator"],
      sub_agents: [],
      config: {
        temperature: 0.5,
        max_tokens: 1200
      }
    }
  },
  tools: {
    knowledge_base: {
      name: "Knowledge Base",
      type: "builtin",
      description: "Access to company knowledge base and FAQ",
      builtin_type: "load_memory"
    },
    ticket_system: {
      name: "Ticket System",
      type: "builtin",
      description: "Create and manage support tickets",
      builtin_type: "load_artifacts"
    },
    customer_database: {
      name: "Customer Database",
      type: "builtin",
      description: "Access customer information and history",
      builtin_type: "load_memory"
    },
    system_diagnostics: {
      name: "System Diagnostics",
      type: "custom_function",
      description: "Run system diagnostics and health checks",
      function_code: "def run_diagnostics(): pass",
      imports: ["datetime"],
      dependencies: []
    },
    troubleshooting_guide: {
      name: "Troubleshooting Guide",
      type: "custom_function",
      description: "Search troubleshooting guides and solutions",
      function_code: "def search_troubleshooting(): pass",
      imports: [],
      dependencies: []
    },
    remote_support: {
      name: "Remote Support",
      type: "custom_function",
      description: "Initiate remote support sessions",
      function_code: "def initiate_remote_support(): pass",
      imports: [],
      dependencies: []
    },
    billing_system: {
      name: "Billing System",
      type: "custom_function",
      description: "Access billing information and history",
      function_code: "def get_billing_info(): pass",
      imports: ["datetime"],
      dependencies: []
    },
    payment_processor: {
      name: "Payment Processor",
      type: "custom_function",
      description: "Process payments and refunds",
      function_code: "def process_payment(): pass",
      imports: [],
      dependencies: []
    },
    invoice_generator: {
      name: "Invoice Generator",
      type: "custom_function",
      description: "Generate invoices and receipts",
      function_code: "def generate_invoice(): pass",
      imports: ["datetime"],
      dependencies: []
    }
  },
  requirements: [
    "openai>=1.0.0",
    "fastapi>=0.104.0",
    "uvicorn>=0.24.0",
    "pydantic>=2.5.0",
    "python-dotenv>=1.0.0",
    "httpx>=0.25.0",
    "aiofiles>=23.2.0"
  ],
  environment_variables: {
    "OPENAI_API_KEY": "sk-...",
    "DATABASE_URL": "postgresql://user:pass@localhost/db",
    "SUPPORT_EMAIL": "support@example.com",
    "COMPANY_NAME": "Example Corp"
  },
  environment_variables_example: {
    "OPENAI_API_KEY": "sk-your-openai-api-key-here",
    "DATABASE_URL": "postgresql://username:password@localhost/database_name",
    "SUPPORT_EMAIL": "support@yourcompany.com",
    "COMPANY_NAME": "Your Company Name"
  }
}

// Mock agent API functions
const fetchAgentConfig = async () => {
  await delay(300) // Simulate network delay
  return mockAgentProjectConfig
}

// Mock code generator functionality
const codeGenerator = {
  generateAndDownload: async (config: any) => {
    // Simulate code generation and download process
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
    
    // Create a mock download
    const projectData = {
      name: config.project_name,
      description: config.description,
      version: config.version,
      agents: Object.keys(config.agents).length,
      tools: Object.keys(config.tools).length,
      requirements: config.requirements?.length || 0,
      generated_at: new Date().toISOString()
    };
    
    // Create a blob and download it
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.project_name.toLowerCase().replace(/\s+/g, '_')}_config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`Project configuration downloaded: ${config.project_name}`);
  }
}

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
      // Download the customer-support-agent.rar file
      const response = await fetch('/customer-support-agent.rar')
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'customer-support-agent.rar'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('Customer support agent downloaded successfully')
    } catch (error) {
      console.error("Failed to download agent:", error)
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
              {downloading ? "Downloading..." : "Download Agent"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open('https://github.com/hatif03/agent-smith', '_blank')}
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
