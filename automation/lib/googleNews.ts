// Shared news RSS discovery + article fetching, used by both
// automation/news/generate.ts and automation/trending/generate.ts.
//
// Originally targeted Google News RSS (mirroring
// .claude/skills/news-writer/news_topics.py), but Google now wraps every
// article link behind a JS-rendered redirect page (a `c-wiz` component that
// calls an internal batchexecute RPC to decode the real URL) — there is no
// plain HTTP 3xx or meta-refresh to follow, so a plain `fetch` can never
// resolve it. Bing News RSS solves this: its `apiclick.aspx` links carry the
// real publisher URL directly as a `url=` query parameter, no redirect
// resolution needed at all.
// https://www.bing.com/news/search?q=<query>&format=RSS&mkt=en-in

import * as cheerio from 'cheerio';

const BING_NEWS_RSS = 'https://www.bing.com/news/search';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export interface NewsHeadline {
  title: string;
  source: string;
  pubDate: string | null; // ISO date, if parseable
  link: string;           // Bing apiclick link (carries the real URL in ?url=)
  query: string;
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export async function fetchGoogleNewsRSS(query: string, opts?: { mkt?: string }): Promise<NewsHeadline[]> {
  const mkt = opts?.mkt ?? 'en-in';
  const url = `${BING_NEWS_RSS}?${new URLSearchParams({ q: query, format: 'RSS', mkt }).toString()}`;

  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) {
    console.log(`    fetch failed for ${JSON.stringify(query)}: ${res.status}`);
    return [];
  }
  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const items: NewsHeadline[] = [];
  $('item').each((_, el) => {
    const $el = $(el);
    const title = $el.find('title').first().text().trim();
    const link = $el.find('link').first().text().trim();
    const pubDateRaw = $el.find('pubDate').first().text().trim();
    const source = $el.find('News\\:Source, source').first().text().trim();

    if (!title) return;

    let pubDate: string | null = null;
    if (pubDateRaw) {
      const d = new Date(pubDateRaw);
      if (!Number.isNaN(d.getTime())) pubDate = d.toISOString();
    }

    items.push({ title, source, pubDate, link, query });
  });
  return items;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchManyQueries(queries: string[]): Promise<NewsHeadline[]> {
  const collected: NewsHeadline[] = [];
  for (const [i, q] of queries.entries()) {
    // A CI runner firing every query back-to-back has been observed getting
    // rate-limited into empty (0-headline) responses from Bing; a small
    // stagger between requests avoids that.
    if (i > 0) await sleep(1200);
    console.log(`  querying ${JSON.stringify(q)} ...`);
    try {
      const items = await fetchGoogleNewsRSS(q);
      console.log(`    -> ${items.length} headlines`);
      if (items.length === 0) {
        // Single retry after a longer pause — likely a transient rate limit
        // rather than a genuinely empty result set.
        await sleep(2500);
        const retry = await fetchGoogleNewsRSS(q);
        if (retry.length > 0) console.log(`    -> retry: ${retry.length} headlines`);
        collected.push(...retry);
      } else {
        collected.push(...items);
      }
    } catch (err) {
      console.log(`    fetch error for ${JSON.stringify(q)}: ${(err as Error).message}`);
    }
  }
  return collected;
}

/**
 * MSN's syndicated article pages are a client-rendered shell with zero
 * server-rendered body text (confirmed empirically — a plain fetch returns
 * ~40KB of JS bootstrap and no article copy at all), so they can never clear
 * fetchArticleText's grounding-length bar. Filter them out before spending a
 * resolve+fetch round trip on a headline that can't be used anyway; Bing
 * News RSS reliably labels these with a "<Source> on MSN" source name.
 */
export function isLikelyUnscrapable(headline: NewsHeadline): boolean {
  return /\bmsn\b/i.test(headline.source) || /\bmsn\b/i.test(headline.title);
}

/** Dedupe by normalized title, keep first occurrence, filter to last N days. */
export function dedupeAndFilterFresh(items: NewsHeadline[], days = 14): NewsHeadline[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const seen = new Set<string>();
  const out: NewsHeadline[] = [];
  for (const it of items) {
    const key = normalizeTitle(it.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    if (it.pubDate && new Date(it.pubDate).getTime() < cutoff) continue;
    out.push(it);
  }
  // Newest first; undated sink to the bottom.
  out.sort((a, b) => {
    const ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return tb - ta;
  });
  return out;
}

/**
 * Resolve a headline link to the real publisher URL. Bing's `apiclick.aspx`
 * links carry it directly as a `?url=` query param — no network round trip
 * needed. Falls back to following redirects / scraping a canonical link for
 * any link shape that isn't a Bing apiclick link (e.g. if a query source
 * changes format later).
 */
export async function resolvePublisherUrl(link: string): Promise<string | null> {
  try {
    const parsed = new URL(link);
    const direct = parsed.searchParams.get('url');
    if (direct) return direct;
  } catch {
    // not a parseable URL — fall through to the network-based fallback below
  }

  try {
    const res = await fetch(link, { redirect: 'follow', headers: { 'User-Agent': UA } });
    const finalUrl = res.url || link;
    if (!finalUrl.includes('news.google.com') && !finalUrl.includes('bing.com')) return finalUrl;

    const html = await res.text();
    const $ = cheerio.load(html);
    const canonical = $('link[rel="canonical"]').attr('href');
    if (canonical && !canonical.includes('news.google.com') && !canonical.includes('bing.com')) return canonical;
    const metaRefresh = $('meta[http-equiv="refresh"]').attr('content');
    const m = metaRefresh?.match(/url=(\S+)/i);
    if (m && !m[1].includes('news.google.com') && !m[1].includes('bing.com')) return m[1];

    return null;
  } catch (err) {
    console.log(`    redirect resolution failed: ${(err as Error).message}`);
    return null;
  }
}

/** Fetch a publisher page and reduce it to plain text for grounding a prompt. */
export async function fetchArticleText(url: string, maxChars = 8000): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    $('script, style, noscript, nav, header, footer, form, svg').remove();
    const text = $('article').text().trim() || $('body').text().trim();
    const collapsed = text.replace(/\s+/g, ' ').trim();
    return collapsed.slice(0, maxChars);
  } catch (err) {
    console.log(`    article fetch failed for ${url}: ${(err as Error).message}`);
    return null;
  }
}

/** Slugify a headline into a short kebab-case slug, matching the skill's convention. */
export function slugify(title: string, maxWords = 8): string {
  return title
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, maxWords)
    .join('-');
}
