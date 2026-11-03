import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ bookmarks: [] });
  }

  try {
    const list = await prisma.savedScholarship.findMany({
      where: { userId: user.userId },
      select: { scholarshipId: true },
    });
    return NextResponse.json({ bookmarks: list.map((b) => b.scholarshipId) });
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
    return NextResponse.json({ bookmarks: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in to save scholarships." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const scholarshipId = body?.scholarshipId;

  if (!scholarshipId) {
    return NextResponse.json({ error: "Missing scholarshipId parameter." }, { status: 400 });
  }

  try {
    const record = await prisma.savedScholarship.upsert({
      where: {
        userId_scholarshipId: {
          userId: user.userId,
          scholarshipId,
        },
      },
      update: {},
      create: {
        userId: user.userId,
        scholarshipId,
      },
    });

    return NextResponse.json({ success: true, bookmark: record });
  } catch (error) {
    console.error("Failed to save bookmark:", error);
    return NextResponse.json({ error: "Failed to bookmark scholarship." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  const url = new URL(req.url);
  let scholarshipId = url.searchParams.get("scholarshipId");

  if (!scholarshipId) {
    const body = await req.json().catch(() => null);
    scholarshipId = body?.scholarshipId;
  }

  if (!scholarshipId) {
    return NextResponse.json({ error: "Missing scholarshipId parameter." }, { status: 400 });
  }

  try {
    await prisma.savedScholarship.deleteMany({
      where: {
        userId: user.userId,
        scholarshipId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete bookmark:", error);
    return NextResponse.json({ error: "Failed to remove bookmark." }, { status: 500 });
  }
}

