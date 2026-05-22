'use client';

import { useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Wallet } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { allCities } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';

const countries = [
  'All',
  'India',
  ...Array.from(new Set(allCities.map((city) => city.country)))
    .filter((country) => country !== 'India')
    .sort((a, b) => a.localeCompare(b)),
];

const vibeColors: Record<string, string> = {
  Spiritual:    'bg-gold/10 text-gold',
  Romantic:     'bg-pink-500/10 text-pink-400',
  Adventure:    'bg-accent/10 text-accent',
  Cultural:     'bg-purple-500/10 text-purple-400',
  Foodie:       'bg-orange-500/10 text-orange-400',
  Luxury:       'bg-gold/10 text-gold',
  Beach:        'bg-teal/10 text-teal',
  Bohemian:     'bg-pink-500/10 text-pink-400',
  Modern:       'bg-blue-500/10 text-blue-400',
  Nature:       'bg-green-500/10 text-green-400',
};

export default function CitiesPage() {
  const [query, setQuery] = useState('');
  const [activeCountry, setActiveCountry] = useState('All');

  const filtered = allCities.filter((city) => {
    const matchesSearch =
      query.length === 0 ||
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.country.toLowerCase().includes(query.toLowerCase());
    const matchesCountry = activeCountry === 'All' || city.country === activeCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <>
      <Navbar />
      <main className="bg-dark min-h-screen">
        {/* Header */}
        <div className="relative border-b border-border bg-surface overflow-hidden pt-28 pb-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(255,107,53,0.07),transparent)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                Explore the World
              </p>
              <h1 className="font-heading text-5xl sm:text-6xl font-semibold text-primary-text">
                Explore the World
              </h1>
              <p className="mt-4 text-muted max-w-xl mx-auto">
                From ancient temples to rooftop beach clubs — every city guide written for real travellers.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 max-w-lg mx-auto relative"
            >
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cities or countries…"
                className="w-full pl-11 pr-4 py-3.5 bg-elevated border border-border rounded-2xl text-primary-text placeholder:text-muted/60 focus:outline-none focus:border-accent transition-colors"
              />
            </motion.div>

            {/* Country filters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-5 flex flex-wrap justify-center gap-2"
            >
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => setActiveCountry(country)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCountry === country
                      ? 'bg-accent text-white shadow-lg shadow-accent/20'
                      : 'bg-elevated border border-border text-muted hover:text-primary-text'
                  }`}
                >
                  {country}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🌍</p>
              <p className="text-muted">No cities found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted mb-6">
                Showing <strong className="text-primary-text">{filtered.length}</strong>{' '}
                {filtered.length === 1 ? 'city' : 'cities'}
                {activeCountry !== 'All' && ` in ${activeCountry}`}
                {query && ` matching "${query}"`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((city, i) => (
                  <motion.div
                    key={city.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.5) }}
                  >
                    <Link href={`/cities/${city.slug}`}>
                      <div className="group rounded-2xl overflow-hidden border border-border bg-surface hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 h-full">
                        {/* Image */}
                        <div className="relative h-44 overflow-hidden">
                          <SafeImage
                            src={getCityImageUrl(city.slug, 'card') ?? city.image}
                            alt={city.name}
                            city={city.slug}
                            accentColor={city.accentColor}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                          <div className="absolute top-3 left-3 text-xl">{city.flag}</div>
                          {city.areas && city.areas.length > 0 && (
                            <div className="absolute top-3 right-3">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-teal/80 text-dark font-bold backdrop-blur-sm">
                                Full Guide
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-heading text-xl font-bold text-primary-text group-hover:text-accent transition-colors">
                            {city.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5 mb-3">
                            <MapPin size={11} className="text-muted" />
                            <span className="text-xs text-muted">{city.country}</span>
                          </div>

                          <div className="flex items-center gap-3 mb-3 text-xs text-muted">
                            <div className="flex items-center gap-1">
                              <Clock size={10} />
                              <span>{city.stats.bestTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Wallet size={10} />
                              <span>{city.stats.budget.split('/')[0]}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {city.vibes.slice(0, 2).map((v) => (
                              <span
                                key={v}
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${vibeColors[v] || 'bg-elevated text-muted'}`}
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
