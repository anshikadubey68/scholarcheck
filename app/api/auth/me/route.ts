import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  // Fast path: session JWT already contains verified userId, name, and email.
  // Return immediately in <1ms without blocking on remote database network roundtrips.
  return NextResponse.json({
    user: {
      id: session.userId,
      name: session.name,
      email: session.email,
    },
  });
}
