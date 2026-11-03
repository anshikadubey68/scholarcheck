import EligibilityMatcher from "../../components/EligibilityMatcher";
import { getDbScholarships } from "../../lib/scholarships";
import { getCurrentUser } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export const metadata = {
  title: "Find Matching Scholarships | ScholarCheck",
  description: "AI-assisted scholarship eligibility matching. Enter your academic background and find verified grants tailored to your profile.",
};

export const instant = false;

export default async function FindScholarshipsPage() {
  const scholarships = await getDbScholarships();
  const session = await getCurrentUser();

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
        <h1>AI Scholarship Eligibility Matcher</h1>
        <p>
          Enter your academic details, course, family income, and domicile to find verified scholarships that match your eligibility criteria.
        </p>
      </section>

      <EligibilityMatcher scholarships={scholarships} initialProfile={initialProfile} />
    </>
  );
}
