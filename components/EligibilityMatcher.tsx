"use client";

import { useState } from "react";
import Link from "next/link";
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

  const levelBadgeStyles: Record<string, { bg: string; color: string; border: string }> = {
    "High Match": { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
    "Moderate Match": { bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE" },
    "Potential Match": { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
    "Low Match": { bg: "#F3F4F6", color: "#4B5563", border: "#E5E7EB" },
  };

  return (
    <div style={{ paddingBottom: 64 }}>
      {/* Legal & Advisory Disclaimer Banner */}
      <div
        style={{
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: 8,
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "1.3rem" }}>ℹ️</span>
        <div style={{ fontSize: "0.875rem", color: "#1E3A8A", lineHeight: 1.5 }}>
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
              <select
                value={profile.educationLevel}
                onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #AEBBC6", background: "#fff" }}
              >
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="School">School / 10+2</option>
                <option value="Doctorate">Doctorate / Ph.D.</option>
              </select>
            </label>

            <label className="field">
              <span>Academic Year</span>
              <select
                value={profile.academicYear}
                onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #AEBBC6", background: "#fff" }}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
              </select>
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
              <select
                value={profile.category}
                onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: 6, border: "1px solid #AEBBC6", background: "#fff" }}
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
                <option value="Minority">Notified Minority</option>
              </select>
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

          <div style={{ display: "grid", gap: 16 }}>
            {results.map(({ scholarship, matchScore, matchLevel, reasonsQualified, missingOrConditional }) => {
              const badge = levelBadgeStyles[matchLevel] || levelBadgeStyles["Low Match"];

              return (
                <div
                  key={scholarship.id}
                  className="panel"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    borderLeft: `5px solid ${badge.color}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span
                          style={{
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
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
                    <div style={{ background: "#F0FDF4", padding: "10px 14px", borderRadius: 6, fontSize: "0.85rem" }}>
                      <strong style={{ color: "#166534", display: "block", marginBottom: 4 }}>✓ Why you qualify:</strong>
                      <ul style={{ margin: 0, paddingLeft: 16, color: "#15803D" }}>
                        {reasonsQualified.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing or conditional caveats */}
                  {missingOrConditional.length > 0 && (
                    <div style={{ background: "#FEF2F2", padding: "10px 14px", borderRadius: 6, fontSize: "0.85rem" }}>
                      <strong style={{ color: "#991B1B", display: "block", marginBottom: 4 }}>⚠️ Conditional criteria to verify:</strong>
                      <ul style={{ margin: 0, paddingLeft: 16, color: "#B91C1C" }}>
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

