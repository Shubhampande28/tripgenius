# Vercel Setup — crons, dashboard, email alerts

The site is hosted on Vercel, so deploys are automatic (every push to `main`
goes live) and `vercel.json` crons fire the Instagram route. This doc covers
the env vars and storage the automation layer needs.

> Self-hosting on a VPS instead? See `vps-setup.md`.

## 1. Environment variables

Vercel Dashboard → your project → **Settings → Environment Variables**
(environment: Production), then **redeploy**:

```
CRON_SECRET=<random string — openssl rand -hex 24>
ADMIN_KEY=<another random string — your /admin password>
RESEND_API_KEY=<from resend.com — free account, 100 emails/day>
NOTIFY_EMAIL_TO=shubham.pande1008@gmail.com
INSTAGRAM_ACCESS_TOKEN=<IG Graph API long-lived token>
INSTAGRAM_BUSINESS_ACCOUNT_ID=<numeric id>
```

Vercel Cron automatically sends `Authorization: Bearer <CRON_SECRET>` to cron
invocations once `CRON_SECRET` is set — no extra wiring.

Also add **`CRON_SECRET`** (same value) as a **GitHub repo secret** — the four
GitHub Actions pipelines use it to report runs to the dashboard.

## 2. Activity-log storage (required on Vercel)

Serverless functions have no persistent disk, so the activity log lives in
Redis: Vercel Dashboard → **Storage → Create Database → Upstash for Redis**
(free tier) → connect it to the project. The integration injects
`KV_REST_API_URL` / `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_*`), which
`src/lib/activityLog.ts` picks up automatically. Without it, email alerts
still work but the /admin history is empty.

## 3. Cron schedule & plan limits

`vercel.json` defines 3 daily Instagram slots (09:00 / 14:00 / 20:00 IST).
⚠️ On the **Hobby plan, Vercel allows max 2 cron jobs, each once per day**
(fired within an hour window). If the deploy warns about cron limits or slots
don't run: either upgrade to Pro (exact 3×/day) or trim `vercel.json` to a
single daily entry and accept 1 post/day.

## 4. What lands where

| Event | /admin dashboard | Email |
|---|---|---|
| Instagram post (each slot) | ✅ | ✅ |
| Pinterest pin (GitHub Actions) | ✅ | ✅ |
| SEO watchdog daily result | ✅ | ✅ |
| Weekly scorecard / Reddit digest | ✅ | ✅ |
| News articles | listed from content/news | — (visible on /news after auto-deploy) |

Dashboard: **https://www.tripgenius.in/admin?key=YOUR_ADMIN_KEY** — noindexed
and unlinked; bookmark it. Health chips turn amber/red when a pipeline hasn't
reported within its expected interval or last failed.

## 5. Test

```sh
curl -H "Authorization: Bearer $CRON_SECRET" "https://www.tripgenius.in/api/social/daily?dry=1"

curl -X POST https://www.tripgenius.in/api/admin/log \
  -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" \
  -d '{"source":"other","status":"ok","title":"Dashboard test event"}'
```

The second command should email you and appear on /admin within seconds.
