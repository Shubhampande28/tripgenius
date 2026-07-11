// Automation activity log — every automation event (Instagram post, Pinterest
// pin, GitHub Actions run, news publish) is recorded here; /admin reads it back.
//
// Storage backends, picked automatically:
//   1. Upstash Redis (REST) — for Vercel, where functions have no persistent
//      disk. Create via Vercel Dashboard → Storage → Upstash Redis (free tier);
//      the integration injects the env vars used below.
//   2. Local JSONL file — dev machines and self-hosted servers.

export type ActivitySource =
  | 'instagram'
  | 'pinterest'
  | 'reddit'
  | 'scorecard'
  | 'seo-watchdog'
  | 'news'
  | 'deploy'
  | 'other';

export interface ActivityEntry {
  ts: string;                       // ISO timestamp
  source: ActivitySource;
  status: 'ok' | 'error' | 'skipped';
  title: string;                    // "Posted Bali (morning slot)"
  detail?: string;                  // error message, pin id, etc.
  url?: string;                     // link to the post / issue / commit
}

const REDIS_KEY = 'tripgenius:activity-log';
const MAX_ENTRIES = 1000;

function redisConfig(): { url: string; token: string } | null {
  // Vercel's Upstash integration injects KV_REST_API_*; a manual Upstash setup
  // uses UPSTASH_REDIS_REST_*. Accept either.
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisCommand(command: unknown[]): Promise<unknown> {
  const cfg = redisConfig();
  if (!cfg) throw new Error('Redis not configured');
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Redis command failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.result;
}

// ── Local-file fallback (dev / self-hosted) ──────────────────────────────────

async function fileAppend(entry: ActivityEntry): Promise<void> {
  const [fs, path] = await Promise.all([import('node:fs'), import('node:path')]);
  const dir = process.env.ACTIVITY_LOG_DIR ?? path.join(process.cwd(), 'data');
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(path.join(dir, 'activity-log.jsonl'), JSON.stringify(entry) + '\n');
}

async function fileRead(limit: number): Promise<ActivityEntry[]> {
  const [fs, path] = await Promise.all([import('node:fs'), import('node:path')]);
  const file = path.join(process.env.ACTIVITY_LOG_DIR ?? path.join(process.cwd(), 'data'), 'activity-log.jsonl');
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf-8').trim().split('\n')
    .slice(-limit)
    .map((l) => { try { return JSON.parse(l) as ActivityEntry; } catch { return null; } })
    .filter((e): e is ActivityEntry => e !== null)
    .reverse();
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function logActivity(entry: Omit<ActivityEntry, 'ts'>): Promise<ActivityEntry> {
  const full: ActivityEntry = { ts: new Date().toISOString(), ...entry };
  try {
    if (redisConfig()) {
      await redisCommand(['LPUSH', REDIS_KEY, JSON.stringify(full)]);
      await redisCommand(['LTRIM', REDIS_KEY, 0, MAX_ENTRIES - 1]);
    } else {
      await fileAppend(full);
    }
  } catch (err) {
    // Logging must never break the caller (e.g. a posting run).
    console.error('activity-log append failed:', err);
  }
  return full;
}

/** Newest first. */
export async function readActivity(limit = 200): Promise<ActivityEntry[]> {
  try {
    if (redisConfig()) {
      const raw = (await redisCommand(['LRANGE', REDIS_KEY, 0, limit - 1])) as string[];
      return (raw ?? [])
        .map((l) => { try { return JSON.parse(l) as ActivityEntry; } catch { return null; } })
        .filter((e): e is ActivityEntry => e !== null);
    }
    return await fileRead(limit);
  } catch {
    return [];
  }
}

/** Latest entry per source — powers the health strip on /admin. */
export async function latestBySource(): Promise<Partial<Record<ActivitySource, ActivityEntry>>> {
  const out: Partial<Record<ActivitySource, ActivityEntry>> = {};
  for (const e of await readActivity(1000)) {
    if (!out[e.source]) out[e.source] = e; // readActivity is newest-first
  }
  return out;
}
