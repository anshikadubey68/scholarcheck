import { describe, expect, it } from "vitest";
import { analyze } from "./index";
import { levenshtein } from "./signals";
import { validateSafeUrl } from "./urlValidator";

describe("detector", () => {
  it("computes edit distance", () => expect(levenshtein("kitten", "sitting")).toBe(3));

  it("trusts a verified domain", () => {
    const r = analyze({ url: "https://www.chevening.org/scholarships" });
    expect(r.trustedDomain).toBe(true);
    expect(r.level).toBe("safe");
    expect(r.riskCategory).toBe("Low");
    expect(r.positiveIndicators.length).toBeGreaterThan(0);
  });

  it("flags lookalike domains", () => {
    const r = analyze({ url: "http://chevenlng.org" });
    expect(r.signals.some((s) => s.id === "lookalike-domain")).toBe(true);
  });

  it("flags a classic scam message as high risk and critical", () => {
    const r = analyze({
      url: "http://free-grant-claim.xyz",
      orgName: "Global Youth Foundation",
      contactEmail: "apply.global@gmail.com",
      text: "Congratulations! You have been selected. Pay a small processing fee via Western Union. Only 3 slots left! 100% guaranteed. Send your passport number.",
    });
    expect(r.level).toBe("high-risk");
    expect(r.riskCategory).toBe("Critical");
    expect(r.score).toBe(100);
    expect(r.recommendedActions.length).toBeGreaterThan(0);
  });

  it("protects against SSRF on private IPs and localhost", () => {
    const check1 = validateSafeUrl("http://localhost:3000");
    expect(check1.isSsrfSafe).toBe(false);

    const check2 = validateSafeUrl("http://192.168.1.1/apply");
    expect(check2.isSsrfSafe).toBe(false);

    const check3 = validateSafeUrl("http://169.254.169.254/latest/meta-data");
    expect(check3.isSsrfSafe).toBe(false);
  });

  it("detects subdomain spoofing attempts", () => {
    const check = validateSafeUrl("https://scholarships.gov.in.fraudulent-portal.xyz", ["scholarships.gov.in"]);
    expect(check.hasSubdomainSpoofing).toBe(true);
    expect(check.spoofedDomain).toBe("scholarships.gov.in");
  });
});
