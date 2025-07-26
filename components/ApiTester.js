import { useState } from "react";
import styles from "../styles/ApiTester.module.css";

export default function ApiTester({ onResult }) {
  const [loading, setLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState("/api/health");
  const [requestBody, setRequestBody] = useState("");
  const [error, setError] = useState("");

  const endpoints = [
    {
      value: "/api/health",
      label: "GET /api/health",
      method: "GET",
      description:
        "Health check endpoint - verifies FastAPI backend status and Gemini API configuration",
    },
    {
      value: "/api/",
      label: "GET /api/ (Root)",
      method: "GET",
      description: "Root endpoint - basic backend information",
    },
    {
      value: "/api/chat",
      label: "POST /api/chat",
      method: "POST",
      description: "Chat with Gemini AI - send messages and get AI responses",
      sampleBody: JSON.stringify(
        {
          message: "Hello! Can you tell me about artificial intelligence?",
          conversation_history: [],
        },
        null,
        2
      ),
    },
  ];

  const selectedEndpointData = endpoints.find(
    (ep) => ep.value === selectedEndpoint
  );

  const handleTest = async () => {
    setLoading(true);
    setError("");

    try {
      const options = {
        method: selectedEndpointData.method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (selectedEndpointData.method === "POST" && requestBody) {
        try {
          JSON.parse(requestBody); // Validate JSON
          options.body = requestBody;
        } catch (e) {
          throw new Error("Invalid JSON in request body");
        }
      }

      const response = await fetch(selectedEndpoint, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${
            data.detail || data.error || "Request failed"
          }`
        );
      }

      onResult(selectedEndpoint, {
        status: response.status,
        data: data,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message);
      onResult(selectedEndpoint, {
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndpointChange = (value) => {
    setSelectedEndpoint(value);
    const endpoint = endpoints.find((ep) => ep.value === value);
    setRequestBody(endpoint?.sampleBody || "");
    setError("");
  };

  const loadSampleData = () => {
    if (selectedEndpointData?.sampleBody) {
      setRequestBody(selectedEndpointData.sampleBody);
    }
  };

  return (
    <div className={styles.tester}>
      <div className={styles.controls}>
        <div className={styles.endpointSelector}>
          <label htmlFor="endpoint-select">Select API Endpoint:</label>
          <select
            id="endpoint-select"
            value={selectedEndpoint}
            onChange={(e) => handleEndpointChange(e.target.value)}
            className={styles.select}
          >
            {endpoints.map((endpoint) => (
              <option key={endpoint.value} value={endpoint.value}>
                {endpoint.label}
              </option>
            ))}
          </select>
        </div>

        {selectedEndpointData && (
          <div className={styles.endpointInfo}>
            <p className={styles.description}>
              {selectedEndpointData.description}
            </p>
            <div className={styles.methodBadge}>
              <span
                className={`${styles.method} ${
                  styles[selectedEndpointData.method.toLowerCase()]
                }`}
              >
                {selectedEndpointData.method}
              </span>
              <code className={styles.endpoint}>{selectedEndpoint}</code>
            </div>
          </div>
        )}

        {selectedEndpointData?.method === "POST" && (
          <div className={styles.requestBody}>
            <div className={styles.bodyHeader}>
              <label htmlFor="request-body">Request Body (JSON):</label>
              {selectedEndpointData.sampleBody && (
                <button
                  type="button"
                  onClick={loadSampleData}
                  className={styles.sampleButton}
                >
                  Load Sample
                </button>
              )}
            </div>
            <textarea
              id="request-body"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder="Enter JSON request body..."
              className={styles.textarea}
              rows={8}
            />
          </div>
        )}

        <button
          onClick={handleTest}
          disabled={loading}
          className={styles.testButton}
        >
          {loading ? "Testing..." : "Test API"}
        </button>

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}
