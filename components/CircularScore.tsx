"use client";

import type { RiskCategory } from "../lib/detector/types";

interface CircularScoreProps {
  score: number;
  riskCategory: RiskCategory;
  size?: number;
}

export default function CircularScore({ score, riskCategory, size = 150 }: CircularScoreProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const colorMap: Record<RiskCategory, { stroke: string }> = {
    Low: { stroke: "var(--safe)" },
    Medium: { stroke: "var(--warn)" },
    High: { stroke: "#F97316" },
    Critical: { stroke: "var(--risk)" },
  };

  const colors = colorMap[riskCategory] ?? colorMap.Low;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--line)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress indicator circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
      </svg>
      {/* Center score & label */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span style={{ fontSize: size > 120 ? "2.2rem" : "1.6rem", fontWeight: 800, color: "var(--ink)", lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>
          Risk Score
        </span>
      </div>
    </div>
  );
}
