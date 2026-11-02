import type { AnalysisInput, LegitDoc, Severity, Signal, Category, VerifiedOrg } from "./types";

const sig = (
  id: string, category: Category, severity: Severity, weight: number, evidence: string
): Signal => ({ id, category, severity, weight, evidence });

// ---------- helpers ----------
export function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return dp[a.length][b.length];
}

function parseUrl(raw: string): URL | null {
  try { return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`); }
  catch { return null; }
}

// Simplification: "thegatesscholarship.org" -> "thegatesscholarship"
const brandLabel = (host: string) => {
  const parts = host.split(".");
  return parts.length < 2 ? host : parts[parts.length - 2];
};

// ---------- 1. domain ----------
const ODD_TLDS = ["xyz", "top", "click", "work", "loan", "info", "buzz", "gq", "tk", "ml", "cf"];

export function analyzeDomain(url: string | undefined, orgs: VerifiedOrg[]) {
  const signals: Signal[] = [];
  if (!url) return { signals, trusted: false };

  const parsed = parseUrl(url);
  if (!parsed) {
    return { signals: [sig("invalid-url", "domain", "medium", 15, "The URL could not be parsed.")], trusted: false };
  }

  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  const trusted = orgs.some((o) => o.domains.some((d) => host === d || host.endsWith(`.${d}`)));
  if (trusted) return { signals, trusted: true };

  const mine = brandLabel(host);
  for (const org of orgs) {
    for (const d of org.domains) {
      const brand = brandLabel(d);
      if (brand.length < 5 || mine === brand) continue;
      if (levenshtein(mine, brand) <= 2) {
        signals.push(sig("lookalike-domain", "domain", "high", 35, `"${host}" is almost identical to ${org.name}'s real domain (${d}).`));
        break;
      }
      if (mine.includes(brand)) {
        signals.push(sig("brand-in-domain", "domain", "high", 30, `"${host}" uses the name "${brand}" but is not ${org.name}'s domain (${d}).`));
        break;
      }
    }
    if (signals.length) break;
  }

  if (parsed.protocol !== "https:") signals.push(sig("no-https", "domain", "medium", 10, "The site does not use HTTPS."));
  const tld = host.split(".").pop() ?? "";
  if (ODD_TLDS.includes(tld)) signals.push(sig("odd-tld", "domain", "medium", 15, `The ".${tld}" extension is common on throwaway scam sites.`));
  if ((host.match(/-/g) ?? []).length >= 2) signals.push(sig("many-hyphens", "domain", "low", 8, "The domain contains several hyphens."));
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) signals.push(sig("ip-host", "domain", "high", 30, "The site uses a raw IP address instead of a domain name."));
  if (/(free|grant|claim|winner|official|bonus)/.test(mine))
    signals.push(sig("bait-words", "domain", "low", 8, "The domain contains bait words such as free, claim or winner."));

  return { signals, trusted: false };
}

// ---------- 2. payment demands ----------
const PAYMENT: [RegExp, string][] = [
  [/(application|processing|registration|admin(istration)?|handling|release)\s+fee/i, "asks for an upfront fee"],
  [/(pay|send|deposit)\s+(a\s+)?(small\s+)?(fee|amount|money)/i, "asks the applicant to pay money"],
  [/western\s+union|moneygram|wire\s+transfer|gift\s+cards?|bitcoin|crypto(currency)?/i, "requests an untraceable payment method"],
  [/upi\s*(id|payment)|paytm|phonepe|google\s*pay/i, "asks for a personal UPI or wallet payment"],
  [/refundable\s+(deposit|fee)|security\s+deposit/i, "asks for a refundable deposit"],
];

export function analyzePayment(text?: string): Signal[] {
  if (!text) return [];
  return PAYMENT.flatMap(([re, label], i) => {
    const m = text.match(re);
    return m ? [sig(`payment-${i}`, "payment", "high", 30, `Text ${label}: "${m[0]}".`)] : [];
  });
}

// ---------- 3. fake organizations ----------
const FREE_MAIL = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com", "proton.me"];

export function analyzeOrganization(input: AnalysisInput, orgs: VerifiedOrg[]): Signal[] {
  const signals: Signal[] = [];
  const name = input.orgName?.trim().toLowerCase();
  if (name) {
    const known = orgs.some((o) => name.includes(o.name.toLowerCase()) || o.name.toLowerCase().includes(name));
    if (!known) signals.push(sig("unverified-org", "organization", "medium", 15, `"${input.orgName}" is not in our verified provider list.`));
  }
  const mailDomain = input.contactEmail?.split("@")[1]?.toLowerCase();
  if (mailDomain && FREE_MAIL.includes(mailDomain))
    signals.push(sig("free-email", "organization", "medium", 15, `Contact email uses a free provider (${mailDomain}), not an organization domain.`));
  if (input.text && input.text.length > 200 && !/\b(address|street|road|avenue|floor|suite|pin\s*code|zip)\b/i.test(input.text))
    signals.push(sig("no-address", "organization", "low", 8, "No physical address is mentioned."));
  return signals;
}

// ---------- 4. copied content ----------
const words = (t: string) => t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
const shingles = (t: string, n = 3) => {
  const w = words(t), out = new Set<string>();
  for (let i = 0; i <= w.length - n; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
};

export function analyzeCopied(text: string | undefined, docs: LegitDoc[], trusted: boolean): Signal[] {
  if (!text || trusted) return [];
  const mine = shingles(text);
  let best = { title: "", score: 0 };
  for (const d of docs) {
    const theirs = shingles(d.text);
    if (!theirs.size) continue;
    let hit = 0;
    theirs.forEach((s) => { if (mine.has(s)) hit++; });
    const containment = hit / theirs.size; // how much of the real text appears here
    if (containment > best.score) best = { title: d.title, score: containment };
  }
  return best.score >= 0.4
    ? [sig("copied-content", "copied", "high", 30, `${Math.round(best.score * 100)}% of the genuine "${best.title}" description appears here, on an unverified site.`)]
    : [];
}

// ---------- 5. suspicious language ----------
const LANGUAGE: [RegExp, string, Severity, number][] = [
  [/(only|just)\s+\d+\s+(slots?|seats?|spots?)\s+left|act\s+now|last\s+chance|within\s+24\s+hours|hurry/i, "creates false urgency", "medium", 15],
  [/100%\s+(guaranteed|success)|guaranteed\s+(win|selection|scholarship)|no\s+(essay|exam|interview)\s+required/i, "guarantees an outcome", "high", 25],
  [/(ssn|social\s+security|aadhaar|passport\s+number|bank\s+(account|login|password)|card\s+(number|pin|cvv)|otp)/i, "asks for sensitive personal data", "high", 30],
  [/congratulations.{0,40}(selected|won|winner)|you\s+(have\s+been|are)\s+(selected|chosen)/i, "claims you were selected without applying", "high", 25],
];

export function analyzeLanguage(text?: string): Signal[] {
  if (!text) return [];
  const signals = LANGUAGE.flatMap(([re, label, sev, w], i) => {
    const m = text.match(re);
    return m ? [sig(`lang-${i}`, "language", sev, w, `Text ${label}: "${m[0]}".`)] : [];
  });
  const letters = text.replace(/[^A-Za-z]/g, "");
  const caps = letters.length > 40 ? (text.match(/[A-Z]/g) ?? []).length / letters.length : 0;
  if (caps > 0.4 || (text.match(/!/g) ?? []).length >= 4)
    signals.push(sig("lang-shouting", "language", "low", 8, "Excessive capital letters or exclamation marks."));
  return signals;
}