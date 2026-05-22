import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
    `Free travel guides for 160+ cities across India, Asia, Europe & the Americas. Find the best time to visit, things to do, budget breakdowns, and local insider tips for Bali, Delhi, Jaipur, Tokyo, Paris and more.`,
  keywords: [
    "travel guide", "city travel guide", "best time to visit India",
    "things to do in India", "India travel tips", "Rajasthan travel",
    "Kerala travel guide", "Himachal Pradesh travel", "budget travel India",
    "Asia travel guide", "Europe city guide", "TripGenius",
    "free travel guide", "trip planning", `travel guide ${YEAR}`,
  ],
  metadataBase: new URL(SITE),
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "TripGenius",
    url: SITE,
    title: `TripGenius — Free Travel Guides for India & the World`,
    description: `Free travel guides for 160+ cities. Best time to visit, budget, things to do, and hidden gems — India, Asia, Europe & beyond.`,
    images: [{ url: `${SITE}/og-default.png`, width: 1200, height: 630, alt: "TripGenius — Free Travel Guides" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tripgenius_in",
    title: "TripGenius — Free Travel Guides for India & the World",
    description: "Free travel guides for 160+ cities. Best time to visit, budget, things to do, and hidden gems.",
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
    // Add when you get Google Search Console verification code:
    // google: "your-verification-code",
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
        {/* Preconnect to critical third-party domains */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://www.booking.com" />
        <link rel="dns-prefetch" href="https://www.skyscanner.net" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        {/* Site-wide Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TripGenius',
              url: SITE,
              logo: `${SITE}/icon.png`,
              sameAs: [],
              description: 'Free travel guides for 160+ cities worldwide.',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: SITE,
              name: 'TripGenius',
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/cities?q={search_term_string}` },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
