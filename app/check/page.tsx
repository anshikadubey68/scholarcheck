import AnalyzeForm from "../../components/AnalyzeForm";

export const metadata = {
  title: "Check a Scholarship Offer | ScholarCheck",
  description: "Paste a scholarship link or offer text to verify its authenticity using AI + rule-based fraud detection.",
};

export default function CheckPage() {
  return (
    <>
      <section className="hero">
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--badge-pill-bg)", color: "var(--badge-pill-color)", border: "1px solid var(--line)", padding: "4px 12px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 700, marginBottom: 10 }}>
          <span>🛡️</span> AI-Powered Anti-Fraud Protection
        </div>
        <h1>Check a scholarship before you apply</h1>
        <p>
          Paste the link and the text of the offer. We screen for deceptive lookalike domains, upfront payment demands, unaccredited organizations, copied descriptions, and false urgency tactics—with evidence for every flag.
        </p>
      </section>

      <AnalyzeForm />
    </>
  );
}
