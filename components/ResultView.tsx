import type { AnalysisResult } from "../lib/detector/types";
import RiskBadge from "./RiskBadge";
import SignalCard from "./SignalCard";

export default function ResultView({ result }: { result: AnalysisResult }) {
  return (
    <div>
      <div className="verdict">
        <div className="score">{result.score}<small> / 100 risk</small></div>
        <RiskBadge level={result.level} />
      </div>
      <div className="meter" role="img" aria-label={`Risk score ${result.score} out of 100`}>
        <span className="zone" /><span className="zone" /><span className="zone" />
        <i className="mark" style={{ left: `${result.score}%` }} />
      </div>
      <div className="scale"><span>Safe</span><span>Suspicious</span><span>High risk</span></div>

      {result.trustedDomain && <p style={{ marginTop: 16 }}>This website address matches a verified provider.</p>}
      {result.signals.length === 0 ? (
        <p style={{ marginTop: 16 }}>No warning signs found. This is not a guarantee, so confirm the offer on the provider&rsquo;s official site.</p>
      ) : (
        <ul className="signals">{result.signals.map((s) => <SignalCard key={s.id} signal={s} />)}</ul>
      )}
    </div>
  );
}