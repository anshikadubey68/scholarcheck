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

Evaluate this offer rigorously for:
1. Deceptive / lookalike domains, throwaway TLDs, or missing SSL
2. Any request for upfront payment, processing fees, application fees, gift cards, or UPI transfers (real scholarships are 100% free)
3. False urgency ("Only 2 spots left!", "Apply in 24 hours") or guaranteed acceptance without merit review
4. Requests for sensitive identity data (passwords, bank logins, Aadhaar/SSN without official portal)
5. Free email addresses (e.g. gmail.com, yahoo.com) used for official government or institutional programs

Respond ONLY with a JSON object in this exact schema (no markdown formatting, no code blocks):
{
  "riskRating": "low" | "medium" | "high" | "critical",
  "pointsAdjustment": number between -20 and 35,
  "verdict": "Clear one-sentence overall verdict for the student",
  "reasoning": "2-3 sentences explaining exactly why this offer is safe, suspicious, or dangerous",
  "observations": ["Observation 1", "Observation 2", "Observation 3"],
  "keyRedFlags": ["Red flag 1 if any", "Red flag 2 if any"],
  "suggestedAction": "Specific direct recommendation for the student"
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

    const offset = typeof parsed.pointsAdjustment === "number"
      ? Math.max(-20, Math.min(35, parsed.pointsAdjustment))
      : 0;

    const obs: string[] = Array.isArray(parsed.observations) ? parsed.observations.slice(0, 4) : [];
    const redFlags: string[] = Array.isArray(parsed.keyRedFlags) ? parsed.keyRedFlags.slice(0, 4) : [];

    const detailedAnalysis: AiDetailedAnalysis = {
      riskRating: parsed.riskRating || (offset > 15 ? "high" : offset > 5 ? "medium" : "low"),
      verdict: parsed.verdict || "AI analysis completed.",
      reasoning: parsed.reasoning || "Evaluation based on fraud indicators and linguistic pattern matching.",
      observations: obs,
      keyRedFlags: redFlags,
      suggestedAction: parsed.suggestedAction || undefined,
    };

    return {
      aiScoreOffset: offset,
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

