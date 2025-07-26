from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import Optional
import logging
from google import genai

# Load environment variables
load_dotenv()


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="FastAPI Backend", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[list] = []

class ChatResponse(BaseModel):
    response: str
    status: str

class HealthResponse(BaseModel):
    status: str
    message: str
    gemini_configured: bool

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="FastAPI backend is running",
        gemini_configured=client is not None
    )

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Chat endpoint that communicates with Gemini GenAI API"""
    try:
        if not client:
            raise HTTPException(
                status_code=500, 
                detail="Gemini API not configured. Please set GEMINI_API_KEY environment variable."
            )
        
        # Create conversation context if history exists
        conversation_context = ""
        if request.conversation_history:
            for entry in request.conversation_history[-5:]:  # Keep last 5 messages for context
                if isinstance(entry, dict):
                    conversation_context += f"User: {entry.get('user', '')}\nAssistant: {entry.get('assistant', '')}\n"
        
        # Prepare the prompt with context
        full_prompt = f"{conversation_context}\nUser: {request.message}\nAssistant:"
        
        # Generate response using Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt
        )
        
        if response.text:
            return ChatResponse(
                response=response.text,
                status="success"
            )
        else:
            raise HTTPException(status_code=500, detail="No response generated from Gemini API")
            
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "FastAPI Backend with Gemini GenAI integration"}