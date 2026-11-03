"use client";

import { useState } from "react";
import { useAnalysis } from "../hooks/useAnalysis";
import ResultView from "./ResultView";

const EMPTY = { url: "", orgName: "", contactEmail: "", text: "" };

const SCAM_EXAMPLE = {
  url: "http://free-grant-claim.xyz",
  orgName: "Global Youth Foundation",
  contactEmail: "globalyouth.grants@gmail.com",
  text: "Congratulations! You have been selected for a $5,000 grant. Pay a small processing fee by gift card to release your funds. Only 5 slots left! 100% guaranteed. Send your passport number.",
};

const GENUINE_EXAMPLE = {
  url: "https://scholarships.gov.in",
  orgName: "National Scholarship Portal",
  contactEmail: "helpdesk@nsp.gov.in",
  text: "Centrally sponsored post-matric and merit-cum-means scholarship schemes for eligible Indian students. Applying is completely free of cost through the official government portal. Selection is strictly based on family income documentation and academic merit.",
};

export default function AnalyzeForm() {
  const [form, setForm] = useState(EMPTY);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { result, loading, error, run } = useAnalysis();

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValidationError(null);
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim() && !form.text.trim()) {
      setValidationError("Please provide at least a website URL or the text of the scholarship offer to analyze.");
      return;
    }
    setValidationError(null);
    run(form);
  };

  const handleReset = () => {
    setForm(EMPTY);
    setValidationError(null);
  };

  return (
    <div className="split">
      <form className="panel" onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>Verify Scholarship Offer</h2>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>AI + Rule-Based Inspection</span>
        </div>

        <label className="field">
          <span>Scholarship website link</span>
          <input
            value={form.url}
            onChange={set("url")}
            placeholder="https://example-scholarship.org"
            inputMode="url"
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label className="field">
            <span>Organization name</span>
            <input
              value={form.orgName}
              onChange={set("orgName")}
              placeholder="e.g. Tata Trusts or NSP"
            />
          </label>
          <label className="field">
            <span>Contact email</span>
            <input
              value={form.contactEmail}
              onChange={set("contactEmail")}
              type="email"
              placeholder="e.g. contact@org.org"
            />
          </label>
        </div>

        <label className="field">
          <span>Text of the offer or message</span>
          <textarea
            value={form.text}
            onChange={set("text")}
            placeholder="Paste the scholarship announcement, email, WhatsApp message, or website text here..."
            rows={5}
          />
        </label>

        <div className="row" style={{ marginTop: 16, gap: 10 }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Analyzing offer..." : "Check this scholarship"}
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setForm(SCAM_EXAMPLE);
              setValidationError(null);
            }}
          >
            Fill in scam sample
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setForm(GENUINE_EXAMPLE);
              setValidationError(null);
            }}
          >
            Fill in genuine sample
          </button>
        </div>

        {validationError && (
          <p className="error" role="alert" style={{ marginTop: 12 }}>
            {validationError}
          </p>
        )}
        {error && (
          <p className="error" role="alert" style={{ marginTop: 12 }}>
            {error}
          </p>
        )}
      </form>

      <section className="panel" aria-live="polite">
        {loading ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 6px" }}>Performing Fraud Analysis</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
              Checking domain authenticity, payment fee demands, and deceptive claims...
            </p>
          </div>
        ) : result ? (
          <ResultView result={result} onReset={handleReset} />
        ) : (
          <div style={{ padding: "30px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                🛡️
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>No Scholarship Checked Yet</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Enter an offer on the left to begin verification</span>
              </div>
            </div>
            <p className="empty" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              Our multi-layered inspection engine screens for lookalike fake domains, upfront fee demands, free email addresses, pressure tactics, and copied descriptions against verified repositories.
            </p>
            <div style={{ background: "var(--paper)", padding: "14px 18px", borderRadius: 8, marginTop: 16, fontSize: "0.85rem", color: "var(--muted)" }}>
              <strong>Tip:</strong> You can click <em>&ldquo;Fill in scam sample&rdquo;</em> or <em>&ldquo;Fill in genuine sample&rdquo;</em> to test how ScholarCheck detects warning signs.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
