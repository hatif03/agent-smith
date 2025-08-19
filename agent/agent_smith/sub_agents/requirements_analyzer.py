"""Requirements Analyzer Sub-Agent - Analyzes user requirements for agent creation."""

from google.adk.agents.llm_agent import LlmAgent
from ..prompts import REQUIREMENTS_ANALYZER_PROMPT


requirements_analyzer = LlmAgent(
    name="requirements_analyzer",
    model="gemini-2.0-flash",
    description="""
    Requirements Analysis Specialist that extracts and structures user requirements 
    for agent creation. Analyzes user input to understand purpose, capabilities, 
    tools needed, and complexity level.
    """,
    instruction=REQUIREMENTS_ANALYZER_PROMPT
)