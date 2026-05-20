'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ArrowRight, MapPin, Globe } from 'lucide-react';
import { allCities } from '@/lib/cities';

const citySuggestions = allCities.map((c) => c.name);

export default function Hero() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const filtered = query.length > 0
    ? citySuggestions.filter((c) => c.toLowerCase().startsWith(query.toLowerCase()))
    : [];

  const handleSearch = (cityName?: string) => {
    const target = cityName ?? query;
    const city = allCities.find((c) => c.name.toLowerCase() === target.toLowerCase());
    if (city) router.push(`/cities/${city.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,107,53,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(0,201,167,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_70%,rgba(255,209,102,0.06),transparent)]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(230,237,243,1) 1px, transparent 1px), linear-gradient(90deg, rgba(230,237,243,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 left-[10%] w-48 h-48 rounded-full bg-accent/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-32 right-[10%] w-64 h-64 rounded-full bg-teal/10 blur-3xl"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-xs font-medium text-muted mb-8">
            <Globe size={12} className="text-teal" />
            Curated guides for every kind of traveller
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-heading text-5xl sm:text-6xl lg:text-8xl font-semibold text-primary-text leading-[1.05] tracking-tight"
        >
          The World is Waiting.
          <br />
          <span className="gradient-text-accent">We&apos;ll Show You How.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
        >
          Deep-dive travel guides for every kind of explorer. From sacred temples to hidden
          beach clubs — everything you need to travel with confidence.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10 relative max-w-xl mx-auto"
        >
          <div
            className={`relative flex items-center bg-surface border rounded-2xl transition-all duration-300 ${
              focused ? 'border-accent shadow-lg shadow-accent/15' : 'border-border'
            }`}
          >
            <div className="pl-5">
              <Search size={18} className="text-muted" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={handleKeyDown}
              placeholder="Search a city — Bali, Tokyo, Paris…"
              className="flex-1 bg-transparent px-4 py-4 text-primary-text placeholder:text-muted/60 focus:outline-none text-base"
            />
            <button
              onClick={() => handleSearch()}
              className="m-2 px-5 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 active:scale-95 transition-all flex items-center gap-2"
            >
              Explore <ArrowRight size={14} />
            </button>
          </div>

          {focused && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-20">
              {filtered.map((city) => (
                <button
                  key={city}
                  onMouseDown={() => handleSearch(city)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-elevated text-left transition-colors"
                >
                  <MapPin size={14} className="text-accent flex-shrink-0" />
                  <span className="text-sm text-primary-text">{city}</span>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick city links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 flex items-center justify-center gap-6 text-xs text-muted"
        >
          {['Bali', 'Tokyo', 'Paris', 'Dubai'].map((city) => (
            <button
              key={city}
              onClick={() => handleSearch(city)}
              className="hover:text-accent transition-colors"
            >
              {city}
            </button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-14 flex items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: '6', label: 'City Guides' },
            { value: '60+', label: 'Local Recommendations' },
            { value: 'Free', label: 'Always' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-heading text-3xl font-semibold text-primary-text">{value}</div>
              <div className="text-xs text-muted mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border-2 border-muted/30 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-muted/50" />
        </div>
      </motion.div>
    </section>
  );
}
