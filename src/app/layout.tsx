import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import MotionProvider from "@/components/MotionProvider";
import Schema from "@/components/Schema";
import "flag-icons/css/flag-icons.min.css";
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
    `Free travel guides for 70+ cities across India, Asia, Europe & the Americas. Find the best time to visit, things to do, budget breakdowns, and local insider tips for Bali, Delhi, Jaipur, Tokyo, Paris and more.`,
  metadataBase: new URL(SITE),
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "TripGenius",
    url: SITE,
    title: `TripGenius — Free Travel Guides for India & the World`,
    description: `Free travel guides for 70+ cities. Best time to visit, budget, things to do, and hidden gems — India, Asia, Europe & beyond.`,
    images: [{ url: `${SITE}/opengraph-image`, width: 1200, height: 630, alt: "TripGenius — Free Travel Guides" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tripgenius_in",
    title: "TripGenius — Free Travel Guides for India & the World",
    description: "Free travel guides for 70+ cities. Best time to visit, budget, things to do, and hidden gems.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {/* Google AdSense */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
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
              description: 'Free travel guides for 70+ cities worldwide.',
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
