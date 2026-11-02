export type Severity = "low" | "medium" | "high";
export type Category = "domain" | "payment" | "organization" | "copied" | "language";

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
  level: "safe" | "suspicious" | "high-risk";
  signals: Signal[];
  trustedDomain: boolean;
}

export interface VerifiedOrg {
  name: string;
  domains: string[];
}

export interface LegitDoc {
  title: string;
  text: string;
}