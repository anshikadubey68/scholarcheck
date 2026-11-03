import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import DashboardClient from "../../components/DashboardClient";

export const metadata = {
  title: "Student Dashboard | ScholarCheck",
  description: "Manage your saved scholarships, academic profile, and fraud screening history.",
};

export const instant = false;

export default async function DashboardPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
      bookmarks: {
        include: { scholarship: true },
        orderBy: { createdAt: "desc" },
      },
      verifications: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!userRecord) {
    redirect("/login");
  }

  const savedScholarships = userRecord.bookmarks.map((b) => ({
    id: b.id,
    scholarship: {
      id: b.scholarship.id,
      slug: b.scholarship.slug,
      name: b.scholarship.name,
      organization: b.scholarship.organization,
      type: b.scholarship.type,
      amountFormatted: b.scholarship.amountFormatted,
      deadline: b.scholarship.deadline ? b.scholarship.deadline.toISOString() : null,
      verificationStatus: b.scholarship.verificationStatus,
      websiteUrl: b.scholarship.websiteUrl,
    },
  }));

  const recentVerifications = userRecord.verifications.map((v) => ({
    id: v.id,
    url: v.url,
    orgName: v.orgName,
    score: v.score,
    level: v.level,
    summary: v.summary,
    createdAt: v.createdAt.toISOString(),
  }));

  return (
    <DashboardClient
      user={{
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        profile: userRecord.profile,
      }}
      savedScholarships={savedScholarships}
      recentVerifications={recentVerifications}
    />
  );
}
