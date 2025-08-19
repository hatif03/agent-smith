"""Architecture Planner Sub-Agent - Designs agent system structure."""

from google.adk.agents.llm_agent import LlmAgent
from ..prompts import ARCHITECTURE_PLANNER_PROMPT
from google.adk.models.lite_llm import LiteLlm
import os 

architecture_planner = LlmAgent(
    name="architecture_planner",
    model=LiteLlm(
        model='openai/gpt-5-2025-08-07',
        api_key=os.getenv("AIML_API_KEY"),
        api_base='https://api.aimlapi.com/v1'
    ),
    description="""
    Agent Architecture Specialist that designs the structure of agent systems.
    Creates simple, clear architecture plans defining agents, their roles, 
    and relationships without complex data flow design.
    """,
    instruction=ARCHITECTURE_PLANNER_PROMPT
) 