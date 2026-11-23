import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || "scholarcheck-default-fallback-secret-key-32chars-min",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => bcrypt.hash(password, 10),
      verify: async ({ password, hash }: { password: string; hash: string }) => bcrypt.compare(password, hash),
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
      },
    },
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
});

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role?: string;
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });
    if (session?.user) {
      return {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: ((session.user as Record<string, unknown>).role as string) || "student",
      };
    }

    return null;
  } catch {
    return null;
  }
}
