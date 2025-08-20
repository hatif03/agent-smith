"""
Main entry point for the Agent Creator Meta-Agent.
Example usage and testing.
"""

import sys
import os
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from agent_smith import root_agent

def test_simple_agent_creation():
    """Test creating a simple research assistant agent."""
    
    user_request = """
    I want to create a research assistant agent that can help me research topics by:
    1. Searching the web for information
    2. Loading and analyzing web pages
    3. Providing comprehensive, well-sourced answers
    
    It should be friendly and always cite sources.
    """
    
    print("=" * 80)
    print("AGENT CREATOR META-AGENT TEST")
    print("=" * 80)
    print(f"User Request: {user_request}")
    print("-" * 80)
    
    try:
        # Run the meta-agent
        response = root_agent.run(user_request)
        print("Response:")
        print(response)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

def test_complex_agent_creation():
    """Test creating a more complex multi-agent system."""
    
    user_request = """
    Create a customer service chatbot system for an e-commerce platform with:
    
    1. Intent classification to understand what customers want
    2. Product specialist to answer product questions and search catalog
    3. Order specialist to track orders and handle order issues
    4. Return specialist to handle returns and exchanges
    5. Human escalation when needed
    
    It should have access to:
    - Product database
    - Order database  
    - Customer history
    - Knowledge base
    
    Make it professional but friendly, with fast response times.
    """
    
    print("\n" + "=" * 80)
    print("COMPLEX MULTI-AGENT SYSTEM TEST")
    print("=" * 80)
    print(f"User Request: {user_request}")
    print("-" * 80)
    
    try:
        # Run the meta-agent
        response = root_agent.run(user_request)
        print("Response:")
        print(response)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

def interactive_mode():
    """Interactive mode for testing the meta-agent."""
    
    print("\n" + "=" * 80)
    print("INTERACTIVE MODE - Agent Creator Meta-Agent")
    print("=" * 80)
    print("Describe the agent you want to create. Type 'quit' to exit.")
    
    while True:
        try:
            user_input = input("\nDescribe your agent: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                break
                
            if not user_input:
                continue
                
            print("\nProcessing...")
            print("-" * 40)
            
            response = root_agent.run(user_input)
            print("Response:")
            print(response)
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error: {str(e)}")

def main():
    """Main function with different test options."""
    
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()
        
        if mode == "simple":
            test_simple_agent_creation()
        elif mode == "complex":
            test_complex_agent_creation()
        elif mode == "interactive":
            interactive_mode()
        else:
            print("Usage: python main.py [simple|complex|interactive]")
    else:
        # Default: run simple test
        test_simple_agent_creation()

if __name__ == "__main__":
    main() 