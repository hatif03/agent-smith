"""Prompt Builder Sub-Agent - Creates detailed agent instructions/prompts."""

from google.adk.agents.llm_agent import LlmAgent
from ..prompts import PROMPT_BUILDER_PROMPT
from google.adk.models.lite_llm import LiteLlm
import os 

import litellm

# Enable the use_litellm_proxy flag
litellm.use_litellm_proxy = True


prompt_builder = LlmAgent(
    name="prompt_builder",
    model=LiteLlm(
        model='openai/gpt-5-2025-08-07',
        api_key=os.getenv("AIML_API_KEY"),
        api_base='https://api.aimlapi.com/v1'
    ),
    # model="gemini-2.0-flash",
    description="""
    Prompt Engineering Specialist that creates detailed, effective instructions 
    for AI agents. Focuses on clear role definition, tool usage, response 
    guidelines, and error handling.
    """,
    instruction=PROMPT_BUILDER_PROMPT
) 