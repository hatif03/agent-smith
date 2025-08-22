"use client"

import type React from "react"

import { useCallback, useEffect } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  type NodeTypes,
  Handle,
  Position,
} from "reactflow"
import "reactflow/dist/style.css"
import type { AgentProjectConfig } from "@/types/agent-config"
import { AgentType } from "@/types/agent-config"
import { Bot, Wrench, Zap, GitBranch } from "lucide-react"

// Custom node components
const AgentNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const getAgentIcon = (type: AgentType) => {
    switch (type) {
      case AgentType.LLM_AGENT:
        return <Bot className="w-4 h-4" />
      case AgentType.SEQUENTIAL_AGENT:
        return <GitBranch className="w-4 h-4" />
      case AgentType.PARALLEL_AGENT:
        return <Zap className="w-4 h-4" />
      case AgentType.LOOP_AGENT:
        return <div className="w-4 h-4 border-2 border-current rounded-full" />
      default:
        return <Bot className="w-4 h-4" />
    }
  }

  return (
    <div
      className={`px-4 py-3 shadow-sm rounded-2xl bg-white border-2 transition-all ${
        selected ? "border-gray-900 shadow-md" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-3">
        <div className="text-gray-900">{getAgentIcon(data.agentType)}</div>
        <div>
          <div className="font-medium text-sm text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500 max-w-32 truncate font-light">{data.description}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

const ToolNode = ({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div
      className={`px-3 py-2 shadow-sm rounded-2xl bg-gray-50 border-2 transition-all ${
        selected ? "border-gray-900 shadow-md" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <Wrench className="w-3 h-3 text-gray-700" />
        <div>
          <div className="font-medium text-xs text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500 max-w-24 truncate font-light">{data.description}</div>
        </div>
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
}

interface AgentGraphProps {
  config: AgentProjectConfig
  onNodeClick: (nodeId: string, nodeType: "agent" | "tool") => void
}

export function AgentGraph({ config, onNodeClick }: AgentGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const generateGraph = useCallback(() => {
    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    // Create agent nodes
    const agentEntries = Object.entries(config.agents)
    agentEntries.forEach(([agentName, agent], index) => {
      const isMainAgent = agentName === config.main_agent
      newNodes.push({
        id: `agent-${agentName}`,
        type: "agent",
        position: {
          x: isMainAgent ? 400 : 200 + (index % 3) * 300,
          y: isMainAgent ? 50 : 200 + Math.floor(index / 3) * 150,
        },
        data: {
          label: agent.name,
          description: agent.description,
          agentType: agent.type,
        },
        className: isMainAgent ? "ring-2 ring-gray-900" : "",
      })
    })

    // Create tool nodes
    const toolEntries = Object.entries(config.tools)
    toolEntries.forEach(([toolName, tool], index) => {
      newNodes.push({
        id: `tool-${toolName}`,
        type: "tool",
        position: {
          x: 100 + (index % 4) * 200,
          y: 400 + Math.floor(index / 4) * 100,
        },
        data: {
          label: tool.name,
          description: tool.description,
          toolType: tool.type,
        },
      })
    })

    // Create edges for sub-agents
    agentEntries.forEach(([agentName, agent]) => {
      agent.sub_agents.forEach((subAgentName) => {
        newEdges.push({
          id: `${agentName}-${subAgentName}`,
          source: `agent-${agentName}`,
          target: `agent-${subAgentName}`,
          type: "smoothstep",
          label: "sub-agent",
          labelStyle: { fontSize: 10, fill: "#6b7280" },
          style: { stroke: "#374151", strokeWidth: 2 },
        })
      })

      // Create edges for tools
      agent.tools.forEach((toolName) => {
        newEdges.push({
          id: `${agentName}-${toolName}`,
          source: `agent-${agentName}`,
          target: `tool-${toolName}`,
          type: "smoothstep",
          label: "uses",
          labelStyle: { fontSize: 10, fill: "#6b7280" },
          style: { stroke: "#9ca3af", strokeWidth: 1, strokeDasharray: "5,5" },
        })
      })
    })

    setNodes(newNodes)
    setEdges(newEdges)
  }, [config, setNodes, setEdges])

  useEffect(() => {
    generateGraph()
  }, [generateGraph])

  const onNodeClickHandler = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const [nodeType, nodeName] = node.id.split("-", 2)
      onNodeClick(nodeName, nodeType as "agent" | "tool")
    },
    [onNodeClick],
  )

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickHandler}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls className="bg-white border border-gray-200 rounded-xl" />
        <MiniMap
          className="bg-white border border-gray-200 rounded-xl"
          nodeColor={(node) => (node.type === "agent" ? "#374151" : "#6b7280")}
        />
        <Background color="#f3f4f6" gap={20} />
      </ReactFlow>
    </div>
  )
}
