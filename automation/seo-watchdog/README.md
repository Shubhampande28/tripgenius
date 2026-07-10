# SEO Watchdog

Daily regression guard for tripgenius.in. Samples the live sitemap (10 random
URLs per child sitemap + a fixed critical list) and checks each page for:

- **CRITICAL** (fails the run, opens/updates a GitHub Issue): non-200 status,
  `noindex` in meta or `X-Robots-Tag`, missing canonical, canonical ≠ URL.
- **WARNING** (logged only): title missing/15–60-char bounds/duplicated within
  the sample, meta description missing/50–155 chars, invalid or missing JSON-LD
  (`ItemList`+`FAQPage` expected on `/itinerary/`, `FAQPage` on `/visit/`),
  H1 count ≠ 1.

Run locally: `npx tsx automation/seo-watchdog/check.ts` (exit 1 on criticals).
Report: `last-report.json` next to the script.

**Adding URLs:** append to `CRITICAL_URLS` in `check.ts` — those are checked on
every run regardless of the random sample.
