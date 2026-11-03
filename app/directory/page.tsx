import DirectoryList from "../../components/DirectoryList";
import { getDbScholarships } from "../../lib/scholarships";
import { getCurrentUser } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export const metadata = {
  title: "Scholarship Directory | ScholarCheck",
  description: "Browse verified government, private, and international scholarships. Every opportunity is pre-screened for legitimacy.",
};

export const instant = false;

export default async function DirectoryPage() {
  const scholarships = await getDbScholarships();
  const user = await getCurrentUser();

  let initialBookmarks: string[] = [];
  if (user?.userId) {
    try {
      const saved = await prisma.savedScholarship.findMany({
        where: { userId: user.userId },
        select: { scholarshipId: true },
      });
      initialBookmarks = saved.map((s) => s.scholarshipId);
    } catch {
      initialBookmarks = [];
    }
  }

  return (
    <>
      <section className="hero">
        <h1>Scholarship Directory</h1>
        <p>
          Discover legitimate funding opportunities across India and internationally. Every listing includes verified eligibility, application procedures, and direct official portal links.
        </p>
      </section>

      <DirectoryList scholarships={scholarships} initialBookmarks={initialBookmarks} />
    </>
  );
}
