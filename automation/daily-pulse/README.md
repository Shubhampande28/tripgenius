# Daily Pulse

Every day at 21:00 IST, pulls the same GA4 + Search Console data as the
Weekly Scorecard — rolling last 7 full days vs the 7 before, both ending 3
days ago for GSC's reporting lag — and asks Claude for a short, honest read
on what actually moved and whether it's a real signal given the traffic
volume. Delivered to [/admin](https://www.tripgenius.in/admin) and email
(same delivery path as every other pipeline), not a GitHub issue — a daily
issue would just be noise in your notifications.

Why the same 7-day window every day instead of yesterday-vs-day-before:
TripGenius's daily click volume is small enough (single digits outside
India) that a literal one-day delta is mostly noise — "0 vs 1 click" reads as
an "infinite%" swing that means nothing. Recomputing the rolling week daily
smooths that out while still catching real trend shifts within a day.

Setup: same `GOOGLE_SA_KEY` + `GA4_PROPERTY_ID` as `../scorecard/` (the two
pipelines share one collector, `../scorecard/collect.ts`) — see `../README.md`.
Also needs `ANTHROPIC_API_KEY` for the written read; without it, the pipeline
still runs and reports the raw numbers, just without the narrative paragraph.

Local test: `npx tsx automation/daily-pulse/report.ts --dry-run` (skips the
Claude call, prints the report to stdout, writes nothing).
