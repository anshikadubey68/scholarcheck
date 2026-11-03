/**
 * SSRF and Malicious Domain Validator
 * Safeguards against SSRF attacks and identifies deceptive domain patterns.
 */

const PRIVATE_IP_RANGES = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^169\.254\./, // AWS / cloud metadata
  /^0\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
];

export interface SafeUrlCheckResult {
  isValid: boolean;
  isSsrfSafe: boolean;
  host: string;
  protocol: string;
  error?: string;
  hasSubdomainSpoofing?: boolean;
  spoofedDomain?: string;
}

export function validateSafeUrl(rawUrl: string, knownDomains: string[] = []): SafeUrlCheckResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isValid: false, isSsrfSafe: false, host: "", protocol: "", error: "Missing URL string." };
  }

  const clean = rawUrl.trim();
  let parsed: URL;
  try {
    parsed = new URL(/^https?:\/\//i.test(clean) ? clean : `https://${clean}`);
  } catch {
    return { isValid: false, isSsrfSafe: false, host: "", protocol: "", error: "Invalid URL syntax." };
  }

  // Enforce HTTP / HTTPS only (prevent file://, javascript://, gopher://, etc.)
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { isValid: false, isSsrfSafe: false, host: "", protocol: parsed.protocol, error: "Only HTTP/HTTPS protocols are permitted." };
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

  // Check localhost & internal names
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".corp") ||
    host.endsWith(".home")
  ) {
    return { isValid: false, isSsrfSafe: false, host, protocol: parsed.protocol, error: "Local/internal network addresses cannot be analyzed." };
  }

  // Check private IP ranges
  for (const range of PRIVATE_IP_RANGES) {
    if (range.test(host)) {
      return { isValid: false, isSsrfSafe: false, host, protocol: parsed.protocol, error: "Private or internal IP addresses cannot be analyzed." };
    }
  }

  // Check for deceptive subdomain spoofing (e.g. "scholarships.gov.in.fraud-site.com")
  let hasSubdomainSpoofing = false;
  let spoofedDomain = "";

  for (const kd of knownDomains) {
    const target = kd.toLowerCase();
    // If the hostname contains a trusted domain followed by a dot, but does NOT end with it
    if (host.includes(target) && !host.endsWith(target) && !host.endsWith(`.${target}`)) {
      hasSubdomainSpoofing = true;
      spoofedDomain = target;
      break;
    }
  }

  return {
    isValid: true,
    isSsrfSafe: true,
    host,
    protocol: parsed.protocol,
    hasSubdomainSpoofing,
    spoofedDomain,
  };
}

