# TripGenius Marketing Automation

Four pipelines, all running on GitHub Actions cron — zero servers. Outputs land as
GitHub Issues (check your notifications) and committed report files.

| Pipeline | Schedule | Output | Secrets needed |
|---|---|---|---|
| [seo-watchdog](seo-watchdog/) | daily 03:00 UTC | Issue on critical regressions (`seo-watchdog` label) | none |
| [scorecard](scorecard/) | Mondays 04:00 UTC | Weekly scorecard issue (`scorecard`) + `history.csv` trendline | `GOOGLE_SA_KEY`, `GA4_PROPERTY_ID` |
| [pinterest](pinterest/) | Mon–Fri 14:30 UTC (20:00 IST) | 1 pin/day published via Pinterest API v5 | `PINTEREST_ACCESS_TOKEN` |
| [reddit](reddit/) | Fridays 12:00 UTC | Digest issue with drafted answers (`reddit-digest`) — **never posts** | `ANTHROPIC_API_KEY` (+ optional Reddit script-app creds) |

## One-time setup (GitHub → Settings → Secrets → Actions)

1. **`GOOGLE_SA_KEY`** — Google Cloud Console → project `tripgenius-automation` →
   enable *Search Console API* + *Google Analytics Data API* → create a service
   account → download the JSON key → base64-encode it (`base64 -w0 key.json`).
   Then add the service-account email as a user in GSC (Settings → Users, Full)
   and GA4 (Admin → Property access, Viewer).
2. **`GA4_PROPERTY_ID`** — the numeric GA4 property id.
3. **`PINTEREST_ACCESS_TOKEN`** — long-lived token from your Pinterest OAuth app
   with `pins:write, boards:read, boards:write` scopes.
4. **`ANTHROPIC_API_KEY`** — for the Reddit answer drafts (~10 short calls/week).
5. **`REDDIT_CLIENT_ID` / `REDDIT_CLIENT_SECRET` / `REDDIT_USERNAME` / `REDDIT_PASSWORD`**
   — optional; from reddit.com/prefs/apps (script app). Without them the scanner
   uses the slower public JSON endpoints.

## Local testing

Everything runs with `npx tsx` and reads the same env vars:

```sh
npx tsx automation/seo-watchdog/check.ts                 # no secrets needed
npx tsx automation/scorecard/report.ts --dry-run         # needs GOOGLE_SA_KEY + GA4_PROPERTY_ID
npx tsx automation/pinterest/build-queue.ts              # no secrets needed
npx tsx automation/pinterest/publish.ts --dry-run        # renders image, prints payload
npx tsx automation/reddit/draft.ts --dry-run             # needs ANTHROPIC_API_KEY
```

## What stays manual (by design)

- **Posting Reddit answers** — the digest drafts them; you personalize and post
  (max 3–4/week, keep answering some threads without links).
- **Acting on scorecard opportunities** — the issue tells you *what*; title
  tweaks remain a judgment call.
- **Pinterest design changes** — edit `pinterest/render.ts` templates; test with
  `npx tsx automation/pinterest/render.ts <slug>`.
