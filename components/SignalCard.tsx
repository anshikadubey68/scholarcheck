import type { Signal } from "../lib/detector/types";

const CATEGORY: Record<Signal["category"], string> = {
  domain: "Website address",
  payment: "Payment demand",
  organization: "Organization authenticity",
  copied: "Copied content",
  language: "Pressure language",
  eligibility: "Eligibility claim",
};

export default function SignalCard({ signal }: { signal: Signal }) {
  const isCritical = signal.severity === "critical";

  return (
    <li className={`signal ${signal.severity === "critical" ? "high" : signal.severity}`}>
      <div className="signal-top">
        <strong>{CATEGORY[signal.category] ?? signal.category}</strong>
        <span style={{ fontWeight: 600, color: isCritical ? "#B42318" : undefined }}>
          {signal.severity.toUpperCase()} severity (+{signal.weight} pts)
        </span>
      </div>
      <p style={{ margin: "4px 0 0", color: "var(--ink)", fontSize: "0.9rem" }}>{signal.evidence}</p>
    </li>
  );
}
