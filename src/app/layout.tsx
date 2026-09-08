import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import MotionProvider from "@/components/MotionProvider";
import Schema from "@/components/Schema";
import { REAL_CITY_COUNT } from "@/lib/siteStats";
import "./globals.css";

const GA_ID = "G-GZN2V0V66B";
const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID ?? 'ca-pub-9077452318851477';

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE = "https://www.tripgenius.in";
const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: {
    default: `TripGenius — Free Travel Guides for India & the World (${YEAR})`,
    template: "%s | TripGenius",
  },
  description:
    `Free travel guides for ${REAL_CITY_COUNT} cities across India, Asia, Europe & the Americas. Find the best time to visit, things to do, budget breakdowns, and local insider tips for Bali, Delhi, Jaipur, Tokyo, Paris and more.`,
  metadataBase: new URL(SITE),
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "TripGenius",
    url: SITE,
    title: `TripGenius — Free Travel Guides for India & the World`,
    description: `Free travel guides for ${REAL_CITY_COUNT} cities. Best time to visit, budget, things to do, and hidden gems — India, Asia, Europe & beyond.`,
    images: [{ url: `${SITE}/opengraph-image`, width: 1200, height: 630, alt: "TripGenius — Free Travel Guides" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tripgenius_in",
    title: "TripGenius — Free Travel Guides for India & the World",
    description: `Free travel guides for ${REAL_CITY_COUNT} cities. Best time to visit, budget, things to do, and hidden gems.`,
    images: [`${SITE}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true, follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "4WZXL1e7N4MKzIyyIlMrmHcFrwFiHCoCxqx0ofNoy_o",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set by src/proxy.ts for requests whose User-Agent is a literal HTTP
  // library or headless-tool string (curl, python-requests, HeadlessChrome,
  // ...). Server-known bots skip AdSense entirely; a second, client-side
  // check below catches headless-Chromium traffic that spoofs a normal
  // Chrome UA (undetectable from headers alone — see docs/ga4-bot-traffic-2026-09.md).
  const serverBotSuspected = (await headers()).get('x-tg-bot-suspected') === '1';

  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <head>
        {/* Prevent flash of wrong theme — runs before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('theme')!=='dark')document.documentElement.classList.add('light')}catch(e){document.documentElement.classList.add('light')}` }} />
        <meta name="google-site-verification" content="4WZXL1e7N4MKzIyyIlMrmHcFrwFiHCoCxqx0ofNoy_o" />
        <meta name="msvalidate.01" content="ED1E607D630093AB06C9193DB2F7ADC8" />
        {/* AdSense ownership verification — inline in <head> so Google crawler always finds it */}
        <meta name="google-adsense-account" content={ADSENSE_PUB_ID} />
        {/* Preconnect to critical third-party domains */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://www.booking.com" />
        <link rel="dns-prefetch" href="https://www.skyscanner.net" />
      </head>
      <body className="min-h-screen antialiased">
        {/* Bot heuristic — runs before GA/AdSense init. Flags sessions where
            the browser reports automation (navigator.webdriver, the
            WebDriver spec flag every major automation framework sets:
            Selenium, Playwright, Puppeteer) or has other headless
            fingerprints. This is what catches the disguised-Chrome bot
            traffic that a server-side UA check can't — see
            docs/ga4-bot-traffic-2026-09.md. Tagged as a GA4 user property
            so reporting can filter it going forward without guessing by
            country. */}
        <Script id="tg-bot-check" strategy="beforeInteractive">{`
          (function () {
            try {
              var nav = navigator;
              var flags = [
                !!nav.webdriver,
                nav.languages && nav.languages.length === 0,
                /Chrome/.test(nav.userAgent) && typeof window.chrome === 'undefined',
              ];
              window.__tgBotSuspected = ${serverBotSuspected ? 'true' : 'false'} || flags.some(Boolean);
            } catch (e) {
              window.__tgBotSuspected = ${serverBotSuspected ? 'true' : 'false'};
            }
          })();
        `}</Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('set', 'user_properties', { bot_suspected: window.__tgBotSuspected ? 'true' : 'false' });
          gtag('config', '${GA_ID}');
        `}</Script>
        {/* Google AdSense — skipped entirely for sessions flagged above, so
            bot traffic never generates an ad impression/click. */}
        <Script id="tg-adsense-loader" strategy="afterInteractive">{`
          if (!window.__tgBotSuspected) {
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}';
            s.crossOrigin = 'anonymous';
            document.body.appendChild(s);
          }
        `}</Script>
        <MotionProvider>{children}</MotionProvider>
        {/* Site-wide Organization + WebSite structured data */}
        <Schema
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': `${SITE}/#organization`,
              name: 'TripGenius',
              url: SITE,
              logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
              sameAs: [
                'https://x.com/tripgenius_in',
                'https://twitter.com/tripgenius_in',
                'https://www.instagram.com/tripgenius_in',
                'https://www.pinterest.com/tripgenius_in',
              ],
              description: `Free travel guides for ${REAL_CITY_COUNT} cities worldwide.`,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': `${SITE}/#website`,
              url: SITE,
              name: 'TripGenius',
              publisher: { '@id': `${SITE}/#organization` },
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/cities?q={search_term_string}` },
                'query-input': 'required name=search_term_string',
              },
            },
          ]}
        />
      </body>
    </html>
  );
}
