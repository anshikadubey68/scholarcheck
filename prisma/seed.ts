import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed demo student user
  const demoEmail = "student@scholarcheck.org";
  const existingUser = await prisma.user.findUnique({ where: { email: demoEmail } });

  let userId: string;
  if (!existingUser) {
    const passwordHash = await bcrypt.hash("Password123!", 10);
    const user = await prisma.user.create({
      data: {
        name: "Priya Sharma",
        email: demoEmail,
        passwordHash,
        role: "student",
        profile: {
          create: {
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
            gender: "Female",
          },
        },
      },
    });
    userId = user.id;
    console.log("Created demo user:", user.email);
  } else {
    userId = existingUser.id;
  }

  // 2. Comprehensive Scholarships
  const scholarshipsData = [
    {
      slug: "nsp-post-matric",
      name: "Post-Matric Scholarship Scheme for Minorities",
      organization: "Ministry of Minority Affairs (NSP)",
      type: "Government",
      educationLevel: "Undergraduate",
      stream: "Any",
      state: "All India",
      country: "India",
      amount: 30000,
      amountFormatted: "₹30,000 / year + admission fees",
      deadline: new Date("2026-12-15"),
      verificationStatus: "Verified Genuine",
      websiteUrl: "https://scholarships.gov.in",
      applicationUrl: "https://scholarships.gov.in",
      featured: true,
      description:
        "Centrally sponsored scheme providing financial assistance to minority community students studying in Class 11 up to Ph.D. level to cover admission fees, tuition, and maintenance allowances.",
      eligibilityCriteria: JSON.stringify([
        "Belong to notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)",
        "Minimum 50% marks or equivalent grade in the previous final examination",
        "Annual family income from all sources must not exceed ₹2,50,000",
        "Enrolled in a recognized government or private college/university",
      ]),
      benefits: JSON.stringify([
        "Admission and tuition fee for UG/PG: Up to ₹7,000 per annum",
        "Maintenance allowance: ₹3,000 per annum for day scholars, ₹5,700 for hostellers",
        "Direct Bank Transfer (DBT) directly into student's Aadhaar-linked account",
      ]),
      documentsRequired: JSON.stringify([
        "Aadhaar Card or Aadhaar Enrollment slip",
        "Income Certificate issued by competent state authority",
        "Minority Community Self-Declaration Certificate",
        "Previous year mark sheets / academic transcripts",
        "Fee receipt of the current academic year",
        "Bank account passbook copy",
      ]),
      procedure: JSON.stringify([
        "Register on the National Scholarship Portal (scholarships.gov.in) with Aadhaar OTR",
        "Fill out applicant details, college course info, and family income",
        "Upload scanned self-attested supporting documents",
        "Submit the application and verify through institute nodal officer (INO)",
        "Track application status directly on NSP portal",
      ]),
    },
    {
      slug: "central-sector-scheme-csss",
      name: "Central Sector Scheme of Scholarships for College and University Students",
      organization: "Department of Higher Education (MHRD)",
      type: "Government",
      educationLevel: "Undergraduate",
      stream: "Any",
      state: "All India",
      country: "India",
      amount: 20000,
      amountFormatted: "₹12,000 to ₹20,000 / year",
      deadline: new Date("2026-11-30"),
      verificationStatus: "Verified Genuine",
      websiteUrl: "https://scholarships.gov.in",
      applicationUrl: "https://scholarships.gov.in",
      featured: true,
      description:
        "Merit-cum-means scholarship for meritorious students from low-income families to meet day-to-day educational expenses while pursuing graduate and professional degrees.",
      eligibilityCriteria: JSON.stringify([
        "Above 80th percentile of successful candidates in the relevant stream in Class 12th board",
        "Pursuing regular full-time degree courses recognized by AICTE/UGC",
        "Annual family income not exceeding ₹4,50,000",
        "Not receiving any other Central or State Government scholarship",
      ]),
      benefits: JSON.stringify([
        "₹12,000 per annum at graduation level for the first 3 years",
        "₹20,000 per annum at postgraduate level (4th and 5th year for 5-year integrated courses)",
        "Paid directly via DBT in October-November",
      ]),
      documentsRequired: JSON.stringify([
        "Class 12th passing certificate & mark sheet",
        "Income certificate from revenue authority",
        "College admission fee receipt",
        "Student Bank Passbook linked with Aadhaar",
      ]),
      procedure: JSON.stringify([
        "Verify your roll number is on the state board percentile merit list",
        "Apply via National Scholarship Portal under Department of Higher Education",
        "Submit printed copy to college verification authority",
      ]),
    },
    {
      slug: "reliance-foundation-ug",
      name: "Reliance Foundation Undergraduate Scholarship",
      organization: "Reliance Foundation",
      type: "Private",
      educationLevel: "Undergraduate",
      stream: "Any",
      state: "All India",
      country: "India",
      amount: 200000,
      amountFormatted: "Up to ₹2,00,000 over course duration",
      deadline: new Date("2026-11-15"),
      verificationStatus: "Verified Genuine",
      websiteUrl: "https://www.reliancefoundation.org",
      applicationUrl: "https://www.reliancefoundation.org",
      featured: true,
      description:
        "Supports meritorious first-year undergraduate students in any discipline across India with financial support and vibrant leadership development programs.",
      eligibilityCriteria: JSON.stringify([
        "Resident Indian citizen enrolled in 1st year of full-time undergraduate degree program",
        "Passed Class 12 with a minimum of 60% marks",
        "Household annual income up to ₹15,00,000 (preference given to < ₹2,50,000)",
        "Must take the mandatory online aptitude test",
      ]),
      benefits: JSON.stringify([
        "Up to ₹2,00,000 granted across the degree duration",
        "Access to alumni mentorship and soft skills enhancement workshops",
        "Internship opportunities within partner institutions",
      ]),
      documentsRequired: JSON.stringify([
        "Class 10 and 12 mark sheets",
        "Bonafide student certificate from current college",
        "Family income certificate or salary slip/ITR",
        "Valid government photo ID",
      ]),
      procedure: JSON.stringify([
        "Complete online application on the official Reliance Foundation portal",
        "Appear for the 60-minute remote online aptitude test",
        "Shortlisted candidates undergo interview and document verification",
      ]),
    },
    {
      slug: "chevening-scholarships-uk",
      name: "Chevening Master's Scholarships (UK)",
      organization: "UK Foreign, Commonwealth & Development Office",
      type: "International",
      educationLevel: "Postgraduate",
      stream: "Any",
      state: "All India",
      country: "United Kingdom",
      amount: 3500000,
      amountFormatted: "Fully Funded (~£30,000 / ₹35 Lakhs)",
      deadline: new Date("2026-11-05"),
      verificationStatus: "Verified Genuine",
      websiteUrl: "https://www.chevening.org",
      applicationUrl: "https://www.chevening.org/apply",
      featured: true,
      description:
        "The UK government's global scholarship programme offering future leaders unique opportunities to study a one-year master's degree at any UK university with full financial funding.",
      eligibilityCriteria: JSON.stringify([
        "Hold an undergraduate degree equivalent to an upper second-class 2:1 honours degree in the UK",
        "Minimum 2 years (2,800 hours) of work experience",
        "Commitment to return to country of citizenship for minimum 2 years post-scholarship",
        "Apply to 3 eligible UK university master courses",
      ]),
      benefits: JSON.stringify([
        "Full university tuition fees paid directly to the institution",
        "Monthly living stipend tailored to UK living expenses",
        "Economy return airfare from home country to the UK",
        "Arrival allowance and visa application fee reimbursement",
      ]),
      documentsRequired: JSON.stringify([
        "Academic transcripts and degree certificate",
        "Two comprehensive professional/academic references",
        "Valid passport",
        "Four detailed Chevening essays (Leadership, Networking, Study in UK, Career Plan)",
      ]),
      procedure: JSON.stringify([
        "Submit online application through Chevening OAS portal by published deadline",
        "Committee evaluates essays and references; shortlisted for in-person British High Commission interview",
        "Secure unconditional offer from an approved UK university",
      ]),
    },
    {
      slug: "tata-trusts-medical",
      name: "Tata Trusts Medical and Healthcare Grant",
      organization: "Tata Trusts",
      type: "Private",
      educationLevel: "Undergraduate",
      stream: "Medical",
      state: "All India",
      country: "India",
      amount: 100000,
      amountFormatted: "Up to ₹1,00,000 / year",
      deadline: new Date("2026-12-10"),
      verificationStatus: "Verified Genuine",
      websiteUrl: "https://www.tatatrusts.org",
      applicationUrl: "https://www.tatatrusts.org/our-work/individual-grants-programme",
      featured: false,
      description:
        "Supports deserving undergraduate and postgraduate medical and allied healthcare students pursuing recognized degrees (MBBS, BDS, B.Sc Nursing) across India.",
      eligibilityCriteria: JSON.stringify([
        "Enrolled in recognized government or municipal medical college",
        "Minimum 65% aggregate in preceding academic examinations",
        "Demonstrated genuine financial hardship",
      ]),
      benefits: JSON.stringify([
        "Direct coverage of tuition fees up to ₹1,00,000 per year",
        "Book grant support for top medical textbooks",
      ]),
      documentsRequired: JSON.stringify([
        "NEET scorecard and rank letter",
        "Current year fee structure signed by Dean/Principal",
        "Income tax return or Tehsildar income certificate",
        "Mark sheets for all completed semesters",
      ]),
      procedure: JSON.stringify([
        "Apply via Tata Trusts Individual Grants online portal",
        "Upload verified fee receipts and recommendation letter from Dean",
      ]),
    },
    {
      slug: "pmsss-jk-ladakh",
      name: "Prime Minister's Special Scholarship Scheme (PMSSS)",
      organization: "AICTE & Ministry of Education",
      type: "Government",
      educationLevel: "Undergraduate",
      stream: "Engineering",
      state: "Jammu & Kashmir",
      country: "India",
      amount: 300000,
      amountFormatted: "Up to ₹3,00,000 / year (Fees + ₹1L Maintenance)",
      deadline: new Date("2026-12-20"),
      verificationStatus: "Verified Genuine",
      websiteUrl: "https://www.aicte-india.org",
      applicationUrl: "https://www.aicte-jk-scholarship-gov.in",
      featured: true,
      description:
        "Empowers youth from Jammu & Kashmir and Ladakh to pursue professional degrees in premier colleges across India with full tuition fee waiver and maintenance stipend.",
      eligibilityCriteria: JSON.stringify([
        "Permanent Domicile certificate of UT of J&K or UT of Ladakh",
        "Passed 10+2 examination from J&K State Board or CBSE affiliated schools in J&K/Ladakh",
        "Family income ceiling of ₹8,00,000 per annum",
        "Admission secured through centralized AICTE counseling only",
      ]),
      benefits: JSON.stringify([
        "Full academic tuition fee directly credited to college account (up to ₹1.25L for Engineering, ₹3L for Medical)",
        "₹1,00,000 annual maintenance allowance in installments directly to student",
      ]),
      documentsRequired: JSON.stringify([
        "Domicile certificate issued by competent authority",
        "Income certificate issued by Tehsildar",
        "Class 10 and 12 mark sheets",
        "Aadhaar Card",
      ]),
      procedure: JSON.stringify([
        "Register on AICTE PMSSS portal after 12th board results",
        "Document verification at designated facilitation centers in J&K/Ladakh",
        "Participate in choice filling and online seat allocation",
      ]),
    },
    {
      slug: "fulbright-nehru-masters",
      name: "Fulbright-Nehru Master's Fellowships (USA)",
      organization: "United States-India Educational Foundation (USIEF)",
      type: "International",
      educationLevel: "Postgraduate",
      stream: "Any",
      state: "All India",
      country: "United States",
      amount: 4500000,
      amountFormatted: "Fully Funded (~$55,000 / ₹45 Lakhs)",
      deadline: new Date("2027-05-15"),
      verificationStatus: "Verified Genuine",
      websiteUrl: "https://www.usief.org.in",
      applicationUrl: "https://www.usief.org.in/Fulbright-Nehru-Fellowships.aspx",
      featured: false,
      description:
        "Prestigious fellowship designed for outstanding individuals with leadership qualities to complete a master's degree at select U.S. colleges and universities.",
      eligibilityCriteria: JSON.stringify([
        "Completed equivalent of US Bachelor's degree with at least 55% marks",
        "At least 3 years of substantial full-time professional work experience",
        "Demonstrated leadership and community service track record",
      ]),
      benefits: JSON.stringify([
        "Full tuition coverage and university mandatory fees",
        "Monthly living stipend and accident & sickness health insurance",
        "J-1 visa sponsorship and round-trip economy air travel",
      ]),
      documentsRequired: JSON.stringify([
        "Official university transcripts and degree diplomas",
        "3 letters of recommendation submitted online",
        "Detailed Study/Research Objective and Personal Statement essays",
      ]),
      procedure: JSON.stringify([
        "Submit online application via Fulbright Embark portal",
        "National screening and interviews in New Delhi",
      ]),
    },
    {
      slug: "hdfc-badhte-kadam",
      name: "HDFC Bank Parivartan's ECSS Programme",
      organization: "HDFC Bank Parivartan",
      type: "Private",
      educationLevel: "Undergraduate",
      stream: "Any",
      state: "All India",
      country: "India",
      amount: 75000,
      amountFormatted: "Up to ₹75,000 / year",
      deadline: new Date("2026-12-31"),
      verificationStatus: "Verified Genuine",
      websiteUrl: "https://www.hdfcbank.com",
      applicationUrl: "https://www.hdfcbank.com/personal/about-us/corporate-social-responsibility",
      featured: false,
      description:
        "Aims to support students from vulnerable backgrounds going through personal or financial crises so they can continue their education without dropping out.",
      eligibilityCriteria: JSON.stringify([
        "Open to Indian nationals enrolled in undergraduate courses (General or Professional)",
        "Students facing financial crisis (loss of earning parent, critical illness, terminal debt)",
        "Annual family income must be ₹2,50,000 or less",
        "Minimum 55% marks in previous year",
      ]),
      benefits: JSON.stringify([
        "One-time scholarship grant up to ₹75,000 towards college tuition fee and books",
      ]),
      documentsRequired: JSON.stringify([
        "Previous year mark sheet",
        "Current year admission proof/fee receipt",
        "Proof of family income or crisis document (death certificate/medical bills)",
        "Applicant bank account details",
      ]),
      procedure: JSON.stringify([
        "Apply through authorized partner portal (Buddy4Study)",
        "Verification by program review panel and phone interview",
      ]),
    },
    {
      slug: "world-merit-award-sample",
      name: "World Merit International Grant (Suspicious Flagged)",
      organization: "World Merit Awards",
      type: "Private",
      educationLevel: "Undergraduate",
      stream: "Any",
      state: "All India",
      country: "India",
      amount: 50000,
      amountFormatted: "₹50,000 Grant (Security Deposit Required)",
      deadline: new Date("2026-11-20"),
      verificationStatus: "Needs Review",
      websiteUrl: "https://worldmerit-awards.com",
      applicationUrl: "https://worldmerit-awards.com",
      featured: false,
      description:
        "Claims to award $1,000 / ₹50,000 grants, but requires applicant to submit a 'refundable security deposit' to claim the funds.",
      eligibilityCriteria: JSON.stringify([
        "High achieving students demonstrating leadership",
        "Submit registration and refundable deposit",
      ]),
      benefits: JSON.stringify([
        "Nominal grant promise subject to upfront fee clearance",
      ]),
      documentsRequired: JSON.stringify([
        "Identity document copy",
        "Fee transaction reference number",
      ]),
      procedure: JSON.stringify([
        "Submit online form and pay fee via payment link",
      ]),
    },
  ];

  for (const s of scholarshipsData) {
    await prisma.scholarship.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  console.log(`Seeded ${scholarshipsData.length} scholarships.`);

  // 3. Save a bookmark for the demo user
  const firstScholarship = await prisma.scholarship.findUnique({
    where: { slug: "nsp-post-matric" },
  });
  if (firstScholarship) {
    await prisma.savedScholarship.upsert({
      where: {
        userId_scholarshipId: {
          userId,
          scholarshipId: firstScholarship.id,
        },
      },
      update: {},
      create: {
        userId,
        scholarshipId: firstScholarship.id,
      },
    });
    console.log("Seeded initial bookmark for demo user.");
  }

  // 4. Seed initial verification record
  await prisma.scholarshipVerification.create({
    data: {
      userId,
      url: "https://scholarships.gov.in",
      orgName: "National Scholarship Portal",
      contactEmail: "helpdesk@nsp.gov.in",
      inputText: "Central and state scholarship schemes for students. Applying is free.",
      score: 5,
      level: "Low",
      summary: "This listing matches verified government domain scholarships.gov.in with no suspicious fee demands.",
      reportData: JSON.stringify({
        score: 5,
        level: "Low",
        trustedDomain: true,
        summary: "Legitimate domain verified under National Scholarship Portal.",
        signals: [],
        positiveIndicators: [
          "Official .gov.in domain authenticated",
          "Zero upfront fees required",
          "Publicly verifiable government portal",
        ],
      }),
    },
  });

  console.log("Seeded sample verification history.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

