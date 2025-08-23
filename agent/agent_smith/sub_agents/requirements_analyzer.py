"""Requirements Analyzer Sub-Agent - Analyzes user requirements for agent creation."""

from google.adk.agents.llm_agent import LlmAgent
from ..prompts import REQUIREMENTS_ANALYZER_PROMPT
from google.adk.models.lite_llm import LiteLlm
import os 

from dotenv import load_dotenv
load_dotenv()

# import litellm

# # Enable the use_litellm_proxy flag
# litellm.use_litellm_proxy = True

requirements_analyzer = LlmAgent(
    name="requirements_analyzer",
    # model=LiteLlm(
    #     model='openai/gpt-5-nano-2025-08-07',
    #     api_key=os.getenv("AIML_API_KEY"),
    #     api_base='https://api.aimlapi.com/v1'
    # ),
    model="gemini-2.0-flash",
    description="""
    Requirements Analysis Specialist that extracts and structures user requirements 
    for agent creation. Analyzes user input to understand purpose, capabilities, 
    tools needed, and complexity level.
    """,
    instruction=REQUIREMENTS_ANALYZER_PROMPT
)