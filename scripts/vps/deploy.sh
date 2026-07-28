#!/usr/bin/env bash
# TripGenius VPS auto-deploy. Run from cron every 10 minutes:
#   */10 * * * * /var/www/tripgenius/scripts/vps/deploy.sh >> /var/log/tripgenius-deploy.log 2>&1
#
# Pulls main; if new commits arrived, rebuilds and restarts the app, and
# reports the deploy (and any news articles that came with it) to the admin
# dashboard + email via /api/admin/log.
#
# Configure via env or edit the defaults below:
#   APP_DIR      — repo path on the server
#   RESTART_CMD  — how to restart the app (pm2, systemd, …)
#   CRON_SECRET  — same value as in the app's .env.local (for reporting)

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/tripgenius}"
RESTART_CMD="${RESTART_CMD:-pm2 restart tripgenius}"
SITE_URL="${SITE_URL:-https://www.tripgenius.in}"

cd "$APP_DIR"

# Load CRON_SECRET from .env.local if not already in the environment.
if [ -z "${CRON_SECRET:-}" ] && [ -f .env.local ]; then
  CRON_SECRET=$(grep -E '^CRON_SECRET=' .env.local | cut -d= -f2- | tr -d '"' || true)
fi

report() { # report <status> <title> [detail]
  [ -z "${CRON_SECRET:-}" ] && return 0
  curl -s -m 15 -X POST "$SITE_URL/api/admin/log" \
    -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" \
    -d "{\"source\":\"deploy\",\"status\":\"$1\",\"title\":\"$2\",\"detail\":\"${3:-}\"}" > /dev/null || true
}

git fetch origin main -q
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
  exit 0   # nothing new — stay silent
fi

echo "[$(date -Is)] Deploying $LOCAL -> $REMOTE"
git pull --rebase origin main -q

# Detect news articles in the incoming commits (published by the cloud routine).
NEWS_FILES=$(git diff --name-only "$LOCAL" "$REMOTE" -- content/news | grep -c '\.md$' || true)

npm ci --silent 2>/dev/null || npm install --silent
if npm run build; then
  $RESTART_CMD
  SHORT=$(git log -1 --pretty='%h %s' | head -c 100)
  report ok "Deployed: $SHORT"
  if [ "${NEWS_FILES:-0}" -gt 0 ]; then
    curl -s -m 15 -X POST "$SITE_URL/api/admin/log" \
      -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" \
      -d "{\"source\":\"news\",\"status\":\"ok\",\"title\":\"$NEWS_FILES new news article(s) published\",\"url\":\"$SITE_URL/news\"}" > /dev/null || true
  fi
  echo "[$(date -Is)] Deploy OK"
else
  report error "Deploy FAILED at build step" "commit $REMOTE — site still running previous build"
  echo "[$(date -Is)] Build failed — app not restarted"
  exit 1
fi
