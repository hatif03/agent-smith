"""Tool Builder Sub-Agent - Creates custom tools with Python code."""

from google.adk.agents.llm_agent import LlmAgent
from google.adk.tools.function_tool import FunctionTool

from google.adk.models.lite_llm import LiteLlm
import os 

from ..prompts import TOOL_BUILDER_PROMPT
from ..tools.config_merger import add_tool_to_config, update_tool_in_config

tool_builder = LlmAgent(
    name="tool_builder",
    model=LiteLlm(
        model='openai/gpt-5-2025-08-07',
        api_key=os.getenv("AIML_API_KEY"),
        api_base='https://api.aimlapi.com/v1'
    ),
    description="""
    Tool Creation Specialist that creates custom tools with Python function code.
    Writes clean, functional Python code with proper error handling and adds 
    tools to the project configuration.
    """,
    instruction=TOOL_BUILDER_PROMPT,
    tools=[
        FunctionTool(add_tool_to_config),
        FunctionTool(update_tool_in_config)
    ]
) 