'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import { allCities } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import { countries } from '@/data/countries';
import { ArrowRight, Search } from 'lucide-react';

// Region tabs for discovery filtering
const TABS = [
  { label: 'All',      value: 'all' },
  { label: '🇮🇳 India',  value: 'India' },
  { label: '🌏 Asia',   value: 'Asia' },
  { label: '🌍 Europe', value: 'Europe' },
  { label: '🌎 Others', value: 'Others' },
];

const ASIA_COUNTRIES    = new Set(['Indonesia','Thailand','Japan','Singapore','South Korea','Vietnam','Malaysia','Philippines','China','Hong Kong','Taiwan','Maldives','Nepal','Sri Lanka','UAE','Turkey']);
const EUROPE_COUNTRIES  = new Set(['France','Italy','Spain','United Kingdom','Netherlands','Czech Republic','Portugal','Greece','Hungary','Germany','Austria','Switzerland','Sweden','Norway','Iceland']);
const AMERICAS_COUNTRIES = new Set(['United States','Brazil','Argentina','Mexico','Peru','Colombia','Canada']);

function getRegion(country: string) {
  if (country === 'India') return 'India';
  if (ASIA_COUNTRIES.has(country)) return 'Asia';
  if (EUROPE_COUNTRIES.has(country)) return 'Europe';
  return 'Others';
}

// Destination card — same visual style as homepage Top Picks
function DestinationCard({ city }: { city: typeof allCities[0] }) {
  const thingsCount = city.thingsToDo?.length ?? 0;

  return (
    <Link
      href={`/cities/${city.slug}`}
      className="group relative block overflow-hidden rounded-[20px] bg-surface"
      style={{ aspectRatio: '4/5' }}
    >
      {/* Featured image */}
      <SafeImage
        src={getCityImageUrl(city.slug, 'card') ?? city.image}
        alt={`${city.name} travel guide — ${city.tagline}`}
        city={city.slug}
        accentColor={city.accentColor}
        fill
        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Gradient — readable bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      {/* Optional guide count badge */}
      {thingsCount > 0 && (
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
            {thingsCount} things to do
          </span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Country */}
        <p className="text-white/55 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
          {city.flag} {city.country}
        </p>

        {/* Destination name */}
        <h3 className="font-heading text-xl font-bold text-white leading-tight mb-1">
          {city.name}
        </h3>

        {/* Short description — tagline */}
        <p className="text-white/65 text-xs leading-snug mb-3 line-clamp-1">
          {city.tagline}
        </p>

        {/* Explore button */}
        <div className="flex items-center justify-between">
          {city.stats?.bestTime && (
            <span className="text-[10px] text-white/50">
              Best: <span className="text-accent font-semibold">{city.stats.bestTime}</span>
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-accent rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 ml-auto">
            Explore <ArrowRight size={9} />
          </span>
        </div>
      </div>
    </Link>
  );
}

const PAGE_SIZE = 24;

export default function DestinationsPage() {
  const [activeTab, setActiveTab]     = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible]         = useState(PAGE_SIZE);

  const cities = useMemo(() => {
    let list = allCities.filter(c => !c.stub);

    // Filter by region tab
    if (activeTab !== 'all') {
      list = list.filter(c => getRegion(c.country) === activeTab);
    }

    // Filter by search
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTab, searchQuery]);

  const displayed = cities.slice(0, visible);
  const hasMore   = visible < cities.length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          {/* Page header */}
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Explore</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-text mb-3">
              All Destinations
            </h1>
            <p className="text-muted text-base">
              Free travel guides for 160+ destinations — things to do, best time to visit and local tips.
            </p>
          </div>

          {/* Browse by Country */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Browse by country</p>
                <h2 className="font-heading text-xl font-bold text-primary-text">Explore by Destination</h2>
              </div>
              <Link
                href="/countries/india"
                className="text-xs font-medium text-accent hover:underline hidden sm:block"
              >
                View all countries →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {countries
                .filter((c) => c.cities.length >= 2)
                .map((country) => (
                  <Link
                    key={country.slug}
                    href={`/countries/${country.slug}`}
                    className="group flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-xl hover:border-accent/40 hover:bg-elevated transition-all duration-150"
                  >
                    <span className="text-2xl flex-shrink-0 select-none">{country.flag}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-primary-text group-hover:text-accent transition-colors truncate">
                        {country.name}
                      </div>
                      <div className="text-[10px] text-muted">
                        {country.cities.length} {country.cities.length === 1 ? 'city' : 'cities'}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* Search + Filter row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">

            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search destinations…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40"
              />
            </div>

            {/* Region tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0" style={{ scrollbarWidth:'none' }}>
              {TABS.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    activeTab === tab.value
                      ? 'bg-accent text-white shadow-sm'
                      : 'bg-surface border border-border text-muted hover:border-accent/30 hover:text-primary-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs text-muted mb-6">
            Showing <span className="font-semibold text-primary-text">{Math.min(visible, cities.length)}</span> of <span className="font-semibold text-primary-text">{cities.length}</span> destinations
          </p>

          {/* Destination card grid */}
          {cities.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-3">🌍</p>
              <p className="text-muted">No destinations found. Try a different search.</p>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayed.map(city => (
                <DestinationCard key={city.slug} city={city} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisible(v => v + PAGE_SIZE)}
                  className="px-8 py-3 rounded-xl border-2 border-accent text-accent font-semibold text-sm hover:bg-accent hover:text-white transition-all duration-200"
                >
                  Load More Destinations
                </button>
                <p className="text-xs text-muted mt-2">
                  {cities.length - visible} more destinations
                </p>
              </div>
            )}
            </>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
