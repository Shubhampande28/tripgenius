# GA4 Singapore bot traffic — diagnosis & fix (2026-09-08)

## What was found

Singapore accounted for 549 of 2,755 active users (20%) in the Aug 10–Sep 6,
2026 GA4 window — more than Bengaluru + Delhi combined. Confirmed as
automated traffic, not a diaspora/expat audience, on four independent
signals pulled via the GA4 Data API (see `automation/scorecard/collect.ts`
for the query patterns):

| Signal | Singapore | Rest of site |
|---|---|---|
| Channel | 97% Direct/(none), no referrer | ~54% Direct |
| Browser/OS | 88% desktop Chrome on Macintosh | mixed, mobile-heavy |
| Pages/session | ~1.0 on almost every landing page | 1.28 avg |
| Engagement rate | 31.6% | 41% site-wide |

**Pattern:** not a single spike, not a steady drip — both. A burst of
~1,100 users on 2026-07-30/31, a low ongoing baseline (15–50/day), and
periodic bursts since (e.g. 2026-09-02: 174 users, 101 of them landing on
`/blog`, the rest scattered one-by-one across ~15 other blog/visit pages —
consistent with a script working through the sitemap/blog index).

**Why it can't be IP-filtered:** GA4 does not expose IP addresses at all,
even to admins — Admin → Data Settings → Data Filters → Internal Traffic
has nothing to key on. It also isn't caught by GA4's built-in "known bots
and spiders" exclusion (on by default) because it presents as a normal
Chrome session — most likely headless Chromium (Playwright/Puppeteer),
which uses the real browser networking stack and sends normal-looking
headers, not an old-school scraper user agent.

## Fix shipped

Two problems, two different fixes — GA4 filters only affect *reporting*,
they never stop an ad from being served, so protecting AdSense had to
happen in the app itself:

### 1. Stop bots from ever loading ads (AdSense protection)

- **`src/proxy.ts`** (Next.js 16 renamed Middleware to Proxy — see
  `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`):
  flags requests whose User-Agent is a literal HTTP-library/headless-tool
  string (curl, python-requests, HeadlessChrome, Selenium, ...) via an
  `x-tg-bot-suspected` request header. Known good crawlers (Googlebot,
  Bingbot, GPTBot, social link-preview bots, ...) are explicitly exempted
  so indexing/previews are unaffected. This never blocks a request — a
  false positive just means that one request doesn't get an ad, nothing
  breaks.
- **`src/app/layout.tsx`**: adds a client-side check for
  `navigator.webdriver` (the WebDriver spec flag every automation
  framework — Selenium, Playwright, Puppeteer — sets on the page) plus a
  couple of headless fingerprints. This is the layer that actually catches
  the Singapore pattern, since it disguises itself as real Chrome at the
  network level. The AdSense script (`adsbygoogle.js`) is only injected
  when neither the server nor the client check flags the session.
  `AdUnit.tsx`'s existing `window.adsbygoogle.push({})` queue pattern means
  ad slots on the page simply queue and never render for flagged sessions
  — no visible breakage, no ad request ever fires.
- Every session (flagged or not) is also tagged with a
  `bot_suspected: 'true'|'false'` GA4 user property, set before `gtag('config', ...)`
  fires. This makes future reporting exact instead of a country-based
  guess — see the one-time Admin step below.

### 2. Report the correct number going forward

- **`automation/scorecard/collect.ts` / `report.ts`**: the weekly scorecard
  (blocked since 2026-07-10 pending secrets — see
  `tripgenius-automation-stack` memory; secrets were added 2026-09-07) now
  reports both `Active users (raw)` and `Active users (bot-adjusted)`
  (excludes `country=Singapore AND channel=Direct`) in its headline table,
  logs an anomaly if bot-suspected share exceeds 15% of raw active users in
  a week, and tracks both columns in `history.csv` for trend.

## One-time manual step (GA4 Admin — not scriptable)

Register the `bot_suspected` user property as a custom dimension so it's
queryable in Explore/reports (this only applies to data collected *after*
registration — it doesn't backfill history, which is why the country+Direct
proxy filter above stays as the reporting-level fallback for historical
comparisons):

1. GA4 → Admin → **Custom definitions** → **Create custom dimensions**.
2. Dimension name: `Bot Suspected`. Scope: **User**. User property:
   `bot_suspected`. Save.
3. Takes a few hours to start appearing in Explore after first data lands.

## Immediate reporting workaround (historical data, before the tag existed)

For any GA4 report/decision covering dates before this fix shipped, build a
comparison in Explore rather than trusting raw totals:

1. GA4 → Explore → **+ Blank** (or open an existing exploration).
2. Under **Segments**, **+ New segment** → name it `Bot-adjusted (excl. SG + Direct)`.
3. Add condition: `Country` **does not exactly match** `Singapore`, AND
   `Session default channel group` **does not exactly match** `Direct`.
4. Apply it as a comparison alongside "All Users" so both raw and clean
   numbers are visible side by side before any revenue/monetization call.

## What this deliberately does not do

- Does not block Singapore visitors, IP ranges, or any country — the
  detection is behavioral (automation fingerprint), not geographic, so a
  real Singapore-based reader is unaffected.
- Does not touch AdSense account settings, ads.txt, or ad unit
  configuration (ads.txt was checked and is correctly configured:
  `google.com, pub-9077452318851477, DIRECT, f08c47fec0942fa0`).
- Does not delete or hide any GA4 data — both raw and adjusted numbers
  remain visible everywhere.
