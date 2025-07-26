import { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import ApiTester from "../components/ApiTester";
import ChatInterface from "../components/ChatInterface";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [apiResults, setApiResults] = useState({});
  const [activeTab, setActiveTab] = useState("chat");

  const handleApiResult = (endpoint, result) => {
    setApiResults((prev) => ({
      ...prev,
      [endpoint]: result,
    }));
  };

  return (
    <Layout>
      <Head>
        <title>Next.js + FastAPI + Gemini AI - Vercel</title>
        <meta
          name="description"
          content="Full-stack app with Next.js frontend and FastAPI backend with Gemini AI integration on Vercel"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Next.js + FastAPI with <br />
          <span className={styles.pythonText}>Gemini AI Integration</span>
        </h1>

        <p className={styles.description}>
          A full-stack application combining Next.js frontend with FastAPI
          backend, featuring Gemini AI integration for intelligent
          conversations.
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>🚀 Features</h2>
            <ul className={styles.featureList}>
              <li>⚡ Next.js Frontend</li>
              <li>🐍 FastAPI Backend</li>
              <li>🤖 Gemini AI Integration</li>
              <li>💬 Intelligent Chat Interface</li>
              <li>☁️ Vercel Deployment Ready</li>
              <li>🔧 Health Monitoring</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h2>📋 API Endpoints</h2>
            <div className={styles.endpointList}>
              <div className={styles.endpointGroup}>
                <h3>FastAPI Backend</h3>
                <code>GET /health</code>
                <span>Health check & AI status</span>
                <code>GET /</code>
                <span>Backend information</span>
                <code>POST /chat</code>
                <span>Chat with Gemini AI</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.interactionSection}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tab} ${
                activeTab === "chat" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("chat")}
            >
              💬 Chat Interface
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "api" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("api")}
            >
              🧪 API Testing
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === "chat" && (
              <div className={styles.chatSection}>
                <ChatInterface />
              </div>
            )}

            {activeTab === "api" && (
              <div className={styles.testerSection}>
                <h2>🧪 API Testing Interface</h2>
                <p>
                  Test the FastAPI endpoints directly from the browser. Try the
                  chat endpoint to interact with Gemini AI!
                </p>
                <ApiTester onResult={handleApiResult} />
              </div>
            )}
          </div>
        </div>

        {Object.keys(apiResults).length > 0 && activeTab === "api" && (
          <div className={styles.resultsSection}>
            <h2>📊 Latest Results</h2>
            <div className={styles.resultsGrid}>
              {Object.entries(apiResults).map(([endpoint, result]) => (
                <div key={endpoint} className={styles.resultCard}>
                  <h3>{endpoint}</h3>
                  <pre className={styles.resultData}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}
