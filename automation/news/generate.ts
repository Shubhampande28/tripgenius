// Daily travel-news generator — the automated counterpart to the manual
// .claude/skills/news-writer skill. Finds 2 fresh, on-niche stories via
// Google News RSS, grounds each in the real fetched article, and asks Claude
// to draft one article matching content/news/*.md's exact frontmatter +
// markdown format (parsed by src/lib/news.ts).
//
// Usage: npx tsx automation/news/generate.ts
// Env:   ANTHROPIC_API_KEY
//
// This mirrors automation/reddit/draft.ts's shape (Anthropic SDK call,
// grounded-only prompting) and news-writer/SKILL.md's voice/rules/format.

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

const NEWS_DIR = path.join(process.cwd(), 'content', 'news');
const MAX_NEW_ARTICLES = 2;

// Fixed niche queries — same guidance as SKILL.md: visa/flights/destination
// rules for Indian travellers. Two-to-four word phrases, never bare words.
const QUERIES = [
  'visa free indian passport',
  'schengen visa indians',
  'indigo air india new route',
  'thailand bali tourist rules',
  'travel advisory indians',
];

// ── Skip topics already covered ─────────────────────────────────────────────

function existingNewsSignals(): { slugs: Set<string>; titles: string[] } {
  const slugs = new Set<string>();
  const titles: string[] = [];
  if (!fs.existsSync(NEWS_DIR)) return { slugs, titles };
  for (const file of fs.readdirSync(NEWS_DIR)) {
    if (!file.endsWith('.md')) continue;
    slugs.add(file.replace(/\.md$/, ''));
    const raw = fs.readFileSync(path.join(NEWS_DIR, file), 'utf-8');
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

// ── Claude drafting ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the TripGenius travel-news writer, generating a publish-ready markdown file for content/news/.

SITE PROFILE: www.tripgenius.in
Business:   AI trip planner + destination guides (itineraries, budgets, best-time-to-visit)
Audience:   Indian travellers planning domestic and international trips; costs in INR
Niche:      Travel planning — visas for Indian passport holders, flights/airlines, destination rules & advisories, tourism policy, travel deals
Voice:      Friendly, direct, practical. Facts first, no fluff. INR for money. Lede-first, timely, factual — NOT an evergreen "ultimate guide".

RULES:
- Ground every fact in the provided source text. Do not invent stats, quotes, dates, or names. If a fact is unconfirmed, attribute it to the source and keep it general.
- Money in INR: convert and round, keeping the original figure in brackets, e.g. "roughly Rs 45,000 (~$540)".
- Slugs: short-kebab-case, no dates.
- Output ONLY the markdown file content, starting with the frontmatter '---' block, nothing else — no commentary, no code fences.

Produce EXACTLY this shape:

---
title: "<news-style title with the hook, <=65 chars ideal>"
description: "<meta description, <=155 chars>"
date: <YYYY-MM-DD, today's date, given below>
category: <Visas | Airlines | Destinations | Advisories | Deals | Policy>
coverPhoto: <Unsplash photo id, e.g. photo-1506905925346-21bda4d32df4 — pick one matching the destination/topic>
tags: [<2-5 short tags>]
sources:
  - <source url given below>
---

<Lede: who / what / when / why-it-matters in the first 2-3 sentences.>

## What happened
<The news itself, grounded in the fetched source. Attribute claims.>

## Why it matters
<Context and significance for Indian travellers.>

## What this means for your trip
<The TripGenius angle: what readers planning a trip should actually do — book earlier, budget differently, pick another month, check a rule.>

> <A short pulled quote or key stat from the real source, attributed.>

## The bottom line
<A crisp wrap with a forward-looking line.>

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
          `Today's date: ${today}\n\nHeadline: ${headline.title}\nSource: ${sourceUrl}\n\n` +
          `Fetched article text (ground every claim in this — do not go beyond it):\n${articleText}`,
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

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('TripGenius daily news generator\n');
  const today = new Date().toISOString().slice(0, 10);

  console.log('Fetching Google News RSS for niche queries...');
  const raw = await fetchManyQueries(QUERIES);
  const fresh = dedupeAndFilterFresh(raw, 7);
  console.log(`\n${fresh.length} fresh, deduped headlines from ${raw.length} raw results.`);

  const { slugs: existingSlugs, titles: existingTitles } = existingNewsSignals();
  const candidates = fresh.filter(h => !looksAlreadyCovered(h, existingTitles));
  console.log(`${candidates.length} candidates after removing already-covered topics.`);

  if (candidates.length === 0) {
    console.log('\nNo fresh, uncovered topics today — normal day, exiting cleanly.');
    return;
  }

  if (!fs.existsSync(NEWS_DIR)) fs.mkdirSync(NEWS_DIR, { recursive: true });

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

    const filePath = path.join(NEWS_DIR, `${slug}.md`);
    fs.writeFileSync(filePath, markdown.trim() + '\n');
    existingSlugs.add(slug);
    written.push({ file: `content/news/${slug}.md`, title: headline.title, source: publisherUrl });
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
  console.log(`\n${written.length} article(s) written to content/news/.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
