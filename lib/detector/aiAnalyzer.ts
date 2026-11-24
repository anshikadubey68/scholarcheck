/**
 * AI Semantic Analyzer for Scholarship Offers
 * Uses Google Gemini API if GEMINI_API_KEY is configured, with a robust heuristic analyzer fallback.
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
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If no API key or text is too short for semantic evaluation, gracefully fallback
  if (!apiKey || !text || text.length < 30) {
    return {
      aiScoreOffset: 0,
      aiObservations: [],
      isAiPowered: false,
    };
  }

  // Use current Gemini Flash models. GEMINI_MODEL can override the primary model
  // without exposing the API key to the client.
  const primaryModel = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
  const fallbackModel = "gemini-3.5-flash-lite";

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

    const callGemini = async (modelName: string): Promise<Response | null> => {
      const controller = new AbortController();
      // Each model gets its own time budget. This gives the fallback a chance
      // to run if the primary model is temporarily busy.
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        return await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );
      } catch (error) {
        const reason = error instanceof Error && error.name === "AbortError" ? "timed out" : "network error";
        console.warn(`Gemini request for ${modelName} failed: ${reason}`);
        return null;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    let usedModel = primaryModel;
    let res = await callGemini(primaryModel);
    const shouldTryFallback =
      !res || [404, 429, 500, 502, 503, 504].includes(res.status);

    if (shouldTryFallback && primaryModel !== fallbackModel) {
      if (res) {
        console.warn(`Gemini model ${primaryModel} returned HTTP ${res.status}; trying ${fallbackModel}.`);
      }
      usedModel = fallbackModel;
      res = await callGemini(fallbackModel);
    }

    if (!res?.ok) {
      console.warn(
        `Gemini analysis unavailable after ${usedModel}: ${res ? `HTTP ${res.status}` : "no response"}.`
      );
      return { aiScoreOffset: 0, aiObservations: [], isAiPowered: false };
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      console.warn(`Gemini model ${usedModel} returned no generated text.`);
      return { aiScoreOffset: 0, aiObservations: [], isAiPowered: false };
    }

    // Sanitize any accidental markdown code fences
    const cleanJson = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed: { pointsAdjustment?: unknown; observations?: unknown };
    try {
      parsed = JSON.parse(cleanJson);
    } catch {
      console.warn(`Gemini model ${usedModel} returned invalid JSON.`);
      return { aiScoreOffset: 0, aiObservations: [], isAiPowered: false };
    }
    const offset =
      typeof parsed.pointsAdjustment === "number"
        ? Math.max(-15, Math.min(30, parsed.pointsAdjustment))
        : 0;
    const obs = Array.isArray(parsed.observations)
      ? parsed.observations.filter((o: unknown): o is string => typeof o === "string").slice(0, 3)
      : [];

    return {
      aiScoreOffset: offset,
      aiObservations: obs,
      isAiPowered: true,
    };
  } catch {
    // Graceful fallback to heuristic rules on timeout, network error, or invalid JSON
    return {
      aiScoreOffset: 0,
      aiObservations: [],
      isAiPowered: false,
    };
  }
}

