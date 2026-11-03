import type { ScholarshipDetail } from "./scholarships";

export interface StudentProfileInput {
  fullName: string;
  educationLevel: string; // e.g. "Undergraduate", "Postgraduate", "School"
  course: string;
  academicYear: string;
  institution: string;
  gpaOrPercentage: number; // e.g. 8.4 (out of 10) or 84 (percentage)
  familyIncome: number; // in INR
  state: string;
  country: string;
  category: string; // "General", "OBC", "SC", "ST", "EWS", "Minority"
}

export interface MatchResult {
  scholarship: ScholarshipDetail;
  matchScore: number; // 0-100
  matchLevel: "High Match" | "Moderate Match" | "Potential Match" | "Low Match";
  reasonsQualified: string[];
  missingOrConditional: string[];
  isEligible: boolean;
}

export function matchScholarship(
  student: StudentProfileInput,
  scholarship: ScholarshipDetail
): MatchResult {
  let score = 50; // Base baseline
  const reasonsQualified: string[] = [];
  const missingOrConditional: string[] = [];

  // Normalize percentage vs CGPA: if <= 10, scale to 100
  const normalizedGrade = student.gpaOrPercentage <= 10 ? student.gpaOrPercentage * 9.5 : student.gpaOrPercentage;

  // 1. Education Level Check
  if (
    scholarship.educationLevel.toLowerCase() === "all" ||
    scholarship.educationLevel.toLowerCase().includes(student.educationLevel.toLowerCase()) ||
    student.educationLevel.toLowerCase().includes(scholarship.educationLevel.toLowerCase())
  ) {
    score += 15;
    reasonsQualified.push(`Your education level (${student.educationLevel}) matches this scholarship's target tier.`);
  } else {
    score -= 20;
    missingOrConditional.push(`Primary focus is ${scholarship.educationLevel}, while your profile indicates ${student.educationLevel}.`);
  }

  // 2. Stream / Course Check
  const streamLower = scholarship.stream.toLowerCase();
  const courseLower = student.course.toLowerCase();

  if (streamLower === "any") {
    score += 10;
    reasonsQualified.push("Open to students from all academic disciplines and courses.");
  } else if (courseLower.includes(streamLower) || (streamLower === "engineering" && (courseLower.includes("b.tech") || courseLower.includes("b.e")))) {
    score += 15;
    reasonsQualified.push(`Your course (${student.course}) directly matches the required ${scholarship.stream} specialization.`);
  } else {
    score -= 10;
    missingOrConditional.push(`This program requires enrollment in a ${scholarship.stream} degree.`);
  }

  // 3. Family Income Evaluation
  const critText = scholarship.eligibilityCriteria.join(" ").toLowerCase();
  if (critText.includes("2,50,000") || critText.includes("2.5 lakh") || critText.includes("250000")) {
    if (student.familyIncome <= 250000) {
      score += 15;
      reasonsQualified.push(`Your family income (₹${student.familyIncome.toLocaleString("en-IN")}) is within the ₹2.5 LPA ceiling.`);
    } else {
      score -= 25;
      missingOrConditional.push(`Income threshold is typically capped at ₹2.5 Lakhs/year; your stated income is ₹${student.familyIncome.toLocaleString("en-IN")}.`);
    }
  } else if (critText.includes("4,50,000") || critText.includes("4.5 lakh") || critText.includes("450000")) {
    if (student.familyIncome <= 450000) {
      score += 15;
      reasonsQualified.push(`Your family income is well within the ₹4.5 LPA threshold.`);
    } else {
      score -= 20;
      missingOrConditional.push("Family income exceeds the standard ₹4.5 LPA limit.");
    }
  } else if (critText.includes("8,00,000") || critText.includes("8 lakh") || critText.includes("800000")) {
    if (student.familyIncome <= 800000) {
      score += 10;
      reasonsQualified.push("Meets the ₹8.0 LPA annual income eligibility ceiling.");
    }
  } else {
    reasonsQualified.push("No restrictive family income ceiling specified for this merit award.");
  }

  // 4. Academic Performance / Percentage
  if (critText.includes("50%")) {
    if (normalizedGrade >= 50) {
      score += 10;
      reasonsQualified.push(`Your score (~${Math.round(normalizedGrade)}%) satisfies the minimum 50% cutoff.`);
    } else {
      score -= 20;
      missingOrConditional.push("Minimum academic cutoff is 50% in preceding examination.");
    }
  } else if (critText.includes("60%") || critText.includes("65%")) {
    if (normalizedGrade >= 60) {
      score += 10;
      reasonsQualified.push(`Your academic score (~${Math.round(normalizedGrade)}%) meets the merit benchmark.`);
    } else {
      score -= 15;
      missingOrConditional.push("Requires a minimum 60%–65% aggregate score.");
    }
  }

  // 5. State / Domicile Criteria
  const stateLower = scholarship.state.toLowerCase();
  if (stateLower === "all india" || stateLower === "all") {
    score += 5;
    reasonsQualified.push("Open to eligible students across all states and union territories in India.");
  } else if (stateLower.includes(student.state.toLowerCase()) || student.state.toLowerCase().includes(stateLower)) {
    score += 15;
    reasonsQualified.push(`Your domicile state (${student.state}) fulfills the territorial requirement.`);
  } else {
    score -= 30;
    missingOrConditional.push(`Restricted to permanent residents / domiciles of ${scholarship.state}.`);
  }

  // 6. Category Requirements (e.g. Minorities, OBC, SC/ST)
  if (critText.includes("minority")) {
    if (student.category.toLowerCase() === "minority") {
      score += 15;
      reasonsQualified.push("Meets minority community requirement.");
    } else {
      score -= 25;
      missingOrConditional.push("Scheme is designated specifically for notified religious minority communities.");
    }
  }

  // Work experience caveat for international fellowships
  if (critText.includes("work experience") || critText.includes("2 years")) {
    missingOrConditional.push("Requires minimum 2–3 years of professional work experience and academic references.");
  }

  const finalScore = Math.min(98, Math.max(15, score));

  let matchLevel: MatchResult["matchLevel"] = "Low Match";
  if (finalScore >= 80) matchLevel = "High Match";
  else if (finalScore >= 65) matchLevel = "Moderate Match";
  else if (finalScore >= 45) matchLevel = "Potential Match";

  return {
    scholarship,
    matchScore: finalScore,
    matchLevel,
    reasonsQualified,
    missingOrConditional,
    isEligible: finalScore >= 60,
  };
}

export function matchAllScholarships(
  student: StudentProfileInput,
  scholarships: ScholarshipDetail[]
): MatchResult[] {
  return scholarships
    .map((s) => matchScholarship(student, s))
    .sort((a, b) => b.matchScore - a.matchScore);
}

