import type { AnalysisInput, AnalysisResult, LegitDoc, VerifiedOrg } from "./types";
import {
  analyzeDomain,
  analyzePayment,
  analyzeOrganization,
  analyzeCopied,
  analyzeLanguage,
} from "./signals";
import verifiedOrgsData from "../../data/verified-orgs.json";
import legitDocsData from "../../data/legit-descriptions.json";

const verifiedOrgs: VerifiedOrg[] = verifiedOrgsData as VerifiedOrg[];
const legitDocs: LegitDoc[] = legitDocsData as LegitDoc[];

export function analyze(input: AnalysisInput): AnalysisResult {
  const { signals: domainSignals, trusted: trustedDomain } = analyzeDomain(input.url, verifiedOrgs);
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

  const score = Math.min(100, signals.reduce((sum, s) => sum + s.weight, 0));
  const level: AnalysisResult["level"] =
    score <= 25 ? "safe" : score <= 55 ? "suspicious" : "high-risk";

  return {
    score,
    level,
    signals,
    trustedDomain,
  };
}

export * from "./types";
export * from "./signals";

