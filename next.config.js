/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // API configuration
  async rewrites() {
    return [
      // FastAPI routes - proxy to local FastAPI server
      {
        source: "/api/chat",
        destination: "http://localhost:8000/chat",
      },
      {
        source: "/api/health",
        destination: "http://localhost:8000/health",
      },
      {
        source: "/api/",
        destination: "http://localhost:8000/",
      },
      // Legacy routes for backward compatibility
      {
        source: "/chat",
        destination: "http://localhost:8000/chat",
      },
      {
        source: "/health",
        destination: "http://localhost:8000/health",
      },
      // Other API routes (if any)
      {
        source: "/api/python-hello",
        destination: "/api/python-hello.py",
      },
      {
        source: "/api/data-processing",
        destination: "/api/data-processing.py",
      },
      {
        source: "/api/ml-prediction",
        destination: "/api/ml-prediction.py",
      },
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // External packages for server components
  serverExternalPackages: [],
};

module.exports = nextConfig;
