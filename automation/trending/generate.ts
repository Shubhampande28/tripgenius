// Daily "trending topic" evergreen blog generator — writes to content/trending/,
// read by src/lib/trending.ts and rendered at /trending. Unlike
// automation/news/generate.ts (lede-first, dated news), this asks Claude for
// evergreen framing: best-value destinations shifting, seasonal spikes,
// visa-free list changes, deal season, "why X is trending" angles — titles
// and structure that still read fine in 3 months.
//
// Usage: npx tsx automation/trending/generate.ts
// Env:   ANTHROPIC_API_KEY

import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import {
  fetchManyQueries,
  dedupeAndFilterFresh,
  resolvePublisherUrl,
  fetchArticleText,
  slugify,
  type NewsHeadline,
} from '../lib/googleNews';

const TRENDING_DIR = path.join(process.cwd(), 'content', 'trending');
const MAX_NEW_ARTICLES = 2;

// "Trending now" angles rather than hard news — best-value shifts, seasonal
// spikes, visa-free changes, deal season, culture/food moments that are
// driving search interest right now.
const QUERIES = [
  'best value destination trending',
  'visa free countries list update',
  'flight deals season indians',
  'why is trending travel destination',
  'off season travel deal',
];

function existingTrendingSignals(): { slugs: Set<string>; titles: string[] } {
  const slugs = new Set<string>();
  const titles: string[] = [];
  if (!fs.existsSync(TRENDING_DIR)) return { slugs, titles };
  for (const file of fs.readdirSync(TRENDING_DIR)) {
    if (!file.endsWith('.md')) continue;
    slugs.add(file.replace(/\.md$/, ''));
    const raw = fs.readFileSync(path.join(TRENDING_DIR, file), 'utf-8');
    const m = raw.match(/^title:\s*"?(.*?)"?\s*$/m);
    if (m) titles.push(m[1].toLowerCase());
  }
  return { slugs, titles };
}

function looksAlreadyCovered(headline: NewsHeadline, existingTitles: string[]): boolean {
  const words = new Set(headline.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter(w => w.length > 4));
  for (const existing of existingTitles) {
    let overlap = 0;
    for (const w of words) if (existing.includes(w)) overlap++;
    if (words.size > 0 && overlap / words.size > 0.5) return true;
  }
  return false;
}

const SYSTEM_PROMPT = `You are the TripGenius "trending" writer, generating a publish-ready evergreen markdown file for content/trending/.

SITE PROFILE: www.tripgenius.in
Business:   AI trip planner + destination guides (itineraries, budgets, best-time-to-visit)
Audience:   Indian travellers planning domestic and international trips; costs in INR
Niche:      Travel planning — visas for Indian passport holders, flights/airlines, destination rules & advisories, tourism policy, travel deals
Voice:      Friendly, direct, practical. Facts first, no fluff. INR for money.

CRITICAL DIFFERENCE FROM NEWS: this is EVERGREEN content, not lede-first news.
Frame the piece around a lasting pattern or shift ("why X keeps trending",
"the best-value destinations right now", "what deal season means for your
trip") rather than a single dated event. Avoid "today", "this week",
"yesterday" framing — a reader in 3 months should still find the piece
useful and not feel it's stale. You may still ground specific facts in the
provided source, but generalize the framing so it ages well.

RULES:
- Ground concrete facts (numbers, rule changes, named policies) in the provided source text. Do not invent stats, quotes, dates, or names.
- Money in INR: convert and round, keeping the original figure in brackets.
- Slugs: short-kebab-case, no dates.
- Output ONLY the markdown file content, starting with the frontmatter '---' block, nothing else — no commentary, no code fences.

Produce EXACTLY this shape:

---
title: "<evergreen title, framed as a lasting pattern not a dated event, <=70 chars>"
description: "<meta description, <=155 chars>"
date: <YYYY-MM-DD, today's date, given below>
category: <Destinations | Deals | Planning | Culture | Food>
coverPhoto: <Unsplash photo id, e.g. photo-1506905925346-21bda4d32df4 — pick one matching the destination/topic>
tags: [<2-5 short tags>]
sources:
  - <source url given below>
---

<Opening: state the trend/pattern and why it matters to Indian travellers planning a trip, in 2-3 sentences. No "today" or "this week" framing.>

## What's actually changed
<The underlying shift, grounded in the fetched source. Attribute specific claims.>

## Why it matters for budget and planning
<Context — how this changes trip cost, timing, or destination choice for Indian travellers.>

## What this means for your trip
<The TripGenius angle: practical planning advice a reader can act on regardless of when they read this.>

> <A short pulled quote or key stat from the real source, attributed.>

## The bottom line
<A crisp wrap that reinforces this is an ongoing pattern, not a one-off.>

Body markdown supported: ## / ### headings, paragraphs, - lists, 1. lists, > blockquotes, **bold**, and [text](url) links. Nothing else (no tables, no images, no HTML).`;

async function draftArticle(
  client: Anthropic,
  headline: NewsHeadline,
  sourceUrl: string,
  articleText: string,
  today: string,
): Promise<string | null> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content:
          `Today's date: ${today}\n\nSeed headline (for topic/fact grounding only — do NOT write this as dated news): ${headline.title}\n` +
          `Source: ${sourceUrl}\n\nFetched article text (ground concrete claims in this):\n${articleText}`,
      },
    ],
  });
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
  return text.startsWith('---') ? text : null;
}

async function main() {
  console.log('TripGenius daily trending generator\n');
  const today = new Date().toISOString().slice(0, 10);

  console.log('Fetching Google News RSS for "trending now" queries...');
  const raw = await fetchManyQueries(QUERIES);
  const fresh = dedupeAndFilterFresh(raw, 21); // trending topics can be a bit older than hard news
  console.log(`\n${fresh.length} fresh, deduped headlines from ${raw.length} raw results.`);

  const { slugs: existingSlugs, titles: existingTitles } = existingTrendingSignals();
  const candidates = fresh.filter(h => !looksAlreadyCovered(h, existingTitles));
  console.log(`${candidates.length} candidates after removing already-covered topics.`);

  if (candidates.length === 0) {
    console.log('\nNo fresh, uncovered trending topics today — normal day, exiting cleanly.');
    return;
  }

  if (!fs.existsSync(TRENDING_DIR)) fs.mkdirSync(TRENDING_DIR, { recursive: true });

  const client = new Anthropic();
  const written: { file: string; title: string; source: string }[] = [];

  for (const headline of candidates) {
    if (written.length >= MAX_NEW_ARTICLES) break;

    console.log(`\nResolving publisher URL for: ${headline.title}`);
    const publisherUrl = await resolvePublisherUrl(headline.link);
    if (!publisherUrl) {
      console.log('  could not resolve a real publisher URL — skipping.');
      continue;
    }

    console.log(`  -> ${publisherUrl}`);
    const articleText = await fetchArticleText(publisherUrl);
    if (!articleText || articleText.length < 300) {
      console.log('  fetched article text too short/empty — skipping.');
      continue;
    }

    const slug = slugify(headline.title);
    if (existingSlugs.has(slug)) {
      console.log(`  slug already exists (${slug}) — skipping.`);
      continue;
    }

    console.log('  drafting with Claude...');
    let markdown: string | null = null;
    try {
      markdown = await draftArticle(client, headline, publisherUrl, articleText, today);
    } catch (err) {
      console.log(`  draft failed: ${(err as Error).message}`);
      continue;
    }
    if (!markdown) {
      console.log('  model did not return well-formed markdown — skipping.');
      continue;
    }

    const filePath = path.join(TRENDING_DIR, `${slug}.md`);
    fs.writeFileSync(filePath, markdown.trim() + '\n');
    existingSlugs.add(slug);
    written.push({ file: `content/trending/${slug}.md`, title: headline.title, source: publisherUrl });
    console.log(`  wrote ${filePath}`);
  }

  console.log('\n--- SUMMARY ---');
  if (written.length === 0) {
    console.log('No articles written this run (nothing cleared grounding checks) — normal day.');
    return;
  }
  for (const w of written) {
    console.log(`- ${w.file}\n  headline: ${w.title}\n  source: ${w.source}`);
  }
  console.log(`\n${written.length} article(s) written to content/trending/.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
