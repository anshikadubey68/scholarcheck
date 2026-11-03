/**
 * Simple in-memory rate limiter for API endpoints.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const tracker = new Map<string, RateLimitRecord>();

export function checkRateLimit(ipOrKey: string, limit = 40, windowMs = 60000): { isAllowed: boolean; remaining: number } {
  const now = Date.now();
  const record = tracker.get(ipOrKey);

  if (!record || now > record.resetAt) {
    tracker.set(ipOrKey, { count: 1, resetAt: now + windowMs });
    return { isAllowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { isAllowed: false, remaining: 0 };
  }

  record.count += 1;
  return { isAllowed: true, remaining: limit - record.count };
}

