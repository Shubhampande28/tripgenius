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

export const metadata: Metadata = {
  title: {
    default: "TripGenius — Travel Guides for Every City",
    template: "%s | TripGenius",
  },
  description:
    "Free travel guides for 60+ cities worldwide. Best time to visit, neighbourhoods, things to do, budget breakdown, and insider tips — for Bali, Tokyo, Paris, Delhi, Mumbai and beyond.",
  keywords: [
    "travel guide", "city guide", "best time to visit", "things to do",
    "travel tips", "vacation planning", "India travel", "Europe travel",
    "Asia travel", "budget travel", "luxury travel", "TripGenius",
  ],
  metadataBase: new URL("https://www.tripgenius.in"),
  alternates: { canonical: "https://www.tripgenius.in" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TripGenius",
    url: "https://www.tripgenius.in",
    title: "TripGenius — Travel Guides for Every City",
    description: "Free travel guides for 60+ cities. Best time to visit, budget, things to do, and hidden gems.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "TripGenius Travel Guides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TripGenius — Travel Guides for Every City",
    description: "Free travel guides for 60+ cities. Best time to visit, budget, things to do, and hidden gems.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
