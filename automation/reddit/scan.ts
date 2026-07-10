// Reddit opportunity scanner — finds threads TripGenius pages can genuinely
// answer. Scan-only: this pipeline NEVER posts to Reddit (by design — see
// README.md). draft.ts consumes the candidates this module returns.
//
// Auth: Reddit script-app OAuth (password grant) when REDDIT_CLIENT_ID etc.
// are set; falls back to the public search.json endpoints otherwise.

import { countries } from '@/data/countries';
import { getCityBySlug, authoredMonthCitySlugs } from '@/lib/cities';

const UA = 'web:in.tripgenius.scanner:v1.0 (by /u/tripgenius)';
const SUBREDDITS = [
  'IndiaTravel', 'TravelHacks', 'solotravel', 'travel',
  'incredibleindia', 'backpacking', 'TravelNoPics', 'IndianBackpackers',
];
const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

export interface RedditThread {
  id: string;
  subreddit: string;
  title: string;
  selftext: string;
  url: string;
  score: number;
  numComments: number;
  createdUtc: number;
  matchedQuery: string;
}

// ── Search patterns derived from the actual page inventory ──────────────────

export function buildQueries(): string[] {
  const queries = new Set<string>();
  for (const c of countries) {
    const name = c.name.toLowerCase();
    queries.add(`${name} itinerary`);
    queries.add(`days in ${name}`);
    queries.add(`${name} trip cost`);
    queries.add(`${name} budget`);
  }
  for (const slug of authoredMonthCitySlugs) {
    const city = getCityBySlug(slug);
    if (!city) continue;
    const name = city.name.toLowerCase();
    queries.add(`is ${name} worth`);
    queries.add(`best time ${name}`);
    // "{city} in {month}" for the city's best months only — keeps query volume sane.
    for (const m of city.monthByMonth?.bestMonths.slice(0, 2) ?? []) {
      queries.add(`${name} in ${m.toLowerCase()}`);
    }
  }
  return [...queries];
}

// ── Reddit API ───────────────────────────────────────────────────────────────

async function oauthToken(): Promise<string | null> {
  const { REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD } = process.env;
  if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET || !REDDIT_USERNAME || !REDDIT_PASSWORD) return null;
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': UA,
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: REDDIT_USERNAME,
      password: REDDIT_PASSWORD,
    }),
  });
  if (!res.ok) {
    console.warn(`Reddit OAuth failed (${res.status}) — falling back to public endpoints`);
    return null;
  }
  const data = await res.json();
  return data.access_token ?? null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function searchSub(
  token: string | null,
  subreddit: string,
  query: string,
): Promise<RedditThread[]> {
  const base = token ? 'https://oauth.reddit.com' : 'https://www.reddit.com';
  const url = `${base}/r/${subreddit}/search.json?` + new URLSearchParams({
    q: query,
    restrict_sr: 'true',
    sort: 'new',
    t: 'week',
    limit: '10',
  });
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (res.status === 429) {
    await sleep(5000);
    return [];
  }
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.data?.children ?? []).map((c: any) => ({
    id: c.data.id,
    subreddit,
    title: c.data.title,
    selftext: (c.data.selftext ?? '').slice(0, 2000),
    url: `https://www.reddit.com${c.data.permalink}`,
    score: c.data.score,
    numComments: c.data.num_comments,
    createdUtc: c.data.created_utc,
    matchedQuery: query,
  }));
}

const QUESTION_RE = /\?|^(is|are|how|what|which|where|when|should|need|help|any|does)\b/i;

// The full inventory yields ~475 patterns — far too many to search every run
// under Reddit's rate limits. Each weekly run takes a rotating slice (seeded by
// ISO week number) so coverage accumulates across weeks; the highest-value
// generic patterns (first N from countries) are always included.
const QUERIES_PER_RUN = 30;

function weeklySlice(queries: string[]): string[] {
  const week = Math.floor(Date.now() / (7 * 24 * 3600 * 1000));
  const always = queries.slice(0, 10);
  const rest = queries.slice(10);
  const offset = (week * (QUERIES_PER_RUN - always.length)) % Math.max(rest.length, 1);
  const rotating: string[] = [];
  for (let i = 0; i < QUERIES_PER_RUN - always.length && rest.length; i++) {
    rotating.push(rest[(offset + i) % rest.length]);
  }
  return [...always, ...rotating];
}

export async function scan(seenIds: Set<string>): Promise<RedditThread[]> {
  const token = await oauthToken();
  console.log(token ? '🔑 Using authenticated Reddit API' : '🌐 Using public Reddit JSON endpoints');

  const queries = weeklySlice(buildQueries());
  console.log(`${queries.length} search patterns (weekly rotation) across ${SUBREDDITS.length} subreddits`);

  const weekAgo = Date.now() / 1000 - 7 * 24 * 3600;
  const results = new Map<string, RedditThread>();

  for (const sub of SUBREDDITS) {
    for (const q of queries) {
      const threads = await searchSub(token, sub, q);
      for (const t of threads) {
        if (t.createdUtc < weekAgo) continue;
        if (seenIds.has(t.id) || results.has(t.id)) continue;
        if (t.score < 2 && t.numComments < 3) continue;
        if (!QUESTION_RE.test(t.title)) continue;
        results.set(t.id, t);
      }
      // Stay well under Reddit's rate limits (60 req/min authed, 10 unauthed).
      await sleep(token ? 1100 : 6100);
    }
  }
  return [...results.values()].sort(
    (a, b) => b.score + b.numComments - (a.score + a.numComments),
  );
}
