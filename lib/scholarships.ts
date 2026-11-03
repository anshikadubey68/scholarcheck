import { prisma } from "./prisma";

export interface ScholarshipDetail {
  id: string;
  slug: string;
  name: string;
  organization: string;
  type: string;
  educationLevel: string;
  stream: string;
  state: string;
  country: string;
  amount: number;
  amountFormatted: string;
  deadline: string | null;
  verificationStatus: string;
  websiteUrl: string;
  applicationUrl: string;
  description: string;
  eligibilityCriteria: string[];
  benefits: string[];
  documentsRequired: string[];
  procedure: string[];
  featured: boolean;
  score: number;
}

function parseJsonArray(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getDbScholarships(): Promise<ScholarshipDetail[]> {
  try {
    const list = await prisma.scholarship.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return list.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      organization: s.organization,
      type: s.type,
      educationLevel: s.educationLevel,
      stream: s.stream,
      state: s.state,
      country: s.country,
      amount: s.amount,
      amountFormatted: s.amountFormatted,
      deadline: s.deadline ? s.deadline.toISOString() : null,
      verificationStatus: s.verificationStatus,
      websiteUrl: s.websiteUrl,
      applicationUrl: s.applicationUrl,
      description: s.description,
      eligibilityCriteria: parseJsonArray(s.eligibilityCriteria),
      benefits: parseJsonArray(s.benefits),
      documentsRequired: parseJsonArray(s.documentsRequired),
      procedure: parseJsonArray(s.procedure),
      featured: s.featured,
      score: s.verificationStatus === "Needs Review" ? 45 : s.verificationStatus === "High Risk" ? 85 : 5,
    }));
  } catch (error) {
    console.error("Failed to fetch scholarships from database:", error);
    return [];
  }
}

export async function getScholarshipByIdOrSlug(idOrSlug: string): Promise<ScholarshipDetail | null> {
  try {
    const s = await prisma.scholarship.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!s) return null;

    return {
      id: s.id,
      slug: s.slug,
      name: s.name,
      organization: s.organization,
      type: s.type,
      educationLevel: s.educationLevel,
      stream: s.stream,
      state: s.state,
      country: s.country,
      amount: s.amount,
      amountFormatted: s.amountFormatted,
      deadline: s.deadline ? s.deadline.toISOString() : null,
      verificationStatus: s.verificationStatus,
      websiteUrl: s.websiteUrl,
      applicationUrl: s.applicationUrl,
      description: s.description,
      eligibilityCriteria: parseJsonArray(s.eligibilityCriteria),
      benefits: parseJsonArray(s.benefits),
      documentsRequired: parseJsonArray(s.documentsRequired),
      procedure: parseJsonArray(s.procedure),
      featured: s.featured,
      score: s.verificationStatus === "Needs Review" ? 45 : s.verificationStatus === "High Risk" ? 85 : 5,
    };
  } catch (error) {
    console.error(`Failed to fetch scholarship ${idOrSlug}:`, error);
    return null;
  }
}

