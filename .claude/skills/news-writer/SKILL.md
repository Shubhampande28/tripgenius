---
name: news-writer
description: Find fresh travel-news topics for TripGenius (www.tripgenius.in) and write publish-ready news articles into content/news/, where the /news section renders them. Use when the user types /news-writer or asks to write/refresh travel news for the site.
---

# TripGenius news writer

Find **fresh** travel news that matters to TripGenius readers and write
publish-ready news articles as markdown files in `content/news/`. Articles in
that folder are rendered live at `/news` — writing the file IS publishing, so
every fact must be grounded in a real fetched source.

## Site profile (fixed — do not re-derive)

```
SITE PROFILE: www.tripgenius.in
Business:   AI trip planner + destination guides (itineraries, budgets, best-time-to-visit)
Audience:   Indian travellers planning domestic and international trips; costs in INR
Niche:      Travel planning — visas for Indian passport holders, flights/airlines,
            destination rules & advisories, tourism policy, travel deals
Voice:      Friendly, direct, practical. Facts first, no fluff. INR for money.
```

## Steps

### 1. Derive news search queries
Pick **3–5 specific queries** for what Indian travellers care about *right now*.
Two-to-four word phrases tied to the niche; never bare words like "travel" or
"news". Good examples: `"visa free indian passport"`, `"indigo international routes"`,
`"bali tourist rules"`, `"thailand visa indians"`, `"schengen visa delay"`.

### 2. Find news topics
Run the bundled script by its full path (from the repo root):

```
python .claude/skills/news-writer/news_topics.py --days 7 "<query1>" "<query2>" ...
```

It pulls fresh Google News headlines (no API key) and writes
`news_topics_export.csv` next to itself. If the script errors, show the exact
error and stop — do not retry blindly.

### 3. Shortlist the best topics
Read the CSV. Cluster near-duplicate headlines into single topics, then
**select the best 3**, judged on:
- **Timely** — within the last few days.
- **Relevant** — genuinely matters to Indian travellers planning trips.
- **Angle** — connects to a TripGenius destination, visa, budget, or planning decision.

Skip anything already covered by an existing file in `content/news/`.
Present the shortlist: headline · date · source · one line on the angle.

### 4. Write each article (grounded in real reporting)
For each topic, **before writing**, `WebFetch` 1–2 of its source URLs from the
CSV to gather the actual facts — who, what, when, real numbers, real quotes.
Do not write from the headline alone.

Write each article to `content/news/<article-slug>.md`:

```
---
title: "<news-style title with the hook, <=65 chars ideal>"
description: "<meta description, <=155 chars>"
date: <YYYY-MM-DD, today>
category: <Visas | Airlines | Destinations | Advisories | Deals | Policy>
coverPhoto: <Unsplash photo id, e.g. photo-1506905925346-21bda4d32df4 — pick one matching the destination/topic>
tags: [<2-5 short tags>]
sources:
  - <source url 1>
  - <source url 2>
---

<Lede: who / what / when / why-it-matters in the first 2–3 sentences.>

## What happened
<The news itself, grounded in the fetched sources. Attribute claims.>

## Why it matters
<Context and significance for Indian travellers.>

## What this means for your trip
<The TripGenius angle: what readers planning a trip should actually do —
book earlier, budget differently, pick another month, check a rule. Link to
relevant TripGenius pages with relative links, e.g.
[Bali guide](/cities/bali), [best time to visit](/best-time-to-visit/bali),
when a matching page exists.>

> <A short pulled quote or key stat from a real source, attributed.>

## The bottom line
<A crisp wrap with a forward-looking line.>
```

Body markdown supported by the renderer: `##`/`###` headings, paragraphs,
`-` lists, `1.` lists, `> ` blockquotes, `**bold**`, and `[text](url)` links.
Nothing else (no tables, no images in the body, no HTML).

### 5. Summarize
Print a **SUMMARY** table: file · headline · category · ~word count · sources.
Remind the user the articles go live on the next deploy (`/news`).

## Rules
- **Ground everything in real sources.** Fetch the source articles; cite them
  in `sources:`. No invented stats, quotes, dates, or names. If a fact is
  unconfirmed, attribute it to the source and keep it general.
- **News voice, not SEO filler.** Lede-first, timely, factual — not an
  evergreen "ultimate guide". Evergreen content belongs in the blog, not /news.
- **Money in INR** (convert and round; keep the original figure in brackets).
- **3 articles per run** unless the user asks for more or fewer.
- **Slugs**: short-kebab-case, no dates in slug.
- Do not modify the CSV. Do not re-run the script on failure.
- Do not duplicate a story that already exists in `content/news/` — update the
  existing file instead if there's a genuine development.
