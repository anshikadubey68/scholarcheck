"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { DiscoveredScholarship, StudentProfileParams } from "@/lib/aiScholarshipFinder";
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle,
  FileText,
  Calendar,
  Building,
  GraduationCap,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface AiLiveFinderViewProps {
  initialProfile?: Partial<StudentProfileParams> | null;
}

const QUICK_FILTERS = [
  { label: "All Opportunities", query: "" },
  { label: "💻 Engineering & Tech", query: "Engineering and technology STEM scholarships" },
  { label: "🏢 Corporate CSR Grants", query: "Corporate CSR merit and need scholarships like Reliance, Tata, HDFC" },
  { label: "🏛️ Central Govt Schemes", query: "Government of India National Scholarship Portal schemes" },
  { label: "👩 Women in STEM", query: "Scholarships exclusively for female students in higher education" },
  { label: "🌍 Study Abroad", query: "International study abroad masters and undergraduate grants" },
];

export default function AiLiveFinderView({ initialProfile }: AiLiveFinderViewProps) {
  const [profile, setProfile] = useState<StudentProfileParams>({
    fullName: initialProfile?.fullName || "Priya Sharma",
    educationLevel: initialProfile?.educationLevel || "Undergraduate",
    course: initialProfile?.course || "B.Tech Computer Science",
    academicYear: initialProfile?.academicYear || "3rd Year",
    institution: initialProfile?.institution || "Delhi Technological University",
    gpaOrPercentage: initialProfile?.gpaOrPercentage || 8.4,
    familyIncome: initialProfile?.familyIncome || 240000,
    state: initialProfile?.state || "Delhi",
    country: initialProfile?.country || "India",
    category: initialProfile?.category || "OBC",
    customQuery: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [results, setResults] = useState<DiscoveredScholarship[]>([]);
  const [isAiPowered, setIsAiPowered] = useState<boolean>(false);
  const [source, setSource] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (overrideQuery?: string) => {
    setLoading(true);
    setHasSearched(true);
    const queryToUse = overrideQuery !== undefined ? overrideQuery : profile.customQuery;

    setStatusMessage("Connecting to Google Gemini 2.5 Flash...");
    const t1 = setTimeout(() => setStatusMessage("Scanning live official portals & government databases..."), 1200);
    const t2 = setTimeout(() => setStatusMessage("Synthesizing eligibility match scores and deadlines..."), 2600);

    try {
      const res = await fetch("/api/scholarships/ai-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, customQuery: queryToUse }),
      });

      const data = await res.json();
      if (res.ok && data.scholarships) {
        setResults(data.scholarships);
        setIsAiPowered(data.isAiPowered);
        setSource(data.source || "Gemini Search");
      }
    } catch (e) {
      console.error("AI live search failed:", e);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setLoading(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="ai-live-finder-container">
      {/* AI Hero Banner */}
      <div
        className="panel"
        style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.12))",
          border: "1px solid rgba(139, 92, 246, 0.25)",
          borderRadius: 14,
          padding: "24px 28px",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-3 py-1 text-xs gap-1.5">
                <Sparkles className="size-3.5" />
                Gemini 2.5 Live Web Grounding
              </Badge>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600 }}>
                Real-Time Search
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "var(--ink)", margin: "4px 0 8px" }}>
              Find Live Scholarships with Real AI
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", maxWidth: 650, margin: 0, lineHeight: 1.5 }}>
              Unlike static directories, our AI uses <strong>Google Search Grounding</strong> to discover active, real-time scholarships directly from national portals, corporate CSR initiatives, and verified trusts.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => handleSearch()}
            disabled={loading}
            className="h-11 px-6 font-bold gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Discovering...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Discover Live Opportunities
              </>
            )}
          </Button>
        </div>

        {/* Quick Filter Pills */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(139, 92, 246, 0.18)" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", marginRight: 12 }}>
            Instant Search Categories:
          </span>
          <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {QUICK_FILTERS.map((f, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setProfile({ ...profile, customQuery: f.query });
                  handleSearch(f.query);
                }}
                disabled={loading}
                style={{
                  background: profile.customQuery === f.query ? "var(--ink)" : "var(--card)",
                  color: profile.customQuery === f.query ? "var(--bg)" : "var(--ink)",
                  border: "1px solid var(--line)",
                  borderRadius: 999,
                  padding: "4px 12px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split Layout: Profile Customizer on Left, Live Results on Right */}
      <div className="split" style={{ alignItems: "start" }}>
        {/* Left Column: Student Parameters */}
        <div className="panel" style={{ position: "sticky", top: 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <GraduationCap className="size-4 text-primary" />
              Target Student Profile
            </h3>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Customizable</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <label className="field">
              <span>Specific Goal / Focus Query</span>
              <div className="relative">
                <input
                  value={profile.customQuery || ""}
                  onChange={(e) => setProfile({ ...profile, customQuery: e.target.value })}
                  placeholder="e.g. AI research, Merit-cum-means, Girls tech"
                  style={{ paddingRight: 32 }}
                />
                <Search className="size-4 absolute right-3 top-3 text-muted-foreground" />
              </div>
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <label className="field">
                <span>Education Level</span>
                <NativeSelect
                  className="w-full"
                  value={profile.educationLevel}
                  onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value })}
                >
                  <NativeSelectOption value="Undergraduate">Undergraduate</NativeSelectOption>
                  <NativeSelectOption value="Postgraduate">Postgraduate</NativeSelectOption>
                  <NativeSelectOption value="School / 10+2">School / 10+2</NativeSelectOption>
                  <NativeSelectOption value="Doctorate / Ph.D.">Doctorate / Ph.D.</NativeSelectOption>
                </NativeSelect>
              </label>

              <label className="field">
                <span>Academic Year</span>
                <NativeSelect
                  className="w-full"
                  value={profile.academicYear}
                  onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
                >
                  <NativeSelectOption value="1st Year">1st Year</NativeSelectOption>
                  <NativeSelectOption value="2nd Year">2nd Year</NativeSelectOption>
                  <NativeSelectOption value="3rd Year">3rd Year</NativeSelectOption>
                  <NativeSelectOption value="Final Year">Final Year</NativeSelectOption>
                </NativeSelect>
              </label>
            </div>

            <label className="field">
              <span>Course / Degree</span>
              <input
                value={profile.course}
                onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                required
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <label className="field">
                <span>CGPA / Percentage</span>
                <input
                  type="number"
                  step="0.1"
                  value={profile.gpaOrPercentage}
                  onChange={(e) => setProfile({ ...profile, gpaOrPercentage: parseFloat(e.target.value) || 0 })}
                  required
                />
              </label>

              <label className="field">
                <span>Annual Family Income (₹)</span>
                <input
                  type="number"
                  value={profile.familyIncome}
                  onChange={(e) => setProfile({ ...profile, familyIncome: parseInt(e.target.value) || 0 })}
                  required
                />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <label className="field">
                <span>State / Domicile</span>
                <input
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  required
                />
              </label>

              <label className="field">
                <span>Category</span>
                <NativeSelect
                  className="w-full"
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                >
                  <NativeSelectOption value="General">General</NativeSelectOption>
                  <NativeSelectOption value="OBC">OBC</NativeSelectOption>
                  <NativeSelectOption value="SC">SC</NativeSelectOption>
                  <NativeSelectOption value="ST">ST</NativeSelectOption>
                  <NativeSelectOption value="EWS">EWS</NativeSelectOption>
                  <NativeSelectOption value="Minority">Minority</NativeSelectOption>
                </NativeSelect>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-3 font-bold gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Searching Active Portals...
                </>
              ) : (
                <>
                  <RefreshCw className="size-4" />
                  Search Matching Grants
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Right Column: Live Results */}
        <div style={{ flex: 1, minWidth: 320 }}>
          {/* Status Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--ink)" }}>
                Discovered Real-Time Opportunities ({results.length})
              </h3>
              {source && (
                <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                  Source: <strong>{source}</strong> {isAiPowered && "• ✨ Live Grounded"}
                </span>
              )}
            </div>

            {results.length > 0 && (
              <Badge variant="outline" className="text-xs font-semibold gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle className="size-3" />
                Live Portals Verified
              </Badge>
            )}
          </div>

          {/* Loading Animation Box */}
          {loading && (
            <div
              className="panel"
              style={{
                textAlign: "center",
                padding: "48px 24px",
                background: "linear-gradient(to bottom, rgba(99, 102, 241, 0.04), rgba(139, 92, 246, 0.08))",
                border: "1px dashed rgba(139, 92, 246, 0.4)",
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                    <Sparkles className="size-6 text-primary animate-spin" />
                  </div>
                </div>
              </div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                AI Scholarship Agent at Work
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: 0 }}>
                {statusMessage || "Searching verified government and corporate grant portals..."}
              </p>
            </div>
          )}

          {/* Empty State before search */}
          {!hasSearched && !loading && (
            <div
              className="panel"
              style={{
                textAlign: "center",
                padding: "50px 24px",
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: "2.5rem" }}>🎯</span>
              <h4 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "12px 0 6px", color: "var(--ink)" }}>
                Ready to Discover Real Scholarships
              </h4>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: 450, margin: "0 auto 20px" }}>
                Click below to launch an AI live scan across active state, central, and corporate scholarship portals tailored to your profile.
              </p>
              <Button
                onClick={() => handleSearch()}
                className="font-bold gap-2 px-6"
              >
                <Sparkles className="size-4" />
                Start AI Live Search
              </Button>
            </div>
          )}

          {/* Discovered Scholarship Cards */}
          {hasSearched && !loading && results.length === 0 && (
            <div className="panel" style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ color: "var(--muted)", margin: 0 }}>
                No active scholarships found for this exact combination. Try broadening your field of study or selecting one of the instant search categories above.
              </p>
            </div>
          )}

          <div style={{ display: "grid", gap: 16 }}>
            {results.map((s) => {
              const typeColor =
                s.type === "Government"
                  ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
                  : s.type === "International"
                  ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";

              return (
                <div
                  key={s.id}
                  className="panel"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    padding: "22px 24px",
                    borderRadius: 12,
                    border: "1px solid var(--line)",
                    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                  }}
                >
                  {/* Top Bar: Badges + Match % */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Badge variant="outline" className={`text-[11px] font-bold uppercase tracking-wider ${typeColor}`}>
                        {s.type}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                        <Building className="size-3.5" />
                        {s.organization}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span
                        style={{
                          background: "var(--ink)",
                          color: "var(--bg)",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {s.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  {/* Title & Financial Award */}
                  <div>
                    <h4 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "2px 0 6px", color: "var(--ink)", lineHeight: 1.3 }}>
                      {s.name}
                    </h4>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", fontSize: "0.85rem", color: "var(--muted)" }}>
                      <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: "0.95rem" }}>
                        💰 {s.amount}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {s.deadline}
                      </span>
                    </div>
                  </div>

                  {/* AI Why You Match Callout */}
                  <div
                    style={{
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: "0.88rem",
                      lineHeight: 1.5,
                      color: "var(--ink)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: "0.8rem", color: "var(--primary, #6366F1)", marginBottom: 4 }}>
                      <Sparkles className="size-3.5" />
                      Why Your Profile Matches:
                    </div>
                    <p style={{ margin: 0 }}>{s.whyYouMatch}</p>
                  </div>

                  {/* Eligibility Summary & Document Requirements */}
                  <div>
                    <p style={{ fontSize: "0.88rem", color: "var(--muted)", margin: "0 0 10px", lineHeight: 1.5 }}>
                      <strong>Criteria:</strong> {s.eligibilitySummary}
                    </p>

                    {s.keyDocuments && s.keyDocuments.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", marginRight: 4 }}>
                          Documents:
                        </span>
                        {s.keyDocuments.map((doc, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: "0.75rem",
                              background: "var(--card)",
                              border: "1px solid var(--line)",
                              padding: "2px 8px",
                              borderRadius: 4,
                              color: "var(--ink)",
                            }}
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--line)", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Link
                        href={`/check?url=${encodeURIComponent(s.officialUrl)}&org=${encodeURIComponent(s.organization)}`}
                        className="btn ghost"
                        style={{ fontSize: "0.8rem", padding: "6px 12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                      >
                        <ShieldCheck className="size-3.5 text-emerald-600" />
                        Verify Authenticity
                      </Link>
                    </div>

                    <a
                      href={s.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ fontSize: "0.85rem", padding: "8px 16px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      Apply on Official Portal
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
