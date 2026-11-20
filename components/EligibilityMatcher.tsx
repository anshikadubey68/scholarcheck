"use client";

import { useState } from "react";
import Link from "next/link";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { matchAllScholarships, type StudentProfileInput, type MatchResult } from "../lib/matcher";
import type { ScholarshipDetail } from "../lib/scholarships";

interface EligibilityMatcherProps {
  scholarships: ScholarshipDetail[];
  initialProfile?: Partial<StudentProfileInput> | null;
}

const DEFAULT_PROFILE: StudentProfileInput = {
  fullName: "Priya Sharma",
  educationLevel: "Undergraduate",
  course: "B.Tech Computer Science",
  academicYear: "3rd Year",
  institution: "Delhi Technological University",
  gpaOrPercentage: 8.4,
  familyIncome: 240000,
  state: "Delhi",
  country: "India",
  category: "OBC",
};

export default function EligibilityMatcher({ scholarships, initialProfile }: EligibilityMatcherProps) {
  const [profile, setProfile] = useState<StudentProfileInput>({
    ...DEFAULT_PROFILE,
    ...(initialProfile || {}),
  });

  const [results, setResults] = useState<MatchResult[]>(() =>
    matchAllScholarships({ ...DEFAULT_PROFILE, ...(initialProfile || {}) }, scholarships)
  );

  const [loading, setLoading] = useState(false);

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const computed = matchAllScholarships(profile, scholarships);
      setResults(computed);
      setLoading(false);
    }, 250);
  };

  return (
    <div style={{ paddingBottom: 64 }}>
      {/* Legal & Advisory Disclaimer Banner */}
      <div
        className="advisory-notice"
        style={{
          borderRadius: 8,
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "1.3rem" }}>ℹ️</span>
        <div style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
          <strong>Official Advisory Notice:</strong> Match scores are calculated algorithmically against published criteria to help you find opportunities. <strong>A match score does not guarantee scholarship selection or award.</strong> Final eligibility, quota allocations, and document approvals are determined strictly and exclusively by each scholarship&apos;s governing authority.
        </div>
      </div>

      <div className="split" style={{ alignItems: "start" }}>
        {/* Left Column: Student Profile Form */}
        <form className="panel" onSubmit={handleMatch}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>Your Academic Profile</h2>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Adjust to re-match</span>
          </div>

          <label className="field">
            <span>Student Full Name</span>
            <input
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              required
            />
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
                <NativeSelectOption value="School">School / 10+2</NativeSelectOption>
                <NativeSelectOption value="Doctorate">Doctorate / Ph.D.</NativeSelectOption>
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
            <span>Course / Degree Name</span>
            <input
              value={profile.course}
              onChange={(e) => setProfile({ ...profile, course: e.target.value })}
              placeholder="e.g. B.Tech Computer Science or MBBS"
              required
            />
          </label>

          <label className="field">
            <span>College / Institution</span>
            <input
              value={profile.institution}
              onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
              required
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label className="field">
              <span>CGPA or Percentage</span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={profile.gpaOrPercentage}
                onChange={(e) => setProfile({ ...profile, gpaOrPercentage: parseFloat(e.target.value) || 0 })}
                required
              />
            </label>

            <label className="field">
              <span>Family Annual Income (₹)</span>
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
              <span>Category (if applicable)</span>
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
                <NativeSelectOption value="Minority">Notified Minority</NativeSelectOption>
              </NativeSelect>
            </label>
          </div>

          <button type="submit" className="btn" disabled={loading} style={{ width: "100%", padding: "12px", marginTop: 8 }}>
            {loading ? "Matching Criteria..." : "Calculate Eligibility Matches"}
          </button>
        </form>

        {/* Right Column: Match Results */}
        <section aria-live="polite">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
              Matched Opportunities ({results.length})
            </h2>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Sorted by match compatibility</span>
          </div>

          <div className="matched-results-scroll" style={{ display: "grid", gap: 16 }}>
            {results.map(({ scholarship, matchScore, matchLevel, reasonsQualified, missingOrConditional }) => {
              const matchBadgeClass =
                matchLevel === "High Match"
                  ? "match-badge-high"
                  : matchLevel === "Moderate Match"
                  ? "match-badge-moderate"
                  : matchLevel === "Potential Match"
                  ? "match-badge-potential"
                  : "match-badge-low";

              return (
                <div
                  key={scholarship.id}
                  className="panel"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span
                          className={matchBadgeClass}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: "0.75rem",
                            fontWeight: 800,
                          }}
                        >
                          {matchScore}% • {matchLevel}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600 }}>
                          {scholarship.type}
                        </span>
                      </div>

                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "2px 0 4px", color: "var(--ink)" }}>
                        <Link href={`/scholarship/${scholarship.slug || scholarship.id}`} style={{ textDecoration: "none" }}>
                          {scholarship.name}
                        </Link>
                      </h3>
                      <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                        {scholarship.organization} • <strong>{scholarship.amountFormatted}</strong>
                      </span>
                    </div>

                    <Link
                      href={`/scholarship/${scholarship.slug || scholarship.id}`}
                      className="btn"
                      style={{ padding: "6px 14px", fontSize: "0.8rem", textDecoration: "none" }}
                    >
                      View Details
                    </Link>
                  </div>

                  {/* Why you qualify */}
                  {reasonsQualified.length > 0 && (
                    <div className="qualify-box">
                      <strong className="qualify-title">✓ Why you qualify:</strong>
                      <ul className="qualify-list">
                        {reasonsQualified.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing or conditional caveats */}
                  {missingOrConditional.length > 0 && (
                    <div className="conditional-box">
                      <strong className="conditional-title">⚠️ Conditional criteria to verify:</strong>
                      <ul className="conditional-list">
                        {missingOrConditional.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                      Deadline: {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString("en-IN") : "Rolling"}
                    </span>
                    <a
                      href={scholarship.applicationUrl || scholarship.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "0.85rem", color: "#2563EB", fontWeight: 600, textDecoration: "underline" }}
                    >
                      Official Application Portal ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

