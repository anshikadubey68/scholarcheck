import type { AnalysisInput, AnalysisResult, LegitDoc, VerifiedOrg, RiskCategory } from "./types";
import {
  analyzeDomain,
  analyzePayment,
  analyzeOrganization,
  analyzeCopied,
  analyzeLanguage,
  extractPositiveIndicators,
  extractUnverifiedFactors,
  generateRecommendations,
} from "./signals";
import { analyzeWithAi } from "./aiAnalyzer";
import verifiedOrgsData from "../../data/verified-orgs.json";
import legitDocsData from "../../data/legit-descriptions.json";

const verifiedOrgs: VerifiedOrg[] = verifiedOrgsData as VerifiedOrg[];
const legitDocs: LegitDoc[] = legitDocsData as LegitDoc[];

function generateReferenceId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "SC-";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function buildVerificationSummary(
  score: number,
  riskCategory: RiskCategory,
  trustedDomain: boolean
): string {
  if (riskCategory === "Critical") {
    return "CRITICAL FRAUD RISK DETECTED. This scholarship offer displays definitive characteristics of fraudulent activity, such as upfront payment demands, lookalike domain spoofing, or attempts to harvest sensitive personal credentials. Do NOT send money or submit identity documents.";
  }
  if (riskCategory === "High") {
    return "HIGH RISK DETECTED. Multiple serious warning flags were identified in this offer, including potential fee requests, unverified domain origins, or deceptive urgency language. Extreme caution is strongly advised.";
  }
  if (riskCategory === "Medium") {
    return "MODERATE / SUSPICIOUS INDICATORS IDENTIFIED. While not conclusively proven fraudulent, several suspicious patterns (such as an unverified provider or free email contact) warrant independent verification before you proceed.";
  }
  if (trustedDomain) {
    return "OFFICIAL PROVIDER VERIFIED. The website address matches an accredited, authenticated scholarship agency in our verified directory. Review official deadlines and eligibility requirements on the provider portal.";
  }
  return "LOW RISK SCORE. No immediate critical warning signs were found. Note: A low risk score is not an absolute legal guarantee of legitimacy. Always cross-verify application criteria through official school or portal channels.";
}

export function analyze(input: AnalysisInput): AnalysisResult {
  const { signals: domainSignals, trusted: trustedDomain, isOfficialGovOrEdu } = analyzeDomain(input.url, verifiedOrgs);
  const paymentSignals = analyzePayment(input.text);
  const orgSignals = analyzeOrganization(input, verifiedOrgs);
  const copiedSignals = analyzeCopied(input.text, legitDocs, trustedDomain);
  const langSignals = analyzeLanguage(input.text);

  const signals = [
    ...domainSignals,
    ...paymentSignals,
    ...orgSignals,
    ...copiedSignals,
    ...langSignals,
  ];

  const rawScore = signals.reduce((sum, s) => sum + s.weight, 0);
  const score = Math.min(100, Math.max(0, rawScore));

  // Determine Legacy 3-tier and Upgraded 4-tier
  const level: AnalysisResult["level"] =
    score <= 25 ? "safe" : score <= 55 ? "suspicious" : "high-risk";

  const riskCategory: RiskCategory =
    score <= 25 ? "Low" : score <= 55 ? "Medium" : score <= 80 ? "High" : "Critical";

  const positiveIndicators = extractPositiveIndicators(input, trustedDomain, isOfficialGovOrEdu, paymentSignals);
  const unverifiedFactors = extractUnverifiedFactors(input, trustedDomain);
  const recommendedActions = generateRecommendations(score);
  const summary = buildVerificationSummary(score, riskCategory, trustedDomain);

  return {
    score,
    level,
    riskCategory,
    summary,
    signals,
    trustedDomain,
    positiveIndicators,
    unverifiedFactors,
    recommendedActions,
    timestamp: new Date().toISOString(),
    referenceId: generateReferenceId(),
    isAiPowered: false,
    domainDetails: {
      host: input.url ? new URL(/^https?:\/\//i.test(input.url) ? input.url : `https://${input.url}`).hostname : undefined,
      isHttps: input.url ? input.url.toLowerCase().startsWith("https://") : undefined,
      isOfficialGovOrEdu,
    },
  };
}

export async function analyzeAsync(input: AnalysisInput): Promise<AnalysisResult> {
  const baseResult = analyze(input);

  // If Gemini API is available, enrich with AI observations
  if (process.env.GEMINI_API_KEY && input.text) {
    const aiOutput = await analyzeWithAi(input.url, input.text, input.orgName, input.contactEmail);
    if (aiOutput.isAiPowered) {
      const adjustedScore = Math.min(100, Math.max(0, baseResult.score + aiOutput.aiScoreOffset));
      const riskCategory: RiskCategory =
        adjustedScore <= 25 ? "Low" : adjustedScore <= 55 ? "Medium" : adjustedScore <= 80 ? "High" : "Critical";
      const level: AnalysisResult["level"] =
        adjustedScore <= 25 ? "safe" : adjustedScore <= 55 ? "suspicious" : "high-risk";

      return {
        ...baseResult,
        score: adjustedScore,
        riskCategory,
        level,
        isAiPowered: true,
        unverifiedFactors: [
          ...baseResult.unverifiedFactors,
          ...aiOutput.aiObservations.map((obs) => `AI Observation: ${obs}`),
        ],
      };
    }
  }

  return baseResult;
}

export * from "./types";
export * from "./signals";
export * from "./urlValidator";
export * from "./aiAnalyzer";
