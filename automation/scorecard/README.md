# Weekly Scorecard

Pulls Search Console + GA4 every Monday and delivers the campaign scorecard as
a GitHub Issue (previous week's issue is auto-closed), with one row per week
appended to `history.csv` for a long-term trendline.

Windows: last 7 full days vs the 7 before, both ending 3 days ago (GSC lag).

Report sections: headline WoW table (clicks, CTR, /itinerary/ CTR, /visit/ CTR,
Pinterest/Reddit/AI sessions, engagement rate), sessions by channel,
**opportunities** (queries with ≥20 impressions, 0 clicks, position ≤ 12 — one
title tweak from real traffic), anomalies (>30% click drop, pages that lost all
clicks), top queries/pages, top GA4 landing pages.

Setup: `GOOGLE_SA_KEY` (base64 service-account JSON; the SA email needs GSC
Full + GA4 Viewer access) and `GA4_PROPERTY_ID` secrets — see `../README.md`.

Local test: `npx tsx automation/scorecard/report.ts --dry-run`
