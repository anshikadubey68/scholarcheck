"use client";

import { useState } from "react";
import type { AnalysisResult } from "../lib/detector/types";
import CircularScore from "./CircularScore";
import SignalCard from "./SignalCard";

interface ReportViewProps {
  result: AnalysisResult;
  onReset?: () => void;
}

export default function ReportView({ result, onReset }: ReportViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "warnings" | "trust" | "actions">("all");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="verification-report" id="scholarship-report">
      {/* Report Header Metadata */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: 14, marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", fontWeight: 700 }}>
            Official Verification Report
          </span>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
            Ref: {result.referenceId}
          </div>
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--muted)", textAlign: "right" }}>
          {new Date(result.timestamp).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Main Verdict Card with Circular Meter */}
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <CircularScore score={result.score} riskCategory={result.riskCategory} size={140} />

        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span className={`risk-badge ${result.riskCategory}`}>
              {result.riskCategory} Risk Level
            </span>
            {result.trustedDomain && (
              <span className="verified-badge">
                ✓ Verified Provider
              </span>
            )}
            {result.isAiPowered ? (
              <span className="ai-badge" style={{ background: "linear-gradient(135deg, #8B5CF6, #6366F1)", color: "#fff", fontWeight: 700, padding: "3px 10px", borderRadius: 999, fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span>✨</span> Gemini AI Analyzed
              </span>
            ) : (
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", border: "1px solid var(--line)", padding: "2px 8px", borderRadius: 999 }}>
                Heuristic Engine
              </span>
            )}
          </div>

          <p style={{ fontSize: "0.95rem", color: "var(--ink)", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
            {result.summary}
          </p>
        </div>
      </div>

      {/* Gemini AI Intelligence Section (Shown when AI analysis completed) */}
      {result.isAiPowered && result.aiAnalysis && (
        <div
          style={{
            background: "linear-gradient(to right bottom, rgba(139, 92, 246, 0.05), rgba(99, 102, 241, 0.08))",
            border: "1px solid rgba(139, 92, 246, 0.25)",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1.2rem" }}>🤖</span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
                Gemini AI Semantic Fraud Intelligence
              </h3>
            </div>
            <span style={{ fontSize: "0.75rem", background: "rgba(139, 92, 246, 0.15)", color: "#8B5CF6", padding: "3px 10px", borderRadius: 999, fontWeight: 700 }}>
              Live AI Assessment
            </span>
          </div>

          <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--ink)", marginBottom: 14 }}>
            {result.aiAnalysis.reasoning}
          </p>

          {result.aiAnalysis.keyRedFlags && result.aiAnalysis.keyRedFlags.length > 0 && (
            <div style={{ marginTop: 12, marginBottom: 12 }}>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, color: "#DC2626", letterSpacing: "0.05em" }}>
                AI Flagged Anomalies:
              </span>
              <div style={{ display: "grid", gap: 6, marginTop: 6 }}>
                {result.aiAnalysis.keyRedFlags.map((flag, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "var(--ink)" }}>
                    <span style={{ color: "#DC2626", fontWeight: 700 }}>✕</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.aiAnalysis.suggestedAction && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed rgba(139, 92, 246, 0.3)", fontSize: "0.88rem", color: "var(--ink)" }}>
              <strong>AI Action Recommendation:</strong> {result.aiAnalysis.suggestedAction}
            </div>
          )}
        </div>
      )}

      {/* Navigation Filter Tabs */}
      <div className="report-tabs-grid">
        <button
          type="button"
          className="report-tab-btn"
          aria-pressed={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        >
          All Findings ({result.signals.length + result.positiveIndicators.length})
        </button>
        <button
          type="button"
          className="report-tab-btn"
          aria-pressed={activeTab === "warnings"}
          onClick={() => setActiveTab("warnings")}
        >
          ⚠️ Warning Signs ({result.signals.length})
        </button>
        <button
          type="button"
          className="report-tab-btn"
          aria-pressed={activeTab === "trust"}
          onClick={() => setActiveTab("trust")}
        >
          🛡️ Trust Factors ({result.positiveIndicators.length})
        </button>
        <button
          type="button"
          className="report-tab-btn"
          aria-pressed={activeTab === "actions"}
          onClick={() => setActiveTab("actions")}
        >
          📋 Recommended Steps
        </button>
      </div>

      {/* Tab 1: Warning Signs */}
      {(activeTab === "all" || activeTab === "warnings") && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, color: "var(--ink)" }}>
            <span>⚠️</span> Warning Signs Detected ({result.signals.length})
          </h3>
          {result.signals.length === 0 ? (
            <div className="zero-warning-banner">
              ✓ No malicious keywords, fee demands, or deceptive patterns detected in the analyzed offer.
            </div>
          ) : (
            <ul className="signals" style={{ margin: 0 }}>
              {result.signals.map((sig) => (
                <SignalCard key={sig.id} signal={sig} />
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Tab 2: Positive Trust Indicators */}
      {(activeTab === "all" || activeTab === "trust") && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, color: "var(--ink)" }}>
            <span>🛡️</span> Positive Trust Indicators ({result.positiveIndicators.length})
          </h3>
          {result.positiveIndicators.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No verified domain or accredited trust marks could be confirmed.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {result.positiveIndicators.map((ind, i) => (
                <div key={i} className="trust-item">
                  <span className="check-icon">✓</span>
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Information That Could Not Be Verified */}
      {(activeTab === "all" || activeTab === "trust") && result.unverifiedFactors.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--muted)", marginBottom: 10 }}>
            ℹ️ Elements That Could Not Be Independently Verified
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>
            {result.unverifiedFactors.map((factor, i) => (
              <li key={i}>{factor}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab 3: Recommended Actions */}
      {(activeTab === "all" || activeTab === "actions") && (
        <div className="recommended-actions-box">
          <h3>
            <span>💡</span> Recommended Actions for Students
          </h3>
          <ul>
            {result.recommendedActions.map((rec, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: 18 }}>
        <button
          type="button"
          onClick={handlePrint}
          className="btn"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}
        >
          <span>📥</span> Download Report as PDF
        </button>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="btn ghost"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}
          >
            <span>🔄</span> Check Another Scholarship
          </button>
        )}
      </div>
    </div>
  );
}
