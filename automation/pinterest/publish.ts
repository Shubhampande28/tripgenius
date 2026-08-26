// Pinterest pin factory — publisher.
// Takes the next pending entry from queue.json, renders its image (variant
// alternates with queue position so A/B performance can be compared later),
// and creates the pin via Pinterest API v5. Rate-safe: exactly 1 pin per run.
//
// Usage:
//   npx tsx automation/pinterest/publish.ts               # publish next pending
//   npx tsx automation/pinterest/publish.ts --dry-run     # render + print payload, no API calls
//   npx tsx automation/pinterest/publish.ts --slug=<slug> # force a specific queue entry
//
// Env: PINTEREST_ACCESS_TOKEN (long-lived token with pins:write, boards:read, boards:write)

import fs from 'node:fs';
import path from 'node:path';
import { renderPin, type Variant } from './render';
import type { QueueEntry } from './build-queue';

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const QUEUE_FILE = path.join(DIR, 'queue.json');
const API = 'https://api.pinterest.com/v5';

export const BOARDS: Record<QueueEntry['type'], string> = {
  itinerary: 'Day-by-Day Itineraries',
  visit: 'Best Time to Visit',
};
// Created up-front so all three exist even before visit pins start flowing.
const ALL_BOARDS = ['Day-by-Day Itineraries', 'Budget Travel from India', 'Best Time to Visit'];

function token(): string {
  const t = process.env.PINTEREST_ACCESS_TOKEN;
  if (!t) throw new Error('PINTEREST_ACCESS_TOKEN env var is not set');
  return t;
}

async function api(method: string, endpoint: string, body?: unknown): Promise<any> {
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error(`AUTH_ERROR: Pinterest returned ${res.status} — token expired or missing scopes`);
  }
  if (res.status === 429) {
    throw new Error('RATE_LIMITED: Pinterest returned 429 — this run is skipped; the next cron slot retries');
  }
  if (!res.ok) throw new Error(`Pinterest ${method} ${endpoint} failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function ensureBoards(): Promise<Record<string, string>> {
  const existing: Record<string, string> = {};
  let bookmark: string | undefined;
  do {
    const page = await api('GET', `/boards?page_size=100${bookmark ? `&bookmark=${bookmark}` : ''}`);
    for (const b of page.items ?? []) existing[b.name] = b.id;
    bookmark = page.bookmark ?? undefined;
  } while (bookmark);

  for (const name of ALL_BOARDS) {
    if (!existing[name]) {
      const created = await api('POST', '/boards', { name, privacy: 'PUBLIC' });
      existing[name] = created.id;
      console.log(`Created board "${name}" (${created.id})`);
    }
  }
  return existing;
}

export function pinTitle(e: QueueEntry): string {
  const t = e.type === 'itinerary'
    ? `${e.country} ${e.days}-Day Itinerary — Full Plan + Costs in ₹`
    : `${e.city} in ${e.month} — Weather, Crowds & Costs`;
  return t.slice(0, 100);
}

export function pinDescription(e: QueueEntry): string {
  const tagBase = (e.country ?? e.city ?? '').toLowerCase().replace(/[^a-z]/g, '');
  const body = e.type === 'itinerary'
    ? `The exact ${e.days}-day ${e.country} route: which cities, in what order, and what it really costs from India${e.costINR ? ` (from ₹${e.costINR.toLocaleString('en-IN')})` : ''}. Day-by-day plan with no fluff.`
    : `Thinking about ${e.city} in ${e.month}? The honest verdict on weather, crowds and daily costs — plus what to do while you're there.`;
  return `${body}\n\n#travelindia #budgettravel #${tagBase}travel #itinerary #traveltips`;
}

export function pinLink(e: QueueEntry): string {
  return `${e.url}?utm_source=pinterest&utm_medium=pin&utm_campaign=itineraries`;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const forcedSlug = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1];

  const queue: QueueEntry[] = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
  const entry = forcedSlug
    ? queue.find((e) => e.slug === forcedSlug)
    : queue.find((e) => e.status === 'pending');
  if (!entry) {
    console.log(forcedSlug ? `Slug not found: ${forcedSlug}` : 'Queue empty — nothing pending. 🎉');
    return;
  }

  // Alternate template by queue position so variant performance is comparable.
  const variant: Variant = queue.indexOf(entry) % 2 === 0 ? 'a' : 'b';
  console.log(`Rendering ${entry.slug} (variant ${variant})…`);
  const imagePath = await renderPin(entry, variant);
  const imageB64 = fs.readFileSync(imagePath).toString('base64');

  const payloadPreview = {
    board: BOARDS[entry.type],
    title: pinTitle(entry),
    description: pinDescription(entry),
    link: pinLink(entry),
    media_source: { source_type: 'image_base64', content_type: 'image/png', data: `<${imageB64.length} base64 chars>` },
  };

  if (dryRun) {
    console.log('\n--- DRY RUN — payload below, nothing posted ---');
    console.log(JSON.stringify(payloadPreview, null, 2));
    console.log(`\nImage rendered at: ${imagePath}`);
    return;
  }

  const boards = await ensureBoards();
  const boardId = boards[BOARDS[entry.type]];

  const pin = await api('POST', '/pins', {
    board_id: boardId,
    title: pinTitle(entry),
    description: pinDescription(entry),
    link: pinLink(entry),
    media_source: { source_type: 'image_base64', content_type: 'image/png', data: imageB64 },
  });
  console.log(`📌 Pinned ${entry.slug} → pin ${pin.id} on "${BOARDS[entry.type]}"`);

  entry.status = 'posted';
  entry.postedAt = new Date().toISOString();
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
  console.log('queue.json updated');
}

// CLI-only — gated so importing BOARDS/pinTitle/pinDescription/pinLink from
// elsewhere (e.g. the /admin/pinterest manual-posting page) never triggers a
// real publish run as an import side effect.
if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  main().catch((err) => {
    // Auth errors are surfaced as a GitHub Issue by the workflow (it greps the log).
    console.error(String(err));
    process.exit(1);
  });
}
