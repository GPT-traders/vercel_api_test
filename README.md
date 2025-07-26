# FastAPI Backend with Gemini GenAI Integration

A simple FastAPI backend with health check and chat endpoints powered by Google's Gemini GenAI API.

## Features

- **Health Check Endpoint** (`/health`) - Check backend status and Gemini API configuration
- **Chat Endpoint** (`/chat`) - Conversational AI powered by Gemini GenAI API
- **Auto-generated API Documentation** - Available at `/docs` when running locally
- **CORS Support** - Ready for frontend integration
- **Environment Configuration** - Secure API key management

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy the example environment file and add your Gemini API key:

```bash
cp env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run Development Server

```bash
python run_dev.py
```

The server will start at `http://localhost:8000`

## API Endpoints

### Health Check

- **URL**: `GET /health`
- **Description**: Check if the backend is running and Gemini API is configured
- **Response**:

```json
{
  "status": "healthy",
  "message": "FastAPI backend is running",
  "gemini_configured": true
}
```

### Chat

- **URL**: `POST /chat`
- **Description**: Send a message to the Gemini AI and get a response
- **Request Body**:

```json
{
  "message": "Hello, how are you?",
  "conversation_history": []
}
```

- **Response**:

```json
{
  "response": "Hello! I'm doing well, thank you for asking. How can I help you today?",
  "status": "success"
}
```

### Root

- **URL**: `GET /`
- **Description**: Basic endpoint to confirm the API is running
- **Response**:

```json
{
  "message": "FastAPI Backend with Gemini GenAI integration"
}
```

## Testing

Run the test script to verify all endpoints:

```bash
python test_endpoints.py
```

## API Documentation

When running locally, visit `http://localhost:8000/docs` for interactive API documentation.

## Deployment

This project is configured for Vercel deployment with the `vercel.json` configuration file.

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key or use an existing one
5. Copy the API key to your `.env` file

## Project Structure

```
├── main.py              # FastAPI application
├── run_dev.py           # Development server runner
├── test_endpoints.py    # Test script for endpoints
├── requirements.txt     # Python dependencies
├── vercel.json         # Vercel deployment configuration
├── env.example         # Environment variables example
└── README.md           # This file
```
