import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "../../../../lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete("better-auth.session_token");
  cookieStore.delete("__Secure-better-auth.session_token");
  return NextResponse.json({ success: true, message: "Logged out successfully." });
}

