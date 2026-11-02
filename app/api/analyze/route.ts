import { NextResponse } from "next/server";
import { analyze } from "../../../lib/detector";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || (!body.url && !body.text)) {
    return NextResponse.json({ error: "Provide a url or text to analyze." }, { status: 400 });
  }
  const { url, text, orgName, contactEmail } = body;
  return NextResponse.json(analyze({ url, text, orgName, contactEmail }));
}