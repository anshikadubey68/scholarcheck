export type Severity = "low" | "medium" | "high" | "critical";
export type Category = "domain" | "payment" | "organization" | "copied" | "language" | "eligibility";
export type RiskCategory = "Low" | "Medium" | "High" | "Critical";

export interface Signal {
  id: string;
  category: Category;
  severity: Severity;
  weight: number; // points added to the 0-100 risk score
  evidence: string; // human-readable "why", shown in the UI
}

export interface AnalysisInput {
  url?: string;
  text?: string;
  orgName?: string;
  contactEmail?: string;
}

export interface AnalysisResult {
  score: number; // 0-100
  level: "safe" | "suspicious" | "high-risk"; // Legacy 3-tier compatibility
  riskCategory: RiskCategory; // Upgraded 4-tier category (Low, Medium, High, Critical)
  summary: string;
  signals: Signal[];
  trustedDomain: boolean;
  positiveIndicators: string[];
  unverifiedFactors: string[];
  recommendedActions: string[];
  timestamp: string;
  referenceId: string;
  isAiPowered?: boolean;
  domainDetails?: {
    host?: string;
    protocol?: string;
    isHttps?: boolean;
    isOfficialGovOrEdu?: boolean;
  };
}

export interface VerifiedOrg {
  name: string;
  domains: string[];
}

export interface LegitDoc {
  title: string;
  text: string;
}
