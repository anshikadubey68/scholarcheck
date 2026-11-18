interface DashboardCachedData {
  userRecord: {
    id: string;
    name: string;
    email: string;
    profile: any;
  };
  savedScholarships: any[];
  recentVerifications: any[];
}

const cache = new Map<string, { data: DashboardCachedData; expiresAt: number }>();

export function getDashboardCache(userId: string): DashboardCachedData | null {
  const entry = cache.get(userId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(userId);
    return null;
  }
  return entry.data;
}

export function setDashboardCache(userId: string, data: DashboardCachedData, ttlMs = 120000) {
  cache.set(userId, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export function invalidateDashboardCache(userId?: string) {
  if (userId) {
    cache.delete(userId);
  } else {
    cache.clear();
  }
}
