// Reddit opportunity drafter — matches scanned threads to the single best
// TripGenius page and drafts an answer grounded ONLY in that page's data.
// This tool drafts; posting is manual by design (see README.md).
//
// Usage:
//   npx tsx automation/reddit/draft.ts             # writes digest.md + updates seen.json
//   npx tsx automation/reddit/draft.ts --dry-run   # prints digest, writes nothing
//
// Env: ANTHROPIC_API_KEY (for the draft generation); Reddit creds optional
// (scan.ts falls back to public endpoints without them).

import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { scan, type RedditThread } from './scan';
import { countries } from '@/data/countries';
import { getCityBySlug, authoredMonthCitySlugs } from '@/lib/cities';
import {
  ITINERARY_DURATIONS,
  buildItineraryDays,
  buildRouteOverview,
  estimateTripCost,
  fmtINR,
  getItinerarySlug,
} from '@/lib/itineraries';

const BASE = 'https://www.tripgenius.in';
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const SEEN_FILE = path.join(DIR, 'seen.json');
const DIGEST_FILE = path.join(DIR, 'digest.md');
const MAX_DRAFTS = 10;
const MIN_CONFIDENCE = 3; // a bad link suggestion is worse than none

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

interface PageMatch {
  url: string;
  kind: 'visit' | 'itinerary' | 'city';
  confidence: number;
  /** the real page data the model is allowed to use — nothing else */
  facts: string;
}

// ── Matcher: exact city+month page > itinerary page > city hub ──────────────

function matchThread(t: RedditThread): PageMatch | null {
  const text = `${t.title} ${t.selftext}`.toLowerCase();

  // 1. City + month page
  for (const slug of authoredMonthCitySlugs) {
    const city = getCityBySlug(slug);
    if (!city?.monthByMonth) continue;
    const cityName = city.name.toLowerCase();
    if (!text.includes(cityName)) continue;
    const monthIdx = MONTHS.findIndex((m) => text.includes(m));
    if (monthIdx >= 0) {
      const m = city.monthByMonth.months[monthIdx];
      const confidence = 3
        + (t.title.toLowerCase().includes(cityName) ? 2 : 0)
        + (t.title.toLowerCase().includes(MONTHS[monthIdx]) ? 2 : 0);
      return {
        url: `${BASE}/visit/${slug}/${MONTHS[monthIdx]}`,
        kind: 'visit',
        confidence,
        facts: [
          `${city.name} in ${MONTHS[monthIdx]}:`,
          `rating: ${m.rating}`,
          `weather: ${m.weather}, temperature ${m.temp}`,
          `crowds: ${m.crowds}, prices: ${m.price}`,
          `highlight: ${m.highlight}`,
          `daily budget: ${city.stats.budget}`,
          `best months overall: ${city.monthByMonth.bestMonths.join(', ')}`,
          city.thingsToDo?.length
            ? `top things to do: ${city.thingsToDo.slice(0, 4).map((x) => x.name).join('; ')}`
            : '',
        ].filter(Boolean).join('\n'),
      };
    }
  }

  // 2. Itinerary page (country + a duration signal)
  for (const country of countries) {
    const name = country.name.toLowerCase();
    if (!text.includes(name)) continue;
    const durMatch = text.match(/(\d+)\s*(?:days?|nights?|-day)/);
    const wanted = durMatch ? Number(durMatch[1]) : null;
    const duration = (ITINERARY_DURATIONS as readonly number[]).includes(wanted ?? -1)
      ? (wanted as 3 | 5 | 7)
      : wanted
        ? ([...ITINERARY_DURATIONS].sort((a, b) => Math.abs(a - (wanted as number)) - Math.abs(b - (wanted as number)))[0])
        : null;
    if (duration && /itinerar|plan|route|days|trip/.test(text)) {
      const days = buildItineraryDays(country.slug, duration);
      if (days.length === 0) continue;
      const route = buildRouteOverview(days);
      const cost = estimateTripCost(days);
      const confidence = 3
        + (t.title.toLowerCase().includes(name) ? 2 : 0)
        + (durMatch ? 1 : 0);
      return {
        url: `${BASE}/itinerary/${getItinerarySlug(country.slug, duration)}`,
        kind: 'itinerary',
        confidence,
        facts: [
          `${country.name} ${duration}-day itinerary:`,
          `route: ${route.map((r) => `${r.city.name} (days ${r.startDay}–${r.endDay})`).join(' → ')}`,
          cost ? `estimated cost: ${fmtINR(cost.inrMin)}–${fmtINR(cost.inrMax)} per person excl. international flights` : '',
          `best time: ${country.bestTime}`,
          `visa for Indians: ${country.visaForIndians}`,
        ].filter(Boolean).join('\n'),
      };
    }
  }

  // 3. City hub
  for (const slug of authoredMonthCitySlugs) {
    const city = getCityBySlug(slug);
    if (!city) continue;
    const cityName = city.name.toLowerCase();
    if (t.title.toLowerCase().includes(cityName)) {
      return {
        url: `${BASE}/cities/${slug}`,
        kind: 'city',
        confidence: 3,
        facts: [
          `${city.name} (${city.country}): ${city.tagline}`,
          `daily budget: ${city.stats.budget}, best time: ${city.stats.bestTime}`,
          `visa: ${city.visa ?? 'see country guide'}`,
          city.thingsToDo?.length
            ? `top things to do: ${city.thingsToDo.slice(0, 5).map((x) => x.name).join('; ')}`
            : '',
        ].filter(Boolean).join('\n'),
      };
    }
  }
  return null;
}

// ── Drafter — Claude writes the answer from the page data only ───────────────

async function draftAnswer(
  client: Anthropic,
  thread: RedditThread,
  match: PageMatch,
): Promise<string | null> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system:
      'You draft Reddit replies for a travel-site owner who will personalize and post them manually. ' +
      'Write 5-8 lines. Answer the specific question directly first, with concrete specifics ' +
      '(temperatures, ₹ costs, named places) taken ONLY from the provided page data. ' +
      'Casual Reddit tone: lowercase-friendly, no marketing language, no bullet-point listicles, no emoji. ' +
      'End with ONE natural line offering the full plan at the provided URL. ' +
      'Never invent facts, numbers, or place names not present in the data. ' +
      'If the provided data cannot genuinely answer the question, output exactly: SKIP',
    messages: [
      {
        role: 'user',
        content:
          `Thread title: ${thread.title}\n\nThread body:\n${thread.selftext || '(no body)'}\n\n` +
          `Page URL: ${match.url}\n\nPage data (the only facts you may use):\n${match.facts}`,
      },
    ],
  });
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
  return text === 'SKIP' || text.length === 0 ? null : text;
}

// ── Digest ───────────────────────────────────────────────────────────────────

interface DigestItem { thread: RedditThread; match: PageMatch; draft: string }

function buildDigest(items: DigestItem[]): string {
  const lines: string[] = [];
  lines.push(`# 🎯 Reddit opportunities — ${new Date().toISOString().slice(0, 10)}`);
  lines.push('');
  lines.push('> **Drafts only — posting is manual by design.** Personalize each answer before posting,');
  lines.push('> post at most 3–4 per week, and keep answering some threads WITHOUT links.');
  lines.push('');
  if (items.length === 0) lines.push('_No solid opportunities this week._');
  for (const { thread, match, draft } of items) {
    lines.push(`## [${thread.title}](${thread.url})`);
    lines.push('');
    lines.push(`r/${thread.subreddit} · ▲${thread.score} · 💬${thread.numComments} · matched **${match.url.replace(BASE, '')}** (confidence ${match.confidence})`);
    lines.push('');
    lines.push('```text');
    lines.push(draft);
    lines.push('```');
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const seen: string[] = fs.existsSync(SEEN_FILE) ? JSON.parse(fs.readFileSync(SEEN_FILE, 'utf-8')) : [];
  const seenIds = new Set(seen);

  const threads = await scan(seenIds);
  console.log(`Scan found ${threads.length} candidate threads`);

  const client = new Anthropic();
  const items: DigestItem[] = [];

  for (const thread of threads) {
    if (items.length >= MAX_DRAFTS) break;
    const match = matchThread(thread);
    if (!match || match.confidence < MIN_CONFIDENCE) continue;
    const draft = await draftAnswer(client, thread, match);
    if (!draft) {
      console.log(`SKIP (model judged data insufficient): ${thread.title}`);
      continue;
    }
    items.push({ thread, match, draft });
    console.log(`✍️  Drafted: ${thread.title}`);
  }

  const digest = buildDigest(items);
  if (dryRun) {
    console.log('\n--- DRY RUN — digest below, nothing written ---\n');
    console.log(digest);
    return;
  }

  fs.writeFileSync(DIGEST_FILE, digest);
  // Mark every scanned thread as seen (drafted or not) so reruns don't repeat.
  fs.writeFileSync(SEEN_FILE, JSON.stringify([...seenIds, ...threads.map((t) => t.id)], null, 2));
  console.log(`Wrote ${DIGEST_FILE} (${items.length} drafts) and updated seen.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
