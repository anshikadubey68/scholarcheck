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

  const riskBadgeStyles: Record<string, { bg: string; color: string; border: string }> = {
    Low: { bg: "#E6F4EA", color: "#1F7A5A", border: "#A3D9B8" },
    Medium: { bg: "#FEF3C7", color: "#B45309", border: "#FCD34D" },
    High: { bg: "#FFEDD5", color: "#C2410C", border: "#FDBA74" },
    Critical: { bg: "#FEE2E2", color: "#B42318", border: "#FCA5A5" },
  };

  const badge = riskBadgeStyles[result.riskCategory] ?? riskBadgeStyles.Low;

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
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <CircularScore score={result.score} riskCategory={result.riskCategory} size={140} />

        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span
              style={{
                background: badge.bg,
                color: badge.color,
                border: `1px solid ${badge.border}`,
                padding: "4px 14px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "-0.01em",
              }}
            >
              {result.riskCategory} Risk Level
            </span>
            {result.trustedDomain && (
              <span
                style={{
                  background: "#E0F2FE",
                  color: "#0369A1",
                  border: "1px solid #BAE6FD",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
              >
                ✓ Verified Provider
              </span>
            )}
            {result.isAiPowered && (
              <span
                style={{
                  background: "#F3E8FF",
                  color: "#7E22CE",
                  border: "1px solid #E9D5FF",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
              >
                ✨ AI Analyzed
              </span>
            )}
          </div>

          <p style={{ fontSize: "0.95rem", color: "var(--ink)", lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
            {result.summary}
          </p>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--line)", paddingBottom: 10, marginBottom: 20, overflowX: "auto" }}>
        <button
          type="button"
          className="chip"
          aria-pressed={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          style={{ fontSize: "0.85rem", padding: "6px 14px" }}
        >
          All Findings ({result.signals.length + result.positiveIndicators.length})
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={activeTab === "warnings"}
          onClick={() => setActiveTab("warnings")}
          style={{ fontSize: "0.85rem", padding: "6px 14px" }}
        >
          ⚠️ Warning Signs ({result.signals.length})
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={activeTab === "trust"}
          onClick={() => setActiveTab("trust")}
          style={{ fontSize: "0.85rem", padding: "6px 14px" }}
        >
          🛡️ Trust Factors ({result.positiveIndicators.length})
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={activeTab === "actions"}
          onClick={() => setActiveTab("actions")}
          style={{ fontSize: "0.85rem", padding: "6px 14px" }}
        >
          📋 Recommended Steps
        </button>
      </div>

      {/* Tab 1: Warning Signs */}
      {(activeTab === "all" || activeTab === "warnings") && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚠️</span> Warning Signs Detected ({result.signals.length})
          </h3>
          {result.signals.length === 0 ? (
            <div style={{ padding: "14px 18px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, color: "#166534", fontSize: "0.9rem" }}>
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
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🛡️</span> Positive Trust Indicators ({result.positiveIndicators.length})
          </h3>
          {result.positiveIndicators.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No verified domain or accredited trust marks could be confirmed.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {result.positiveIndicators.map((ind, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 14px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 6,
                    fontSize: "0.875rem",
                    color: "var(--ink)",
                  }}
                >
                  <span style={{ color: "#1F7A5A", fontWeight: 800 }}>✓</span>
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
        <div style={{ marginBottom: 28, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "16px 20px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#92400E", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span>💡</span> Recommended Actions for Students
          </h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#78350F", fontSize: "0.875rem", lineHeight: 1.6 }}>
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

