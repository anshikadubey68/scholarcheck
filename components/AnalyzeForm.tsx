"use client";
import { useState } from "react";
import { useAnalysis } from "../hooks/useAnalysis";
import ResultView from "./ResultView";

const EMPTY = { url: "", orgName: "", contactEmail: "", text: "" };
const EXAMPLE = {
  url: "http://free-grant-claim.xyz",
  orgName: "Global Youth Foundation",
  contactEmail: "globalyouth.grants@gmail.com",
  text: "Congratulations! You have been selected for a $5,000 grant. Pay a small processing fee by gift card to release your funds. Only 5 slots left!",
};

export default function AnalyzeForm() {
  const [form, setForm] = useState(EMPTY);
  const { result, loading, error, run } = useAnalysis();
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="split">
      <form className="panel" onSubmit={(e) => { e.preventDefault(); run(form); }}>
        <label className="field"><span>Scholarship website link</span>
          <input value={form.url} onChange={set("url")} placeholder="https://" inputMode="url" /></label>
        <label className="field"><span>Organization name</span>
          <input value={form.orgName} onChange={set("orgName")} /></label>
        <label className="field"><span>Contact email</span>
          <input value={form.contactEmail} onChange={set("contactEmail")} type="email" /></label>
        <label className="field"><span>Text of the offer</span>
          <textarea value={form.text} onChange={set("text")} placeholder="Paste the description or the message you received" /></label>
        <div className="row">
          <button className="btn" disabled={loading}>{loading ? "Checking…" : "Check this scholarship"}</button>
          <button type="button" className="btn ghost" onClick={() => setForm(EXAMPLE)}>Fill in a scam example</button>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
      </form>

      <section className="panel" aria-live="polite">
        {result ? <ResultView result={result} /> : (
          <p className="empty">Your result will appear here. Add a link, the offer text, or both.</p>
        )}
      </section>
    </div>
  );
}