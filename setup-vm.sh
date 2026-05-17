#!/bin/bash
# TripGenius - Hostinger VM Setup Script
# Safe to run alongside existing projects on the same VM

set -e

REPO="https://github.com/Shubhampande28/tripgenius.git"
APP_DIR="/var/www/tripgenius"
DOMAIN="tripgenius.in"
EMAIL="shubham.pande1008@gmail.com"
PORT=3001   # Using 3001 to avoid conflict with any app already on 3000

echo ""
echo "=========================================="
echo "  TripGenius VM Setup - tripgenius.in    "
echo "=========================================="
echo ""

# ── 1. Update system packages only ───────────────────────────────────────────
echo "[1/7] Installing required packages..."
apt-get update -qq
# Only install what's missing - won't touch existing packages
apt-get install -y -qq git curl nginx certbot python3-certbot-nginx
echo "Packages ready."

# ── 2. Node.js - install only if missing, NEVER downgrade/upgrade ─────────────
echo "[2/7] Checking Node.js..."
if command -v node &> /dev/null; then
    echo "Node $(node -v) already installed - keeping it as-is to protect your other project."
else
    echo "Node.js not found, installing v22..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
    echo "Node $(node -v) installed."
fi

# ── 3. Install PM2 if missing (safe - multiple apps can run under PM2) ────────
echo "[3/7] Checking PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2 --silent
    echo "PM2 installed."
else
    echo "PM2 already running - your existing processes are untouched."
fi

# ── 4. Clone and build TripGenius ─────────────────────────────────────────────
echo "[4/7] Setting up TripGenius app..."
mkdir -p $APP_DIR
if [ -d "$APP_DIR/.git" ]; then
    echo "Repo exists - pulling latest..."
    cd $APP_DIR && git pull
else
    git clone $REPO $APP_DIR
    cd $APP_DIR
fi

cd $APP_DIR
npm install --silent
npm run build
echo "Build complete."

# ── 5. Start with PM2 on port 3001 ────────────────────────────────────────────
echo "[5/7] Starting TripGenius on port $PORT..."
# Only restarts tripgenius - existing pm2 apps stay running
pm2 delete tripgenius 2>/dev/null || true
PORT=$PORT pm2 start npm --name "tripgenius" -- start
pm2 save
echo "TripGenius running on port $PORT."
echo "Your other PM2 apps are still running:"
pm2 list

# ── 6. Nginx - add tripgenius config, leave all other configs alone ────────────
echo "[6/7] Adding Nginx config for $DOMAIN..."
cat > /etc/nginx/sites-available/tripgenius << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Only enable tripgenius - never touch other sites
ln -sf /etc/nginx/sites-available/tripgenius /etc/nginx/sites-enabled/tripgenius
# NOTE: NOT removing default or any other sites - your other project stays live
nginx -t && systemctl reload nginx
echo "Nginx updated (your other sites untouched)."

# ── 7. SSL for tripgenius.in only ─────────────────────────────────────────────
echo "[7/7] Getting SSL for $DOMAIN..."
certbot --nginx \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect
echo "SSL installed for $DOMAIN only."

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "=========================================="
echo "  TripGenius is LIVE!                    "
echo "=========================================="
echo ""
echo "  URL      : https://$DOMAIN"
echo "  Port     : $PORT (safe, not 3000)"
echo "  Logs     : pm2 logs tripgenius"
echo "  Restart  : pm2 restart tripgenius"
echo ""
echo "  Your other project is still running."
echo "  Check with: pm2 list"
echo ""
echo "  GoDaddy DNS records to add:"
echo "  Type: A   Name: @    Value: 187.127.159.193"
echo "  Type: A   Name: www  Value: 187.127.159.193"
echo ""
