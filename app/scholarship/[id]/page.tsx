import Link from "next/link";
import { notFound } from "next/navigation";
import { getScholarshipByIdOrSlug } from "../../../lib/scholarships";
import { analyze } from "../../../lib/detector";
import ReportView from "../../../components/ReportView";
import BookmarkButton from "../../../components/BookmarkButton";
import { getCurrentUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

type Props = { params: Promise<{ id: string }> };

export const instant = false;

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const s = await getScholarshipByIdOrSlug(id);
  return {
    title: s ? `${s.name} | ScholarCheck` : "Scholarship Details | ScholarCheck",
    description: s ? s.description.slice(0, 160) : "Scholarship details and verification report on ScholarCheck.",
  };
}

export default async function ScholarshipDetailPage({ params }: Props) {
  const { id } = await params;
  const s = await getScholarshipByIdOrSlug(id);
  if (!s) notFound();

  // Check if currently saved by user
  const user = await getCurrentUser();
  let isSaved = false;
  if (user?.userId) {
    try {
      const existing = await prisma.savedScholarship.findUnique({
        where: {
          userId_scholarshipId: {
            userId: user.userId,
            scholarshipId: s.id,
          },
        },
      });
      isSaved = !!existing;
    } catch {
      isSaved = false;
    }
  }

  // Run verification engine on this scholarship's metadata and text
  const verificationResult = analyze({
    url: s.websiteUrl,
    text: `${s.name}. ${s.description} ${s.procedure.join(" ")}`,
    orgName: s.organization,
  });

  const isVerified = s.verificationStatus === "Verified Genuine";
  const deadlineFormatted = s.deadline
    ? new Date(s.deadline).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Ongoing / Rolling Admission";

  return (
    <div style={{ paddingBottom: 64 }}>
      {/* Breadcrumb & Navigation */}
      <div style={{ padding: "20px 0 10px" }}>
        <Link href="/directory" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>
          ← Back to Scholarship Directory
        </Link>
      </div>

      {/* Main Header Hero */}
      <section className="panel" style={{ marginBottom: 24, padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "3px 10px",
                  borderRadius: 4,
                  background: s.type === "Government" ? "#EFF6FF" : "#F3F4F6",
                  color: s.type === "Government" ? "#1D4ED8" : "#374151",
                }}
              >
                {s.type}
              </span>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 4,
                  background: isVerified ? "#ECFDF5" : "#FFFBEB",
                  color: isVerified ? "#047857" : "#B45309",
                }}
              >
                {isVerified ? "✓ Verified Authentic" : "⚠️ Needs Review"}
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 800, margin: "6px 0 10px", color: "var(--ink)", lineHeight: 1.2 }}>
              {s.name}
            </h1>

            <p style={{ fontSize: "1.05rem", color: "var(--muted)", margin: 0 }}>
              Administered by <strong>{s.organization}</strong> • {s.state}, {s.country}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BookmarkButton scholarshipId={s.id} initialSaved={isSaved} size="md" />
            <a
              href={s.applicationUrl || s.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ textDecoration: "none", padding: "10px 20px" }}
            >
              Apply on Official Portal ↗
            </a>
          </div>
        </div>

        {/* Quick Spec Matrix */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginTop: 24,
            padding: "16px 20px",
            background: "var(--paper)",
            borderRadius: 8,
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
              Scholarship Award
            </span>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ink)", marginTop: 2 }}>
              {s.amountFormatted}
            </div>
          </div>

          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
              Eligible Level
            </span>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              {s.educationLevel}
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Stream: {s.stream}</span>
          </div>

          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
              Application Deadline
            </span>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              {deadlineFormatted}
            </div>
          </div>

          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
              Official Website
            </span>
            <div style={{ marginTop: 2 }}>
              <a
                href={s.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.9rem", color: "#2563EB", fontWeight: 600, textDecoration: "underline", wordBreak: "break-all" }}
              >
                {new URL(/^https?:\/\//i.test(s.websiteUrl) ? s.websiteUrl : `https://${s.websiteUrl}`).hostname}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 7fr) minmax(0, 5fr)", gap: 24, alignItems: "start" }}>
        {/* Left Column: Requirements, Benefits, Documents, Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Overview */}
          <div className="panel">
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 12 }}>Scheme Overview</h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--ink)", margin: 0 }}>
              {s.description}
            </p>
          </div>

          {/* Eligibility Criteria */}
          {s.eligibilityCriteria.length > 0 && (
            <div className="panel">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🎯</span> Eligibility Criteria
              </h2>
              <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
                {s.eligibilityCriteria.map((item, i) => (
                  <li key={i} style={{ fontSize: "0.95rem", lineHeight: 1.5, color: "var(--ink)" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits & Financial Assistance */}
          {s.benefits.length > 0 && (
            <div className="panel">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span>💰</span> Benefits & Financial Assistance
              </h2>
              <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
                {s.benefits.map((item, i) => (
                  <li key={i} style={{ fontSize: "0.95rem", lineHeight: 1.5, color: "var(--ink)" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Documents Checklist */}
          {s.documentsRequired.length > 0 && (
            <div className="panel">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span>📄</span> Documents Required
              </h2>
              <div style={{ display: "grid", gap: 8 }}>
                {s.documentsRequired.map((doc, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      background: "var(--paper)",
                      borderRadius: 6,
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>📑</span>
                    <span style={{ color: "var(--ink)" }}>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Apply */}
          {s.procedure.length > 0 && (
            <div className="panel">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🚀</span> Application Procedure
              </h2>
              <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
                {s.procedure.map((step, i) => (
                  <li key={i} style={{ fontSize: "0.95rem", lineHeight: 1.5, color: "var(--ink)" }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right Column: Automated Fraud Verification Report */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="panel">
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 12 }}>
              Listing Authenticity Check
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "0 0 16px" }}>
              ScholarCheck automatically verifies all scholarship listings against deceptive domain names, unverified fees, and pressure tactics.
            </p>

            <ReportView result={verificationResult} />
          </div>
        </div>
      </div>
    </div>
  );
}
