/**
 * Validates SERP metadata across ALL built itinerary pages:
 *   - <title> ≤ 60 chars and no "| TripGenius" suffix
 *   - meta description ≤ 155 chars, mentions "day-by-day"/"Day-by-day" and costs
 *   - ItemList + FAQPage JSON-LD present and well-formed
 * Run after `next build`: node scripts/check-itinerary-meta.mjs
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DIR = '.next/server/app/itinerary';

// Measure what the SERP shows, not the HTML encoding ("&amp;" is 1 char).
const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#x27;|&apos;/g, "'");
const files = readdirSync(DIR).filter((f) => f.endsWith('.html'));
let violations = 0;
const fail = (msg) => { violations++; console.error('  ✗ ' + msg); };

for (const f of files) {
  const html = readFileSync(join(DIR, f), 'utf8');
  const slug = f.replace(/\.html$/, '');

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  if (!title) fail(`${slug}: no <title>`);
  if (title.length > 60) fail(`${slug}: title ${title.length} chars — "${title}"`);
  if (title.includes('| TripGenius')) fail(`${slug}: title still carries "| TripGenius"`);

  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  if (!desc) fail(`${slug}: no meta description`);
  if (desc.length > 155) fail(`${slug}: description ${desc.length} chars`);
  if (!/day-by-day/i.test(desc)) fail(`${slug}: description missing "day-by-day"`);
  if (!/costs/i.test(desc)) fail(`${slug}: description missing costs mention`);

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .map((m) => { try { return JSON.parse(m[1].replace(/\\u003c/g, '<')); } catch { fail(`${slug}: invalid JSON-LD`); return null; } });
  const types = schemas.filter(Boolean).map((s) => s['@type']);
  if (!types.includes('ItemList')) fail(`${slug}: missing ItemList schema`);
  if (!types.includes('FAQPage')) fail(`${slug}: missing FAQPage schema`);
  const list = schemas.find((s) => s?.['@type'] === 'ItemList');
  if (list && (!list.numberOfItems || !list.itemListElement?.every((i) => i.name && i.url && i.position))) {
    fail(`${slug}: ItemList missing required fields`);
  }
}

console.log(`checked ${files.length} itinerary pages`);
if (violations) { console.error(`FAILED — ${violations} violation(s)`); process.exit(1); }
console.log('all titles ≤60, descriptions ≤155, schema valid ✓');
