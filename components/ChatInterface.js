import { useState, useRef, useEffect } from "react";
import styles from "../styles/ChatInterface.module.css";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setError("");

    // Add user message to chat
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Prepare conversation history for API
      const conversationHistory = newMessages
        .slice(-10)
        .map((msg, index) => {
          if (index % 2 === 0) {
            return {
              user: msg.content,
              assistant: newMessages[index + 1]?.content || "",
            };
          }
          return null;
        })
        .filter(Boolean);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: conversationHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get response from AI");
      }

      // Add AI response to chat
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.response },
      ]);
    } catch (err) {
      setError(err.message);
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
  };

  return (
    <div className={styles.chatInterface}>
      <div className={styles.chatHeader}>
        <h3>💬 Chat with Gemini AI</h3>
        {messages.length > 0 && (
          <button onClick={clearChat} className={styles.clearButton}>
            Clear Chat
          </button>
        )}
      </div>

      <div className={styles.chatMessages}>
        {messages.length === 0 && (
          <div className={styles.welcomeMessage}>
            <p>👋 Welcome! Start a conversation with Gemini AI.</p>
            <p>
              Ask me anything - I can help with questions, explanations,
              creative writing, and more!
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              message.role === "user"
                ? styles.userMessage
                : styles.assistantMessage
            }`}
          >
            <div className={styles.messageHeader}>
              <span className={styles.messageRole}>
                {message.role === "user" ? "You" : "Gemini AI"}
              </span>
            </div>
            <div className={styles.messageContent}>{message.content}</div>
          </div>
        ))}

        {loading && (
          <div
            className={`${styles.message} ${styles.assistantMessage} ${styles.loadingMessage}`}
          >
            <div className={styles.messageHeader}>
              <span className={styles.messageRole}>Gemini AI</span>
            </div>
            <div className={styles.messageContent}>
              <div className={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className={styles.chatInput}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
          className={styles.textarea}
          disabled={loading}
          rows={2}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !inputMessage.trim()}
          className={styles.sendButton}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
