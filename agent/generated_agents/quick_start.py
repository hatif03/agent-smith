#!/usr/bin/env python3
# Quick start script for customer_support_agent

from agent import root_agent

def main():
    print("Starting customer_support_agent...")
    print("Main agent: support_agent")
    print("Available agents: ['support_agent']")
    print("Available tools: ['web_search', 'help_desk_api']")
    print()
    print("Generated in current directory for easy testing with ADK Web UI")
    print()
    print("To run the agent with ADK CLI:")
    print("adk cli agent.py")
    print()
    print("To use the agent programmatically:")
    print("response = root_agent.run('Your message here')")
    print("print(response)")

if __name__ == "__main__":
    main()
