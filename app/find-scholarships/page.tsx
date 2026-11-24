import { connection } from "next/server";
import FindScholarshipsClient from "../../components/FindScholarshipsClient";
import { getDbScholarships } from "../../lib/scholarships";
import { getCurrentUser } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export const metadata = {
  title: "AI Scholarship Discovery & Matcher | ScholarCheck",
  description: "Discover real-time, live scholarships with Google Gemini and match with verified academic funding opportunities tailored to your profile.",
};

export default async function FindScholarshipsPage() {
  await connection();

  const [scholarships, session] = await Promise.all([
    getDbScholarships(),
    getCurrentUser(),
  ]);

  let initialProfile = null;
  if (session?.userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { profile: true },
      });
      if (user?.profile) {
        initialProfile = {
          fullName: user.profile.fullName,
          educationLevel: user.profile.educationLevel,
          course: user.profile.course,
          academicYear: user.profile.academicYear,
          institution: user.profile.institution,
          gpaOrPercentage: user.profile.gpaOrPercentage,
          familyIncome: user.profile.familyIncome,
          state: user.profile.state,
          country: user.profile.country,
          category: user.profile.category,
        };
      }
    } catch (e) {
      console.error("Failed to load user profile for matcher:", e);
    }
  }

  return (
    <>
      <section className="hero">
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--badge-pill-bg)", color: "var(--badge-pill-color)", border: "1px solid var(--line)", padding: "4px 12px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 700, marginBottom: 10 }}>
          <span>✨</span> Gemini AI + Real-Time Search Grounding
        </div>
        <h1>AI Scholarship Discovery & Matcher</h1>
        <p>
          Discover real-time, verified government and corporate scholarships using live AI search, or match your profile directly against our pre-screened directory.
        </p>
      </section>

      <FindScholarshipsClient scholarships={scholarships} initialProfile={initialProfile} />
    </>
  );
}
