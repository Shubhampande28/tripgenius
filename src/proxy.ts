import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Server-side first line of defense against non-browser traffic reaching
// pages that serve AdSense ads. This does NOT block anything — a false
// positive here should never break a real visitor's page load. It only
// stamps a request header that layout.tsx reads (via next/headers) to skip
// loading the AdSense script for the request. GA4 tagging is unaffected —
// these clients rarely execute JS anyway, so this mainly stops the small
// slice of scripted traffic that does.
//
// This is deliberately narrow: literal automation/HTTP-library user agents,
// not a country or ISP block (see docs/ga4-bot-traffic-2026-09.md for why —
// headless-Chromium traffic disguises its UA as real Chrome and isn't
// catchable this way; that's handled client-side in layout.tsx instead).
//
// Known good crawlers (search engines, social link previews) are explicitly
// exempted — we want them indexing the site and generating rich previews,
// just not triggering ad impressions.

const BOT_UA_PATTERNS = [
  /curl\//i,
  /wget/i,
  /python-requests/i,
  /python-urllib/i,
  /go-http-client/i,
  /okhttp/i,
  /axios\//i,
  /node-fetch/i,
  /HeadlessChrome/i,
  /PhantomJS/i,
  /Selenium/i,
  /scrapy/i,
  /^Mozilla\/5\.0$/i, // bare/truncated UA some scripts send verbatim
];

const ALLOWED_CRAWLER_PATTERNS = [
  /googlebot/i,
  /google-inspectiontool/i,
  /bingbot/i,
  /duckduckbot/i,
  /slurp/i, // Yahoo
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /pinterest/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /applebot/i,
  /gptbot/i,
  /chatgpt-user/i,
  /perplexitybot/i,
  /oai-searchbot/i,
];

export function proxy(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? '';

  const isAllowedCrawler = ALLOWED_CRAWLER_PATTERNS.some((p) => p.test(ua));
  const looksLikeScriptedClient = !isAllowedCrawler && BOT_UA_PATTERNS.some((p) => p.test(ua));

  if (!looksLikeScriptedClient) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tg-bot-suspected', '1');
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Run on all page requests; skip static assets, images, and API routes.
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|ads.txt|.*\\.(?:png|jpg|jpeg|webp|svg|ico|xml|txt|json)$).*)',
  ],
};
