import { NextResponse } from "next/server";
import { analyzeAsync } from "../../../lib/detector";
import { getCurrentUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { checkRateLimit } from "../../../lib/rateLimit";

export async function POST(req: Request) {
  // 1. Rate limiting by IP or header
  const forwarded = req.headers.get("x-forwarded-for");
  const clientIp = forwarded ? forwarded.split(",")[0].trim() : "anonymous-client";
  const rateLimit = checkRateLimit(clientIp, 40, 60000);

  if (!rateLimit.isAllowed) {
    return NextResponse.json(
      { error: "Too many verification requests. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  // 2. Validate input
  const body = await req.json().catch(() => null);
  if (!body || (!body.url && !body.text)) {
    return NextResponse.json({ error: "Please provide a website URL or offer description to analyze." }, { status: 400 });
  }

  const { url, text, orgName, contactEmail } = body;

  try {
    // 3. Perform analysis
    const result = await analyzeAsync({ url, text, orgName, contactEmail });

    // 4. Optionally associate with authenticated student user
    const user = await getCurrentUser();
    if (user?.userId) {
      try {
        await prisma.scholarshipVerification.create({
          data: {
            userId: user.userId,
            url: url || null,
            orgName: orgName || null,
            contactEmail: contactEmail || null,
            inputText: text ? text.slice(0, 1000) : null,
            score: result.score,
            level: result.riskCategory,
            summary: result.summary,
            reportData: JSON.stringify(result),
          },
        });
      } catch (err) {
        console.error("Failed to persist verification history:", err);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis failed:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while analyzing the scholarship. Please try again." },
      { status: 500 }
    );
  }
}
