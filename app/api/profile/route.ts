import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function PUT(req: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Missing profile payload." }, { status: 400 });
  }

  try {
    const updated = await prisma.studentProfile.upsert({
      where: { userId: session.userId },
      update: {
        fullName: body.fullName || session.name,
        educationLevel: body.educationLevel || "Undergraduate",
        course: body.course || "General Studies",
        academicYear: body.academicYear || "1st Year",
        institution: body.institution || "College",
        gpaOrPercentage: typeof body.gpaOrPercentage === "number" ? body.gpaOrPercentage : parseFloat(body.gpaOrPercentage) || 7.0,
        familyIncome: typeof body.familyIncome === "number" ? body.familyIncome : parseInt(body.familyIncome) || 300000,
        state: body.state || "Delhi",
        country: body.country || "India",
        category: body.category || "General",
        gender: body.gender || null,
      },
      create: {
        userId: session.userId,
        fullName: body.fullName || session.name,
        educationLevel: body.educationLevel || "Undergraduate",
        course: body.course || "General Studies",
        academicYear: body.academicYear || "1st Year",
        institution: body.institution || "College",
        gpaOrPercentage: typeof body.gpaOrPercentage === "number" ? body.gpaOrPercentage : parseFloat(body.gpaOrPercentage) || 7.0,
        familyIncome: typeof body.familyIncome === "number" ? body.familyIncome : parseInt(body.familyIncome) || 300000,
        state: body.state || "Delhi",
        country: body.country || "India",
        category: body.category || "General",
        gender: body.gender || null,
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}

