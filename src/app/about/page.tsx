import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, Globe, BookOpen, Shield, Heart, TrendingUp, Search, RefreshCw, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: 'About TripGenius — Editorial Standards & Research Process',
  description: 'Learn how TripGenius researches and writes travel guides. Our editorial process, fact-checking standards, and commitment to honest, up-to-date information for 160+ destinations.',
  alternates: { canonical: `${BASE}/about` },
  openGraph: {
    title: 'About TripGenius — Honest Travel Guides for Every Destination',
    description: 'Free, honest, and up-to-date travel guides for 140+ destinations. No paid rankings, no fluff.',
    url: `${BASE}/about`,
    siteName: 'TripGenius',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About TripGenius — Honest Travel Guides for Every Destination',
    description: 'Free, honest, and up-to-date travel guides for 140+ destinations. No paid rankings, no fluff.',
  },
};

const values = [
  {
    icon: Shield,
    title: 'Always Honest',
    desc: 'We never accept payment for rankings or "sponsored" guide positions. Every recommendation reflects genuine experience and research.',
  },
  {
    icon: BookOpen,
    title: 'Always Free',
    desc: 'Every guide on TripGenius is free to read, forever. Great travel information shouldn\'t be locked behind a paywall.',
  },
  {
    icon: TrendingUp,
    title: 'Always Updated',
    desc: 'Travel changes fast. We regularly update our guides with current prices, visa rules, and seasonal tips so you\'re never caught off-guard.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    desc: 'From hidden Indian gems to iconic world cities — we\'re building the most comprehensive free travel guide on the internet.',
  },
  {
    icon: Heart,
    title: 'Built for Travellers',
    desc: 'Every section is written for real people planning real trips — not for search engines or advertisers.',
  },
  {
    icon: Compass,
    title: 'Independent',
    desc: 'TripGenius is independently owned and operated. No corporate overlords, no agenda — just a passion for helping people travel better.',
  },
];

const editorialSteps = [
  {
    icon: Search,
    title: 'Primary Research',
    desc: 'Every guide starts with in-depth research: local tourism boards, firsthand traveller accounts, recent trip reports, and cross-referencing multiple sources to verify costs, timings, and logistics.',
  },
  {
    icon: RefreshCw,
    title: 'Regular Updates',
    desc: 'Travel information expires fast. We review and update guides for prices, visa rules, seasonal conditions, and new attractions on a rolling basis — not just when we remember to.',
  },
  {
    icon: Users,
    title: 'Community Vetted',
    desc: 'Reader feedback and corrections are taken seriously. If something on a guide is wrong or outdated, we fix it. Our goal is accuracy over volume.',
  },
];

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TripGenius',
  url: BASE,
  logo: `${BASE}/logo.png`,
  description: 'Free travel guides for 160+ cities worldwide. Honest, well-researched information with no paid rankings.',
  foundingDate: '2025',
  knowsAbout: ['Travel', 'Tourism', 'India Travel', 'Asia Travel', 'Europe Travel', 'Travel Planning'],
  areaServed: 'Worldwide',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Editorial',
    url: `${BASE}/contact`,
  },
  publishingPrinciples: `${BASE}/about`,
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <Navbar />
      <main className="bg-dark min-h-screen">

        {/* Hero */}
        <div className="relative overflow-hidden pt-28 pb-16 border-b border-border bg-surface">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-accent/6 blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">About Us</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-primary-text leading-tight">
              Travel guides you can actually trust
            </h1>
            <p className="mt-4 text-muted text-base max-w-xl mx-auto leading-relaxed">
              TripGenius was built on a simple idea: everyone deserves access to honest, well-researched travel information — completely free.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="prose prose-invert max-w-none">
            <h2 className="font-heading text-2xl font-semibold text-primary-text mb-4">Our Story</h2>
            <p className="text-muted leading-relaxed mb-4">
              TripGenius started as a personal frustration. Too many travel websites bury honest advice under hotel ads, affiliate spam, and clickbait listicles that clearly haven&apos;t been updated since 2019. We wanted something different.
            </p>
            <p className="text-muted leading-relaxed mb-4">
              So we built it. Starting with a handful of destinations and growing to 140+ cities across 15+ countries, TripGenius is now one of the fastest-growing free travel guide platforms on the web. Our readers come to us because they know what they&apos;ll get: real information, real costs, and real advice — not paid promotions dressed up as editorial content.
            </p>
            <p className="text-muted leading-relaxed">
              We cover everything from iconic world cities like Paris and Tokyo to incredible Indian destinations that most travel sites simply ignore. Whether you&apos;re backpacking on a budget or planning a luxury escape, TripGenius has a guide for you.
            </p>
          </div>
        </div>

        {/* Editorial process */}
        <div className="border-t border-border bg-surface">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">How We Work</p>
              <h2 className="font-heading text-2xl font-semibold text-primary-text">Our editorial process</h2>
              <p className="text-muted text-sm mt-2 max-w-xl mx-auto">
                Every guide on TripGenius follows the same research and review process — no shortcuts, no filler.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {editorialSteps.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-6 bg-elevated border border-border rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-primary-text mb-2">{title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values grid */}
        <div className="border-t border-border bg-dark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <h2 className="font-heading text-2xl font-semibold text-primary-text text-center mb-10">What we stand for</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-6 bg-elevated border border-border rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-primary-text mb-2">{title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: '140+', label: 'Destinations covered' },
              { value: '15+', label: 'Countries worldwide' },
              { value: '100%', label: 'Free, always' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-heading text-4xl font-bold text-accent">{value}</p>
                <p className="text-sm text-muted mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-border">
          <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 text-center">
            <p className="text-muted text-sm mb-4">Have a question or want to get in touch?</p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
