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
    default: "TripGenius — Premium Travel Guides",
    template: "%s | TripGenius",
  },
  description:
    "Deep-dive travel guides for every kind of explorer. Hotels, restaurants, transport tips, and insider knowledge for Bali, Tokyo, Paris, and beyond.",
  keywords: ["travel guide", "city guide", "where to stay", "where to eat", "travel tips", "vacation planning"],
  metadataBase: new URL("https://www.tripgenius.in"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TripGenius",
    url: "https://www.tripgenius.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
