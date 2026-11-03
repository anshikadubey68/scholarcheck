/**
 * AI Semantic Analyzer for Scholarship Offers
 * Uses Gemini API if GEMINI_API_KEY is configured, with a robust heuristic analyzer fallback.
 */

export interface AiAnalysisOutput {
  aiScoreOffset: number; // additional points or deductions
  aiObservations: string[];
  isAiPowered: boolean;
}

export async function analyzeWithAi(
  url: string | undefined,
  text: string | undefined,
  orgName: string | undefined,
  contactEmail: string | undefined
): Promise<AiAnalysisOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !text || text.length < 30) {
    return {
      aiScoreOffset: 0,
      aiObservations: [],
      isAiPowered: false,
    };
  }

  try {
    const prompt = `You are a cybersecurity expert specializing in scholarship fraud.
Evaluate the following scholarship offer:
- URL: ${url ?? "None provided"}
- Claimed Organization: ${orgName ?? "None provided"}
- Contact Email: ${contactEmail ?? "None provided"}
- Content/Offer text: """${text.slice(0, 2000)}"""

Respond ONLY with a JSON object in this format (no markdown, no backticks):
{
  "riskRating": "low" | "medium" | "high" | "critical",
  "pointsAdjustment": number between -15 and 30,
  "observations": ["Concise observation 1", "Concise observation 2"]
}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      return { aiScoreOffset: 0, aiObservations: [], isAiPowered: false };
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return { aiScoreOffset: 0, aiObservations: [], isAiPowered: false };

    const parsed = JSON.parse(rawText);
    const offset = typeof parsed.pointsAdjustment === "number" ? Math.max(-15, Math.min(30, parsed.pointsAdjustment)) : 0;
    const obs = Array.isArray(parsed.observations) ? parsed.observations.slice(0, 3) : [];

    return {
      aiScoreOffset: offset,
      aiObservations: obs,
      isAiPowered: true,
    };
  } catch {
    // Graceful fallback to heuristic rules
    return {
      aiScoreOffset: 0,
      aiObservations: [],
      isAiPowered: false,
    };
  }
}

