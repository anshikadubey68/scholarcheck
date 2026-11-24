import { NextResponse } from "next/server";
import { findLiveScholarshipsWithAi, type StudentProfileParams } from "../../../../lib/aiScholarshipFinder";
import { checkRateLimit } from "../../../../lib/rateLimit";

export async function POST(req: Request) {
  // 1. Basic IP rate limiting
  const forwarded = req.headers.get("x-forwarded-for");
  const clientIp = forwarded ? forwarded.split(",")[0].trim() : "anonymous-client";
  const rateLimit = checkRateLimit(`ai-finder:${clientIp}`, 30, 60000);

  if (!rateLimit.isAllowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before discovering more scholarships." },
      { status: 429 }
    );
  }

  try {
    const body: StudentProfileParams = await req.json().catch(() => ({}));
    const result = await findLiveScholarshipsWithAi(body);

    return NextResponse.json({
      success: true,
      count: result.scholarships.length,
      scholarships: result.scholarships,
      isAiPowered: result.isAiPowered,
      source: result.source,
    });
  } catch (error) {
    console.error("[AI Finder API] Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to discover scholarships with AI. Please try again." },
      { status: 500 }
    );
  }
}
