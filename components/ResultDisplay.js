import { useState } from "react";
import styles from "../styles/ResultDisplay.module.css";

export default function ResultDisplay({ result, endpoint }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!result) return null;

  const hasError = result.error;
  const statusClass = hasError ? "error" : "success";

  const formatJson = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatJson(result));
  };

  return (
    <div className={`${styles.result} ${styles[statusClass]}`}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.endpoint}>{endpoint}</h3>
          <span className={styles.timestamp}>
            {new Date(result.timestamp).toLocaleString()}
          </span>
        </div>

        <div className={styles.actions}>
          <button
            onClick={copyToClipboard}
            className={styles.copyButton}
            title="Copy to clipboard"
          >
            📋
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={styles.collapseButton}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "▶️" : "🔽"}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className={styles.content}>
          {result.status && (
            <div className={styles.status}>
              <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
                {result.status}
              </span>
            </div>
          )}

          <pre className={styles.json}>
            {formatJson(hasError ? { error: result.error } : result.data)}
          </pre>

          {!hasError && result.data && (
            <div className={styles.summary}>
              <h4>Response Summary:</h4>
              <ul className={styles.summaryList}>
                {result.data.message && (
                  <li>
                    <strong>Message:</strong> {result.data.message}
                  </li>
                )}
                {result.data.success !== undefined && (
                  <li>
                    <strong>Success:</strong>{" "}
                    {result.data.success ? "✅" : "❌"}
                  </li>
                )}
                {result.data.metadata?.processed_by && (
                  <li>
                    <strong>Processed by:</strong>{" "}
                    {result.data.metadata.processed_by}
                  </li>
                )}
                {result.data.result?.statistics && (
                  <li>
                    <strong>Data points:</strong>{" "}
                    {result.data.result.statistics.count}
                  </li>
                )}
                {result.data.result?.model_type && (
                  <li>
                    <strong>Model:</strong> {result.data.result.model_type}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
