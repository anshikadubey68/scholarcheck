import type { AnalysisResult } from "../lib/detector/types";

export const LEVEL_LABEL: Record<AnalysisResult["level"], string> = {
  safe: "Looks safe",
  suspicious: "Suspicious",
  "high-risk": "High risk",
};

export default function RiskBadge({ level }: { level: AnalysisResult["level"] }) {
  return <span className={`badge ${level}`}>{LEVEL_LABEL[level]}</span>;
}