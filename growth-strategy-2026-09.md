# TripGenius Growth Strategy — Visitors + AdSense Revenue (2026-09-18)

Grounded in live GA4/GSC data and a full audit of the automation stack's
actual running state (not assumed — checked via `gh run list`/`gh workflow
list`/`gh issue list` and live curls), not generic advice. Ordered by
leverage: fixing what's built-but-broken first, then extending what's
already proven working, then new investment.

## The headline finding: money is being left on the table by things already built

Three things exist, work, and are currently switched off or half-wired:

1. **5 of 6 AdSense ad units sitewide are still placeholder slot IDs**
   (`1111111111` etc. in `src/lib/adsense.ts`) — only the new Zone 4 unit
   (`visitMidContent`) is real. That means `/cities/[slug]` (95 pages, real
   traffic), `/blog` (70 pages), and every other templated page has been
   serving **zero revenue** regardless of traffic, because AdSense can't
   serve against a slot ID that doesn't exist. This is likely the single
   highest-ROI action available — it monetizes traffic you already have,
   today, with no new content or visitors needed.
2. **Pinterest Pin Factory has never posted a single pin.** The rendering
   pipeline is fully built (satori, 2 A/B templates, a 217-entry
   GSC-priority queue), but the workflow has been **manually disabled**
   since July 28 after failing every run (missing `PINTEREST_ACCESS_TOKEN`).
   Nobody went back to add the token and re-enable it.
3. **Correction after checking the actual issue contents** (not just that
   they exist): the Reddit Opportunity Scanner has found **zero usable
   matches in all 10 weekly runs** since July 10 — every single digest
   reads "_No solid opportunities this week._" This isn't a stack of good
   drafts nobody posted; the pipeline itself isn't surfacing anything.
   `MIN_CONFIDENCE = 3` in `draft.ts` is deliberately conservative ("a bad
   link suggestion is worse than none" — reasonable, given the account-ban
   risk of spammy Reddit links), so this could be by design rather than
   broken. Either way, don't count on this channel this week — it needs a
   separate look at the subreddit list / matching logic, not a quick post.
4. **"Daily Content Pipeline"** (auto-generates `content/news` +
   `/trending` content daily) was also manually disabled July 28, despite
   *always succeeding* every time it ran before that. Unclear why it was
   turned off — worth you confirming that was intentional before I
   re-enable it.

## What's actually driving traffic right now (verified, last 30 days, Singapore excluded)

| Channel | Active users | Engagement rate |
|---|---|---|
| Organic Search | 2,529 | 57% |
| Direct | 1,164 | 51% |
| AI Assistant (ChatGPT/Copilot/Perplexity) | 115 | 42% |
| Organic Social (Pinterest/Instagram/etc.) | 26 | 19% |

Organic Search does essentially all the work. Social is nearly nonexistent
— consistent with Pinterest never having posted and Reddit drafts never
being used. AI Assistant traffic (115 users) is real and growing *with zero
dedicated effort* — worth investing in deliberately (see Phase 3).

By content type (28-day GSC clicks):

| Type | Pages | Clicks | Impressions | CTR |
|---|---|---|---|---|
| `/visit/[city]/[month]` | 2,389 | 2,005 | 439,068 | 0.46% |
| `/news` | 48 | 29 | 2,913 | **1.00%** |
| `/itinerary` | 203 | 31 | 4,303 | 0.72% |
| `/blog` | 70 | 20 | 3,830 | 0.52% |
| `/best-time-to-visit/[city]` | 155 | 31 | 13,596 | **0.23%** |
| `/cities/[slug]` | 95 | 4 | 1,717 | **0.23%** |
| `/countries/[country]` | 57 | 0 | 3,871 | **0.00%** |

`/visit/` is confirmed as the engine (90%+ of clicks) — the Part 2 CTR fix
from 2026-09-08 targeted the right template. But `/countries/[country]`
converts **zero clicks from 3,871 impressions**, and `/best-time-to-visit/`
and `/cities/` both sit at the same ~0.23% CTR `/visit/` had *before* the
fix — almost certainly the identical generic-title problem, unfixed.

**Single biggest standalone opportunity found**: `/countries/ireland`
ranks position 10.7 for "best places to visit in ireland" — **2,945
impressions, 0 clicks**. One page, one query, nearly 3K free impressions
going nowhere.

## Phase 0 — Revenue integrity (do first, before scaling ad exposure)

1. **Wire up the 5 remaining ad slots** with real AdSense units
   (`cityTopBanner`, `citySidebar`, `cityMidContent`, `blogMidArticle`,
   `blogBottom`) — same one-line-per-slot swap as `visitMidContent`, once
   you create them in AdSense → Ads → By ad unit. This is pure upside on
   existing traffic.
2. **Unresolved from the last conversation**: Singapore/Direct bot traffic
   still isn't caught by the `navigator.webdriver` check (0 of 140 flagged
   this week), and it's landing directly on `/visit/` pages where the real
   ad unit lives. Scaling to 5 more ad units without addressing this scales
   the exposure, not just the revenue. Still your call from before — pull
   the unit / invest in real bot detection (reCAPTCHA v3) / accept the
   residual risk.

## Phase 1 — Turn on what's already built (near-zero net-new work)

1. Add `GOOGLE_SA_KEY` + `GA4_PROPERTY_ID` as **GitHub Actions repo
   secrets** (they're in `.env.local` already, just not in GH) — unblocks
   Weekly Scorecard and Daily Pulse, both currently failing every run.
2. Create a Pinterest app access token, add `PINTEREST_ACCESS_TOKEN`,
   re-enable the `Pinterest Pin Factory` workflow. 217 pins queued and
   ready.
3. ~~Post from the Reddit digests~~ — checked all 10, every one says "no
   solid opportunities." Nothing to post. See correction above.
4. Confirm whether disabling "Daily Content Pipeline" was intentional; if
   not, re-enable it.
5. Close (or let auto-close) the recycled "27 critical issues" watchdog
   issue — verified live that all originally-flagged URLs are 200 OK now;
   its only recent (Sep 12) finding is a false positive on an intentionally
   noindexed itinerary redirect stub. Harmless, but worth a look so a real
   future regression doesn't get lost in 6 comments of stale noise.

## Phase 2 — Extend the CTR fix that already worked

The Part 2 fix (inject `temp` into the title) was validated as the right
diagnosis for `/visit/`. Same pattern, same fix, two more templates:

1. `/countries/[country]` — 0.00% CTR, 3,871 impressions. Start with
   `/countries/ireland` specifically (2,945 impr, 0 clicks alone).
2. `/best-time-to-visit/[city]` — 0.23% CTR, 13,596 impressions, 155 pages.

Also: re-pull `/visit/` CTR numbers again in ~2 more weeks — too early to
read on 2026-09-18 (checked: still flat at 0.47%, expected this soon after
a title change since Google needs to re-crawl first).

## Phase 3 — New investment, in priority order

1. **AI-assistant SEO**: 115 users/month with zero dedicated effort is a
   real, cheap-to-grow signal — structured data + answer-first content
   patterns (schema is already solid on `/visit/`; extend FAQPage/ItemList
   coverage to `/countries/` and `/cities/` too).
2. **Zone 4 content expansion**: `docs/city-expansion-backlog-200.md` has
   ~212 more candidate cities queued. `/visit/` is the proven engine —
   more authored month pages in this exact format is the least risky way
   to add organic surface area.
3. **`/news` has the best CTR of any content type (1.00%)** on modest
   volume (48 pages) — worth a higher publishing cadence via the
   `/news-writer` skill or the (currently disabled) Daily Content Pipeline.

## What I need from you to keep moving

- Confirm you want Phase 1's re-enables (Pinterest, Daily Content
  Pipeline) — I won't flip automation back on without you saying so, since
  disabling them was a deliberate past action even if the reason isn't
  recorded.
- The Phase 0 bot-exposure decision, still open from last time.
- Once those are settled, I can start Phase 2 (the `/countries/` and
  `/best-time-to-visit/` CTR fixes) immediately — that part needs no
  decision from you, just time.
