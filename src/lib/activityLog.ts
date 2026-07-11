// Automation activity log — one JSONL file on the VPS disk. Every automation
// event (Instagram post, Pinterest pin, GitHub Actions run, news publish)
// appends a line here; the /admin dashboard reads it back. Server-only (fs).

import fs from 'node:fs';
import path from 'node:path';

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

const LOG_DIR = process.env.ACTIVITY_LOG_DIR ?? path.join(process.cwd(), 'data');
const LOG_FILE = path.join(LOG_DIR, 'activity-log.jsonl');

export function logActivity(entry: Omit<ActivityEntry, 'ts'>): ActivityEntry {
  const full: ActivityEntry = { ts: new Date().toISOString(), ...entry };
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify(full) + '\n');
  } catch (err) {
    // Logging must never break the caller (e.g. a posting run).
    console.error('activity-log append failed:', err);
  }
  return full;
}

export function readActivity(limit = 200): ActivityEntry[] {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];
    const lines = fs.readFileSync(LOG_FILE, 'utf-8').trim().split('\n');
    return lines
      .slice(-limit)
      .map((l) => {
        try { return JSON.parse(l) as ActivityEntry; } catch { return null; }
      })
      .filter((e): e is ActivityEntry => e !== null)
      .reverse(); // newest first
  } catch {
    return [];
  }
}

/** Latest entry per source — powers the health strip on /admin. */
export function latestBySource(): Partial<Record<ActivitySource, ActivityEntry>> {
  const out: Partial<Record<ActivitySource, ActivityEntry>> = {};
  for (const e of readActivity(1000)) {
    if (!out[e.source]) out[e.source] = e; // readActivity is newest-first
  }
  return out;
}
