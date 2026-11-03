import Link from "next/link";
import AnalyzeForm from "../components/AnalyzeForm";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EFF6FF", color: "#1D4ED8", padding: "4px 12px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 700, marginBottom: 10 }}>
          <span>🛡️</span> AI-Powered Anti-Fraud Protection
        </div>
        <h1>Check a scholarship before you apply</h1>
        <p>
          Paste the link and the text of the offer. We screen for deceptive lookalike domains, upfront payment demands, unaccredited organizations, copied descriptions, and false urgency tactics—with evidence for every flag.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
          <Link href="/directory" className="btn ghost" style={{ textDecoration: "none", fontSize: "0.9rem" }}>
            📚 Explore Verified Directory
          </Link>
          <Link href="/find-scholarships" className="btn ghost" style={{ textDecoration: "none", fontSize: "0.9rem" }}>
            🎯 Find Eligible Scholarships
          </Link>
        </div>
      </section>

      <AnalyzeForm />

      {/* Trust & Methodology Strip */}
      <section style={{ borderTop: "1px solid var(--line)", paddingTop: 36, paddingBottom: 64, marginTop: 16 }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 20, textAlign: "center" }}>
          How ScholarCheck Protects Students
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          <div className="panel" style={{ padding: "20px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🌐</div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 6px" }}>Domain & Subdomain Analysis</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
              Detects typosquatting, throwaway TLDs (.xyz, .top), and deceptive subdomains attempting to spoof legitimate government portals (.gov.in).
            </p>
          </div>

          <div className="panel" style={{ padding: "20px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>💳</div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 6px" }}>Upfront Fee Detection</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
              Screens for hidden application, handling, or processing fees, untraceable gift cards, and personal UPI transfer demands. Genuine scholarships never charge fees to award funds.
            </p>
          </div>

          <div className="panel" style={{ padding: "20px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>⏳</div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 6px" }}>Pressure & Guarantee Heuristics</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
              Identifies false urgency tactics (&quot;only 3 slots left&quot;), guaranteed selection without merit review, and phishing attempts for bank passwords or identity documents.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
