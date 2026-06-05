'use client';

import SafeImage from '@/components/SafeImage';
import { getCityImageUrl } from '@/lib/cityImages';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';
import { City } from '@/lib/types';
import Breadcrumb from './Breadcrumb';

const UPDATED = 'May 2026';

export default function CityHero({ city, countrySlug }: { city: City; countrySlug?: string }) {
  return (
    <section className="relative min-h-[80vh] flex items-end overflow-hidden">

      {/* Full-bleed hero photo */}
      <SafeImage
        src={getCityImageUrl(city.slug, 'hero') ?? city.heroImage}
        alt={`${city.name} travel guide — ${city.tagline}, ${city.country}`}
        city={city.slug}
        accentColor={city.accentColor}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-105"
        style={{ transformOrigin: 'center top' }}
      />

      {/* Single clean gradient — photo shows fully in top 50%, dark enough at bottom for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-black/10" />

      {/* Top nav bar fade — just enough for logo and nav legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />

      {/* Colour tint matching the city's accent */}
      <div
        className="absolute inset-0 mix-blend-multiply opacity-30"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 20% 80%, ${city.accentColor}60, transparent)`,
        }}
      />

      {/* Breadcrumb nav */}
      <Breadcrumb cityName={city.name} country={city.country} countrySlug={countrySlug} />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Country badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium mb-6"
          >
            <span className="text-lg">{city.flag}</span>
            <span className="text-white/80">{city.country}</span>
          </motion.div>

          {/* City name */}
          <h1 className="font-heading text-6xl sm:text-7xl lg:text-9xl font-bold text-white leading-none drop-shadow-2xl">
            {city.name}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 font-heading text-xl text-white/50 italic"
          >
            {city.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-white/80 max-w-2xl leading-relaxed text-lg"
          >
            {city.heroDescription}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-3 text-xs text-white/40 flex items-center gap-1.5"
          >
            <span>📅</span>
            <span>Updated {UPDATED}</span>
          </motion.p>

          {/* Quick stats chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 text-sm">
              <Clock size={14} className="text-gold" />
              <span className="text-white/80">
                Best: <strong className="text-white">{city.stats.bestTime}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 text-sm">
              <DollarSign size={14} className="text-teal" />
              <span className="text-white/80">
                Budget: <strong className="text-white">{city.stats.budget}</strong>
              </span>
            </div>
            {city.vibes.map((vibe) => (
              <span
                key={vibe}
                className="bg-black/30 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 text-sm text-white/70"
              >
                {vibe}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
