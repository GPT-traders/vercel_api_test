#!/usr/bin/env python3
"""
Test script for FastAPI endpoints
"""
try:
    import requests
except ImportError:
    print("❌ Error: requests library not found. Install with: pip install requests")
    exit(1)

import json

BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test the health endpoint"""
    print("🔍 Testing /health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server. Make sure it's running at http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_chat_endpoint():
    """Test the chat endpoint"""
    print("\n🔍 Testing /chat endpoint...")
    try:
        # Test data
        chat_data = {
            "message": "Hello! Can you tell me a joke?",
            "conversation_history": []
        }
        
        response = requests.post(
            f"{BASE_URL}/chat",
            json=chat_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server. Make sure it's running at http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_root_endpoint():
    """Test the root endpoint"""
    print("\n🔍 Testing / (root) endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server. Make sure it's running at http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing FastAPI endpoints...")
    print("📋 Make sure the server is running with: cd api && python run_dev.py")
    print("="*50)
    
    # Test all endpoints
    health_ok = test_health_endpoint()
    root_ok = test_root_endpoint()
    chat_ok = test_chat_endpoint()
    
    print("\n" + "="*50)
    print("📊 Test Results:")
    print(f"Health endpoint: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Root endpoint: {'✅ PASS' if root_ok else '❌ FAIL'}")
    print(f"Chat endpoint: {'✅ PASS' if chat_ok else '❌ FAIL'}")
    
    if not chat_ok:
        print("\n⚠️  Chat endpoint failed - make sure GEMINI_API_KEY is set in .env file")
    
    if not any([health_ok, root_ok]):
        print("\n💡 To start the server:")
        print("   cd api")
        print("   python run_dev.py") 