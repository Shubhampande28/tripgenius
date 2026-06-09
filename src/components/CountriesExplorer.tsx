'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Globe, ArrowRight } from 'lucide-react';
import type { CountryData } from '@/data/countries';
import { getCityImageUrl } from '@/lib/cityImages';

// ─── Continent tab config ───────────────────────────────────────────────────
const CONTINENT_TABS = [
  { label: 'All',      value: 'All',      emoji: '🌍' },
  { label: 'Asia',     value: 'Asia',     emoji: '🌏' },
  { label: 'Europe',   value: 'Europe',   emoji: '🏰' },
  { label: 'Africa',   value: 'Africa',   emoji: '🦁' },
  { label: 'Americas', value: 'Americas', emoji: '🌎' },
  { label: 'Oceania',  value: 'Oceania',  emoji: '🦘' },
];

const CONTINENT_COLORS: Record<string, { text: string; bg: string; border: string; bar: string }> = {
  Asia:     { text: 'text-teal',        bg: 'bg-teal/10',        border: 'border-teal/30',        bar: 'bg-teal' },
  Europe:   { text: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/30',    bar: 'bg-blue-400' },
  Africa:   { text: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   bar: 'bg-amber-400' },
  Americas: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', bar: 'bg-emerald-400' },
  Oceania:  { text: 'text-sky-400',     bg: 'bg-sky-400/10',     border: 'border-sky-400/30',     bar: 'bg-sky-400' },
};

// ─── Visa badge helper ──────────────────────────────────────────────────────
function visaInfo(visa: string): { label: string; dot: string; cls: string } {
  const v = visa.toLowerCase();
  if (v.includes('no visa') || v.includes('visa-free'))
    return { label: 'Visa-free', dot: '✓', cls: 'text-teal bg-teal/10 border-teal/30' };
  if (v.includes('on arrival'))
    return { label: 'Visa on arrival', dot: '●', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/30' };
  if (v.includes('e-visa'))
    return { label: 'E-visa', dot: '●', cls: 'text-blue-400 bg-blue-400/10 border-blue-400/30' };
  return { label: 'Visa required', dot: '○', cls: 'text-muted bg-elevated border-border' };
}

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
      return v.includes('no visa') || v.includes('visa-free') || v.includes('on arrival');
    }).length
  , [countries]);

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

        <div className="relative z-10">
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
              { icon: '🗺️', label: '4 Continents' },
            ].map((s) => (
              <span key={s.label}
                className="flex items-center gap-1.5 text-sm font-medium text-primary-text bg-elevated/80 backdrop-blur-sm border border-border rounded-full px-4 py-1.5">
                {s.icon} {s.label}
              </span>
            ))}
          </div>
        </div>
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

        <div className="flex gap-2 overflow-x-auto pb-0.5 w-full sm:w-auto" style={{ scrollbarWidth: 'none' }}>
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
            {featured.map((country) => {
              const visa   = visaInfo(country.visaForIndians);
              const imgUrl = country.cities.length > 0 ? getCityImageUrl(country.cities[0], 'card') : null;
              return (
                <Link
                  key={country.slug}
                  href={`/countries/${country.slug}`}
                  className="group relative overflow-hidden bg-surface border border-border hover:border-accent/50 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
                >
                  {/* Photo header */}
                  <div className="relative h-36 overflow-hidden">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={country.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface to-elevated flex items-center justify-center">
                        <span className="text-5xl">{country.flag}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{country.flag}</span>
                        <h3 className="font-heading text-sm font-bold text-white group-hover:text-teal-200 transition-colors leading-tight truncate">
                          {country.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${visa.cls}`}>
                      {visa.dot} {visa.label}
                    </span>
                    <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-accent">
                      <span>{country.cities.length} {country.cities.length === 1 ? 'city' : 'cities'}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
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
            <CountryCard key={country.slug} country={country} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
function CountryCard({ country }: { country: CountryData }) {
  const visa   = visaInfo(country.visaForIndians);
  const cc     = CONTINENT_COLORS[country.continent];
  const imgUrl = country.cities.length > 0 ? getCityImageUrl(country.cities[0], 'card') : null;

  return (
    <Link
      href={`/countries/${country.slug}`}
      className="group flex flex-col bg-surface border border-border hover:border-accent/40 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10"
    >
      {/* Photo header */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={`${country.name} travel guide`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface to-elevated flex items-center justify-center">
            <span className="text-6xl">{country.flag}</span>
          </div>
        )}
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        {/* continent bar */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${cc?.bar ?? 'bg-muted/30'}`} />
        {/* continent badge */}
        <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm ${cc?.text ?? 'text-white/70'}`}>
          {country.continent}
        </span>
        {/* country name over photo */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-2xl leading-none">{country.flag}</span>
            <h3 className="font-heading text-base font-bold text-white group-hover:text-teal-200 transition-colors leading-tight">
              {country.name}
            </h3>
          </div>
          <p className="text-xs text-white/60 ml-8">{country.capital}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Stats */}
        <div className="space-y-1.5 mb-3 text-xs">
          {[
            { label: 'Best time', value: country.bestTime },
            { label: 'Currency',  value: country.currency },
            { label: 'Language',  value: country.language },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-4">
              <span className="text-muted flex-shrink-0">{s.label}</span>
              <span className="font-medium text-primary-text text-right truncate">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Visa */}
        <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full border ${visa.cls} mb-3`}>
          {visa.dot} {visa.label}
        </span>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted">
            {country.cities.length} {country.cities.length === 1 ? 'city' : 'cities'}
          </span>
          <span className="text-xs font-semibold text-accent inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Explore <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
