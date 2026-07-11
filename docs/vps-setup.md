# VPS Setup — deploys, crons, dashboard, email

The site runs on your own VPS, so three things Vercel used to do (or would have
done) are now the server's job: **deploying on git push**, **firing the social
cron**, and there's now an **/admin dashboard + email alerts** to watch it all.

## 1. Environment variables (`.env.local` in the app directory)

```
# existing Instagram/planner vars, plus:
CRON_SECRET=<random string — openssl rand -hex 24>
ADMIN_KEY=<another random string — this is your /admin password>
RESEND_API_KEY=<from resend.com — free account, 100 emails/day>
NOTIFY_EMAIL_TO=shubham.pande1008@gmail.com
INSTAGRAM_ACCESS_TOKEN=<IG Graph API long-lived token>
INSTAGRAM_BUSINESS_ACCOUNT_ID=<numeric id>
```

After editing: `npm run build && pm2 restart tripgenius` (or your restart command).

Also add **`CRON_SECRET`** (same value) as a GitHub repo secret — the four
GitHub Actions pipelines use it to report their runs to the dashboard.

## 2. Crontab (run `crontab -e` on the VPS)

```cron
# Auto-deploy: pull main, rebuild + restart when new commits arrive
*/10 * * * * APP_DIR=/var/www/tripgenius /var/www/tripgenius/scripts/vps/deploy.sh >> /var/log/tripgenius-deploy.log 2>&1

# Instagram: 3 slots/day (09:00 / 14:00 / 20:00 IST = 03:30 / 08:30 / 14:30 UTC)
# — adjust the hours if your server's timezone isn't UTC (check with `date`).
30 3,8,14 * * * curl -s -H "Authorization: Bearer $(grep '^CRON_SECRET=' /var/www/tripgenius/.env.local | cut -d= -f2)" "https://www.tripgenius.in/api/social/daily" > /dev/null
```

Adjust `/var/www/tripgenius` to wherever the repo lives, and make the deploy
script executable once: `chmod +x scripts/vps/deploy.sh`.

The `vercel.json` crons file is inert on a VPS — crontab above replaces it.

## 3. What lands where

| Event | Dashboard (/admin) | Email | Also |
|---|---|---|---|
| Instagram post (each slot) | ✅ | ✅ | — |
| News articles deployed | ✅ | ✅ | /news |
| Site deploy (success/failure) | ✅ | ✅ | deploy log |
| Pinterest pin (GitHub Actions) | ✅ | ✅ | queue.json commit |
| SEO watchdog daily result | ✅ | ✅ | issue on criticals |
| Weekly scorecard | ✅ | ✅ | GitHub issue |
| Weekly Reddit digest | ✅ | ✅ | GitHub issue |

Dashboard: **https://www.tripgenius.in/admin?key=YOUR_ADMIN_KEY** (bookmark it;
it's noindexed and unlinked). Health chips turn amber/red when a pipeline
hasn't reported within its expected interval or last failed.

Email sender note: without a verified domain, Resend sends from
`onboarding@resend.dev` — fine for personal alerts. To send from
`alerts@tripgenius.in`, verify the domain in Resend and set `NOTIFY_EMAIL_FROM`.

## 4. Test it

```sh
# from the VPS, after setting env + rebuild:
curl -H "Authorization: Bearer $CRON_SECRET" "https://www.tripgenius.in/api/social/daily?dry=1"
curl -X POST https://www.tripgenius.in/api/admin/log \
  -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" \
  -d '{"source":"other","status":"ok","title":"Dashboard test event"}'
```

The second command should email you and show up on /admin within seconds.
