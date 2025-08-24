#!/usr/bin/env python3
# Quick start script for banking_agent

from agent import root_agent

def main():
    print("Starting banking_agent...")
    print("Main agent: BankingAgent")
    print("Available agents: ['BankingAgent']")
    print("Available tools: ['account_api', 'view_transaction_history', 'transfer_funds', 'customer_support_db']")
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
