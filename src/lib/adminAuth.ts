// Shared /admin* auth check — a single ADMIN_KEY env var compared against
// the `?key=` query param. No sessions/cookies; every /admin* page re-checks
// this on each request. Reuse this (and <AdminDenied/>) for any new /admin*
// page instead of re-implementing the check.
export function isAdminAuthorized(key: string | undefined): boolean {
  const adminKey = process.env.ADMIN_KEY;
  return Boolean(adminKey) && key === adminKey;
}
