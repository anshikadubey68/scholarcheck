import { describe, expect, it } from "vitest";
import { analyze } from "./index";
import { levenshtein } from "./signals";

describe("detector", () => {
  it("computes edit distance", () => expect(levenshtein("kitten", "sitting")).toBe(3));

  it("trusts a verified domain", () => {
    const r = analyze({ url: "https://www.chevening.org/scholarships" });
    expect(r.trustedDomain).toBe(true);
    expect(r.level).toBe("safe");
  });

  it("flags lookalike domains", () => {
    const r = analyze({ url: "http://chevenlng.org" });
    expect(r.signals.some((s) => s.id === "lookalike-domain")).toBe(true);
  });

  it("flags a classic scam message as high risk", () => {
    const r = analyze({
      url: "http://free-grant-claim.xyz",
      orgName: "Global Youth Foundation",
      contactEmail: "apply.global@gmail.com",
      text: "Congratulations! You have been selected. Pay a small processing fee via Western Union. Only 3 slots left! 100% guaranteed. Send your passport number.",
    });
    expect(r.level).toBe("high-risk");
    expect(r.score).toBe(100);
  });
});