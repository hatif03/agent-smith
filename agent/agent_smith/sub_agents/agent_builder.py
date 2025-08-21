"""Agent Builder Sub-Agent - Builds individual agent configurations."""

from google.adk.agents.llm_agent import LlmAgent
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.function_tool import FunctionTool

from google.adk.models.lite_llm import LiteLlm
import os 

from dotenv import load_dotenv
load_dotenv()

from ..prompts import AGENT_BUILDER_PROMPT
from .prompt_builder import prompt_builder
from ..tools.config_merger import add_agent_to_config, update_agent_in_config

import litellm

# Enable the use_litellm_proxy flag
litellm.use_litellm_proxy = True

agent_builder = LlmAgent(
    name="agent_builder",
    model=LiteLlm(
        model='openai/gpt-5-2025-08-07'
    ),
    description="""
    Agent Configuration Specialist that builds detailed configurations for 
    individual agents. Creates basic agent config, calls prompt builder for 
    instructions, then merges everything using config_merger tools.
    """,
    instruction=AGENT_BUILDER_PROMPT,
    tools=[
        AgentTool(agent=prompt_builder),
        FunctionTool(add_agent_to_config),
        FunctionTool(update_agent_in_config)
    ]
) 