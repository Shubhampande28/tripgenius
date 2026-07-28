'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe } from 'lucide-react';
import type { CountryData } from '@/data/countries';
import CountryCard from '@/components/country/CountryCard';

// ─── Continent tab config ───────────────────────────────────────────────────
const CONTINENT_TABS = [
  { label: 'All',      value: 'All',      emoji: '🌍' },
  { label: 'Asia',     value: 'Asia',     emoji: '🌏' },
  { label: 'Europe',   value: 'Europe',   emoji: '🏰' },
  { label: 'Africa',   value: 'Africa',   emoji: '🦁' },
  { label: 'Americas', value: 'Americas', emoji: '🌎' },
  { label: 'Oceania',  value: 'Oceania',  emoji: '🦘' },
];

// ─── Featured slugs ─────────────────────────────────────────────────────────
const FEATURED = new Set(['india', 'japan', 'thailand', 'italy', 'france', 'maldives', 'indonesia', 'sri-lanka']);

// ─── Types ──────────────────────────────────────────────────────────────────
interface Props { countries: CountryData[] }

// ═══════════════════════════════════════════════════════════════════════════
export default function CountriesExplorer({ countries }: Props) {
  const [activeTab, setActiveTab]   = useState('All');
  const [query,     setQuery]       = useState('');

  // Continent counts
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: countries.length };
    countries.forEach((co) => { c[co.continent] = (c[co.continent] ?? 0) + 1; });
    return c;
  }, [countries]);

  // Visa-easy count for hero stat
  const easyVisaCount = useMemo(() =>
    countries.filter((c) => {
      const v = c.visaForIndians.toLowerCase();
      return v.includes('no visa') || v.includes('visa-free') || v.includes('on arrival') || v.includes('e-visa');
    }).length
  , [countries]);

  // Continents actually represented in the data — drives the hero stat
  const continentCount = useMemo(() => new Set(countries.map((c) => c.continent)).size, [countries]);

  // Filtered list
  const filtered = useMemo(() => {
    let list = activeTab === 'All' ? countries : countries.filter((c) => c.continent === activeTab);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q)
      );
    }
    return list;
  }, [countries, activeTab, query]);

  const showFeatured = activeTab === 'All' && !query.trim();
  const featured     = useMemo(() => filtered.filter((c) => FEATURED.has(c.slug)).slice(0, 4), [filtered]);
  const rest         = useMemo(() => showFeatured ? filtered.filter((c) => !FEATURED.has(c.slug)) : filtered, [filtered, showFeatured]);

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl mb-10 border border-border bg-gradient-to-br from-accent/15 via-surface to-elevated px-6 sm:px-12 py-12 text-center">
        {/* subtle decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-teal/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full mb-4">
            TripGenius World Guides
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-text mb-3">
            Explore the World
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
            Honest, India-first travel guides — visa info, best season, top cities, and real budgets.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: '🌍', label: `${countries.length} Countries` },
              { icon: '✅', label: `${easyVisaCount} Easy Visa` },
              { icon: '🗺️', label: `${continentCount} Continents` },
            ].map((s) => (
              <span key={s.label}
                className="flex items-center gap-1.5 text-sm font-medium text-primary-text bg-elevated/80 backdrop-blur-sm border border-border rounded-full px-4 py-1.5">
                {s.icon} {s.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Search + Tabs ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            type="text"
            placeholder="Search countries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-sm text-primary-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-0.5 w-full sm:w-auto scrollbar-hide">
          {CONTINENT_TABS.map((tab) => {
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => { setActiveTab(tab.value); setQuery(''); }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-surface border border-border text-muted hover:text-primary-text hover:border-accent/30'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                  active ? 'bg-white/20 text-white' : 'bg-elevated text-muted'
                }`}>
                  {counts[tab.value] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Featured strip ────────────────────────────────────────────── */}
      {showFeatured && featured.length > 0 && (
        <section className="mb-10">
          <h2 className="font-heading text-base font-semibold text-primary-text mb-4 flex items-center gap-2">
            ✨ <span>Popular Destinations</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((country) => (
              <CountryCard key={country.slug} country={country} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* ── Section title for grid ────────────────────────────────────── */}
      {rest.length > 0 && (
        <h2 className="font-heading text-base font-semibold text-primary-text mb-5">
          {activeTab !== 'All'
            ? `${CONTINENT_TABS.find((t) => t.value === activeTab)?.emoji} ${activeTab} — ${filtered.length} ${filtered.length === 1 ? 'country' : 'countries'}`
            : query
            ? `Results for "${query}"`
            : 'More Destinations'}
        </h2>
      )}

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Globe className="w-10 h-10 mx-auto mb-3 text-muted opacity-30" />
          <p className="text-muted text-sm">No countries match &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {/* ── Country grid ──────────────────────────────────────────────── */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((country) => (
            <CountryCard key={country.slug} country={country} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
