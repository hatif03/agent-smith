"use client"

import { useState, useEffect } from "react"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Download, Settings, Network, Save, X, Key, Info } from "lucide-react"
import { AgentGraph } from "./agent-graph"
import { CodeEditor } from "./code-editor"
import { TipTapEditor } from "./tiptap-editor"
import type { AgentProjectConfig, AgentConfig, ToolConfig } from "../types/agent-config"
// Utility functions copied from lib files
// Simulate API delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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
      instruction: "You are a helpful customer support agent. Always be polite, patient, and solution-oriented. When you don't know something, transfer to the appropriate specialist agent.",
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
      instruction: "You are a technical expert. Help customers with technical issues, provide step-by-step solutions, and escalate complex problems when necessary.",
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
      instruction: "You are a billing expert. Help customers understand their bills, resolve payment issues, and explain pricing clearly.",
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
      function_code: `def run_diagnostics(system_id: str) -> dict:
    """Run system diagnostics for the given system ID"""
    return {
        "system_id": system_id,
        "status": "healthy",
        "checks": ["cpu", "memory", "disk", "network"],
        "timestamp": "2024-01-01T00:00:00Z"
    }`,
      imports: ["datetime"],
      dependencies: []
    },
    troubleshooting_guide: {
      name: "Troubleshooting Guide",
      type: "custom_function",
      description: "Search troubleshooting guides and solutions",
      function_code: `def search_troubleshooting(query: str) -> list:
    """Search troubleshooting guides for solutions"""
    return [
        {
            "title": "Common Solutions",
            "steps": ["Step 1", "Step 2", "Step 3"],
            "relevance": 0.9
        }
    ]`,
      imports: [],
      dependencies: []
    },
    remote_support: {
      name: "Remote Support",
      type: "custom_function",
      description: "Initiate remote support sessions",
      function_code: `def initiate_remote_support(session_id: str) -> dict:
    """Initiate a remote support session"""
    return {
        "session_id": session_id,
        "status": "connected",
        "url": "https://support.example.com/session/123"
    }`,
      imports: [],
      dependencies: []
    },
    billing_system: {
      name: "Billing System",
      type: "custom_function",
      description: "Access billing information and history",
      function_code: `def get_billing_info(customer_id: str) -> dict:
    """Get billing information for a customer"""
    return {
        "customer_id": customer_id,
        "current_balance": 0.00,
        "last_payment": "2024-01-01",
        "next_billing": "2024-02-01"
    }`,
      imports: ["datetime"],
      dependencies: []
    },
    payment_processor: {
      name: "Payment Processor",
      type: "custom_function",
      description: "Process payments and refunds",
      function_code: `def process_payment(amount: float, method: str) -> dict:
    """Process a payment"""
    return {
        "transaction_id": "txn_123456",
        "amount": amount,
        "method": method,
        "status": "completed"
    }`,
      imports: [],
      dependencies: []
    },
    invoice_generator: {
      name: "Invoice Generator",
      type: "custom_function",
      description: "Generate invoices and receipts",
      function_code: `def generate_invoice(customer_id: str, items: list) -> dict:
    """Generate an invoice for a customer"""
    return {
        "invoice_id": "inv_123456",
        "customer_id": customer_id,
        "items": items,
        "total": sum(item["price"] for item in items),
        "date": "2024-01-01"
    }`,
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

const updateAgent = async (agentId: string, updates: any) => {
  await delay(400)
  const agent = mockAgentProjectConfig.agents[agentId]
  if (!agent) return null
  
  const updatedAgent = { ...agent, ...updates }
  mockAgentProjectConfig.agents[agentId] = updatedAgent
  return updatedAgent
}

const updateTool = async (toolId: string, updates: any) => {
  await delay(400)
  const tool = mockAgentProjectConfig.tools[toolId]
  if (!tool) return null
  
  const updatedTool = { ...tool, ...updates }
  mockAgentProjectConfig.tools[toolId] = updatedTool
  return updatedTool
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

interface EditingState {
  type: "agent" | "tool" | null
  id: string | null
  data: AgentConfig | ToolConfig | null
}

export function AgentConfig() {
  const [config, setConfig] = useState<AgentProjectConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingState, setEditingState] = useState<EditingState>({
    type: null,
    id: null,
    data: null,
  })
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await fetchAgentConfig()
        setConfig(data)
      } catch (error) {
        console.error("Failed to load config:", error)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  const handleNodeClick = (nodeId: string, nodeType: "agent" | "tool") => {
    if (!config) return

    // Clear previous editing state first
    setEditingState({ type: null, id: null, data: null })

    // Set new editing state
    setTimeout(() => {
      if (nodeType === "agent" && config.agents[nodeId]) {
        setEditingState({
          type: "agent",
          id: nodeId,
          data: { ...config.agents[nodeId] },
        })
      } else if (nodeType === "tool" && config.tools[nodeId]) {
        setEditingState({
          type: "tool",
          id: nodeId,
          data: { ...config.tools[nodeId] },
        })
      }
    }, 50)
  }

  const handleSave = async () => {
    if (!editingState.data || !editingState.id || !config) return

    setSaving(true)
    try {
      if (editingState.type === "agent") {
        const agentData = editingState.data as AgentConfig
        await updateAgent(editingState.id, agentData)
        setConfig({
          ...config,
          agents: {
            ...config.agents,
            [editingState.id]: agentData,
          },
        })
      } else if (editingState.type === "tool") {
        const toolData = editingState.data as ToolConfig
        await updateTool(editingState.id, toolData)
        setConfig({
          ...config,
          tools: {
            ...config.tools,
            [editingState.id]: toolData,
          },
        })
      }

      // Clear editing state after successful save
      setEditingState({ type: null, id: null, data: null })
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingState({ type: null, id: null, data: null })
  }

  const updateEditingData = (updates: Partial<AgentConfig | ToolConfig>) => {
    if (!editingState.data) return

    // Type-safe update based on the current editing type
    if (editingState.type === "agent" && editingState.data) {
      setEditingState({
        ...editingState,
        data: { ...editingState.data as AgentConfig, ...updates as Partial<AgentConfig> },
      })
    } else if (editingState.type === "tool" && editingState.data) {
      setEditingState({
        ...editingState,
        data: { ...editingState.data as ToolConfig, ...updates as Partial<ToolConfig> },
      })
    }
  }

  const handleDownloadCode = async () => {
    if (!config) return

    setDownloading(true)
    try {
      await codeGenerator.generateAndDownload(config)
    } catch (error) {
      console.error("Failed to generate code:", error)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-light">Loading agent configuration...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-600 font-light">Failed to load configuration</p>
      </div>
    )
  }

  const editingAgent = editingState.type === "agent" ? (editingState.data as AgentConfig) : null
  const editingTool = editingState.type === "tool" ? (editingState.data as ToolConfig) : null

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="graph" className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-medium text-gray-900">{config.project_name}</h2>
                <p className="text-gray-600 text-base font-light">{config.description}</p>
              </div>
              <div className="flex gap-3">
                <Button size="sm" onClick={handleDownloadCode} disabled={downloading} className="bg-gray-900 hover:bg-gray-800 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  {downloading ? "Generating..." : "Download Code"}
                </Button>
              </div>
            </div>

            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
              <TabsTrigger value="graph" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200">
                <Network className="w-4 h-4" />
                Graph View
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200">
                <Settings className="w-4 h-4" />
                Project Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="graph" className="h-full m-0 p-0">
              <div className="h-full flex">
                <div className="flex-1">
                  <AgentGraph config={config} onNodeClick={handleNodeClick} />
                </div>

                {/* Side panel for editing */}
                {editingState.data && (
                  <div className="w-96 border-l border-gray-100 bg-white flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {editingAgent ? `Edit Agent: ${editingAgent.name}` : `Edit Tool: ${editingTool?.name}`}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={handleCancel} className="rounded-xl">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {editingAgent && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                            <Input
                              value={editingAgent.name}
                              onChange={(e) => updateEditingData({ name: e.target.value })}
                              className="text-sm border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                            <Textarea
                              value={editingAgent.description}
                              onChange={(e) => updateEditingData({ description: e.target.value })}
                              className="text-sm border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-xl"
                              rows={2}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                            <Badge variant="outline" className="text-xs border-gray-200 text-gray-700">
                              {editingAgent.type}
                            </Badge>
                          </div>

                          {editingAgent.model && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Model</label>
                              <Input
                                value={editingAgent.model}
                                onChange={(e) => updateEditingData({ model: e.target.value })}
                                className="text-sm border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-xl"
                              />
                            </div>
                          )}

                          {editingAgent.instruction && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Instructions</label>
                              <TipTapEditor
                                content={editingAgent.instruction}
                                onChange={(content) => updateEditingData({ instruction: content })}
                                placeholder="Enter agent instructions..."
                                label={`${editingAgent.name} Instructions`}
                              />
                            </div>
                          )}

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Tools</label>
                            <div className="flex flex-wrap gap-2">
                              {editingAgent.tools.map((tool) => (
                                <Badge key={tool} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Sub Agents</label>
                            <div className="flex flex-wrap gap-2">
                              {editingAgent.sub_agents.map((subAgent) => (
                                <Badge key={subAgent} variant="outline" className="text-xs border-gray-200 text-gray-700">
                                  {subAgent}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {editingTool && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                            <Input
                              value={editingTool.name}
                              onChange={(e) => updateEditingData({ name: e.target.value })}
                              className="text-sm border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                            <Textarea
                              value={editingTool.description}
                              onChange={(e) => updateEditingData({ description: e.target.value })}
                              className="text-sm border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 rounded-xl"
                              rows={2}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                            <Badge variant="outline" className="text-xs border-gray-200 text-gray-700">
                              {editingTool.type}
                            </Badge>
                          </div>

                          {editingTool.imports && editingTool.imports.length > 0 && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Imports</label>
                              <div className="space-y-2">
                                {editingTool.imports.map((imp, index) => (
                                  <code key={index} className="block text-xs bg-gray-100 p-2 rounded-lg text-gray-700">
                                    {imp}
                                  </code>
                                ))}
                              </div>
                            </div>
                          )}

                          {editingTool.dependencies && editingTool.dependencies.length > 0 && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Dependencies</label>
                              <div className="flex flex-wrap gap-2">
                                {editingTool.dependencies.map((dep) => (
                                  <Badge key={dep} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {editingTool.function_code && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Function Code</label>
                              <CodeEditor
                                value={editingTool.function_code}
                                onChange={(value) => updateEditingData({ function_code: value })}
                                language="python"
                                placeholder="Enter Python function code..."
                                label={`${editingTool.name} Function`}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="p-6 border-t border-gray-100">
                      <div className="flex gap-3">
                        <Button onClick={handleSave} className="flex-1 bg-gray-900 hover:bg-gray-800 rounded-xl" disabled={saving}>
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="h-full m-0 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Project Info */}
                <Card className="border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <Info className="w-5 h-5 text-gray-600" />
                      Project Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Project Name</label>
                        <Input value={config.project_name} className="text-sm border-gray-200 bg-gray-50 rounded-xl" readOnly />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Version</label>
                        <Input value={config.version} className="text-sm border-gray-200 bg-gray-50 rounded-xl" readOnly />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                      <Textarea value={config.description} className="text-sm border-gray-200 bg-gray-50 rounded-xl" rows={2} readOnly />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Main Agent</label>
                      <Input value={config.main_agent} className="text-sm border-gray-200 bg-gray-50 rounded-xl" readOnly />
                    </div>
                  </CardContent>
                </Card>

                {/* Environment Variables */}
                <Card className="border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <Key className="w-5 h-5 text-gray-600" />
                      Environment Variables
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(config.environment_variables).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">{key}</label>
                            <Input
                              value={value}
                              className="text-sm font-mono border-gray-200 bg-gray-50 rounded-xl"
                              type={
                                key.toLowerCase().includes("key") || key.toLowerCase().includes("secret")
                                  ? "password"
                                  : "text"
                              }
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 mb-2 block">Example Value</label>
                            <Input
                              value={config.environment_variables_example[key] || ""}
                              className="text-sm font-mono text-gray-500 border-gray-200 bg-gray-50 rounded-xl"
                              readOnly
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card className="border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <Settings className="w-5 h-5 text-gray-600" />
                      Python Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {config.requirements.map((req) => (
                        <Badge key={req} variant="outline" className="text-sm font-mono border-gray-200 text-gray-700">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card className="border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Project Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-gray-50 rounded-2xl">
                        <div className="text-3xl font-medium text-gray-900">{Object.keys(config.agents).length}</div>
                        <div className="text-sm text-gray-600 font-light">Total Agents</div>
                      </div>
                      <div className="text-center p-6 bg-gray-50 rounded-2xl">
                        <div className="text-3xl font-medium text-gray-900">{Object.keys(config.tools).length}</div>
                        <div className="text-sm text-gray-600 font-light">Total Tools</div>
                      </div>
                      <div className="text-center p-6 bg-gray-50 rounded-2xl">
                        <div className="text-3xl font-medium text-gray-900">{config.requirements.length}</div>
                        <div className="text-sm text-gray-600 font-light">Dependencies</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
