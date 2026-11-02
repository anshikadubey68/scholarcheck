import type { Signal } from "../lib/detector/types";

const CATEGORY: Record<Signal["category"], string> = {
  domain: "Website address",
  payment: "Payment demand",
  organization: "Organization",
  copied: "Copied content",
  language: "Pressure language",
};

export default function SignalCard({ signal }: { signal: Signal }) {
  return (
    <li className={`signal ${signal.severity}`}>
      <div className="signal-top">
        <strong>{CATEGORY[signal.category]}</strong>
        <span>{signal.severity} severity, +{signal.weight} points</span>
      </div>
      <p>{signal.evidence}</p>
    </li>
  );
}