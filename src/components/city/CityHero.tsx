'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';
import { City } from '@/lib/types';

export default function CityHero({ city }: { city: City }) {
  return (
    <section className="relative min-h-[80vh] flex items-end overflow-hidden">

      {/* Full-bleed hero photo */}
      <Image
        src={city.heroImage}
        alt={`${city.name}, ${city.country}`}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-105"
        style={{ transformOrigin: 'center top' }}
      />

      {/* Dark base overlay so text always reads well */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Cinematic bottom gradient — strong near text, fades upward */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />

      {/* Subtle top vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* Colour tint matching the city's accent */}
      <div
        className="absolute inset-0 mix-blend-multiply opacity-30"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 20% 80%, ${city.accentColor}60, transparent)`,
        }}
      />

      {/* Back nav */}
      <div className="absolute top-24 left-0 right-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
        <Link
          href="/#cities"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors group backdrop-blur-sm bg-black/20 border border-white/10 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          All Cities
        </Link>
      </div>

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
