/**
 * AI Semantic Analyzer for Scholarship Offers
 * Uses Google Gemini API if GEMINI_API_KEY is configured, with a robust heuristic analyzer fallback.
 */

import type { AiDetailedAnalysis } from "./types";

export interface AiAnalysisOutput {
  aiScoreOffset: number; // additional points or deductions (-20 to +35)
  aiObservations: string[];
  isAiPowered: boolean;
  detailedAnalysis?: AiDetailedAnalysis;
}

export async function analyzeWithAi(
  url: string | undefined,
  text: string | undefined,
  orgName: string | undefined,
  contactEmail: string | undefined
): Promise<AiAnalysisOutput> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // Need an API key and at least some input (URL, text, or orgName)
  if (!apiKey || (!text && !url && !orgName)) {
    return {
      aiScoreOffset: 0,
      aiObservations: [],
      isAiPowered: false,
    };
  }

  try {
    const prompt = `You are a cybersecurity expert specializing in academic scholarship fraud, phishing detection, and student protection.
Analyze this scholarship opportunity:
- Website URL: ${url || "None provided"}
- Claimed Organization: ${orgName || "None provided"}
- Contact Email: ${contactEmail || "None provided"}
- Offer Content / Description:
"""
${(text || "").slice(0, 3000)}
"""

Evaluate this offer rigorously:
1. Organization Legitimacy: Is "${orgName || "the organization"}" a real, recognized company, foundation, university, or government body (e.g. Tata Capital, Reliance, NSP, ONGC, etc.)?
2. Scam Patterns: Any request for upfront payment, application fees, gift cards, or UPI deposits (genuine scholarships NEVER charge fees)?
3. Phishing / Malice: False urgency, guaranteed selection without review, or requests for bank logins/Aadhaar/passwords?

Respond ONLY with a JSON object in this exact schema (no markdown, no backticks):
{
  "riskScore": number between 0 and 100,
  "riskRating": "low" | "medium" | "high" | "critical",
  "isLegitimateOrganization": boolean,
  "verdict": "Clear one-sentence overall verdict for the student",
  "reasoning": "2-3 sentences explaining why this offer is safe, suspicious, or fraudulent",
  "observations": ["Observation 1", "Observation 2"],
  "keyRedFlags": ["Specific red flag if any"],
  "suggestedAction": "Specific recommendation for the student"
}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    // Use Gemini 2.5 Flash with fallback
    const model = "gemini-2.5-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[ScholarCheck AI] Gemini API returned status ${res.status}`);
      return { aiScoreOffset: 0, aiObservations: [], isAiPowered: false };
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return { aiScoreOffset: 0, aiObservations: [], isAiPowered: false };

    // Strip any markdown backticks if returned
    const cleanedText = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleanedText);

    const riskScore = typeof parsed.riskScore === "number"
      ? Math.max(0, Math.min(100, Math.round(parsed.riskScore)))
      : parsed.riskRating === "critical" ? 90 : parsed.riskRating === "high" ? 70 : parsed.riskRating === "medium" ? 40 : 10;

    const obs: string[] = Array.isArray(parsed.observations) ? parsed.observations.slice(0, 4) : [];
    const redFlags: string[] = Array.isArray(parsed.keyRedFlags) ? parsed.keyRedFlags.slice(0, 4) : [];

    const detailedAnalysis: AiDetailedAnalysis = {
      riskScore,
      riskRating: parsed.riskRating || (riskScore > 75 ? "critical" : riskScore > 50 ? "high" : riskScore > 25 ? "medium" : "low"),
      isLegitimateOrganization: Boolean(parsed.isLegitimateOrganization),
      verdict: parsed.verdict || "AI analysis completed.",
      reasoning: parsed.reasoning || "Evaluation based on fraud indicators and linguistic pattern matching.",
      observations: obs,
      keyRedFlags: redFlags,
      suggestedAction: parsed.suggestedAction || undefined,
    };

    return {
      aiScoreOffset: 0,
      aiObservations: obs,
      isAiPowered: true,
      detailedAnalysis,
    };
  } catch (error) {
    console.warn("[ScholarCheck AI] Gemini analysis failed or timed out, using heuristic engine:", error);
    return {
      aiScoreOffset: 0,
      aiObservations: [],
      isAiPowered: false,
    };
  }
}

