'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { allCities } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import { AnimateList, AnimateItem } from '@/components/AnimateList';

interface CitiesPageProps {
  showHeroGlobe?: boolean;
}

export default function CitiesPage({ showHeroGlobe = false }: CitiesPageProps = {}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (query.length === 0) return allCities;
    const q = query.toLowerCase();
    return allCities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      <Navbar />
      <main className="bg-dark min-h-screen">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden border-b border-border bg-surface pt-28 pb-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-accent/7 blur-3xl" />
            <div className="absolute top-8 right-1/3 w-[280px] h-[280px] rounded-full bg-teal/4 blur-3xl" />
          </div>

          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <h1 className="font-heading text-5xl sm:text-6xl font-semibold text-accent leading-tight tracking-tight">
                Explore the World
              </h1>
              {showHeroGlobe && (
                <div className="hero-globe" aria-hidden="true">
                  <div className="hero-globe__sphere">
                    <span className="hero-globe__land hero-globe__land--one" />
                    <span className="hero-globe__land hero-globe__land--two" />
                    <span className="hero-globe__land hero-globe__land--three" />
                    <span className="hero-globe__grid hero-globe__grid--lat" />
                    <span className="hero-globe__grid hero-globe__grid--lon" />
                    <span className="hero-globe__shine" />
                  </div>
                </div>
              )}
              <p className="mt-3 text-muted text-base">
                Honest guides for every destination.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-7 relative max-w-sm mx-auto"
            >
              <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a city or country…"
                className="w-full pl-11 pr-4 py-3.5 bg-elevated border border-border rounded-2xl text-sm text-primary-text placeholder:text-muted/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
              />
            </motion.div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🌍</p>
              <p className="text-muted text-sm">No cities found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <AnimateList
              stagger={0.04}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map((city) => (
                <AnimateItem key={city.slug} hover>
                  <Link
                    href={`/cities/${city.slug}`}
                    className="group relative block rounded-2xl overflow-hidden h-56 sm:h-64"
                  >
                    <SafeImage
                      src={getCityImageUrl(city.slug, 'card') ?? city.image}
                      alt={`${city.name} travel guide`}
                      city={city.slug}
                      accentColor={city.accentColor}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    {/* Dark gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Flag */}
                    <div className="absolute top-3 left-3 text-xl drop-shadow-lg">{city.flag}</div>

                    {/* Hover pill */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      Explore <ArrowRight size={9} />
                    </div>

                    {/* City info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-white/45 mb-0.5">{city.country}</p>
                      <h3 className="font-heading text-lg font-bold text-white group-hover:text-accent transition-colors duration-200 leading-tight">
                        {city.name}
                      </h3>
                      <p className="text-[11px] text-white/55 mt-0.5 italic line-clamp-1">{city.tagline}</p>
                    </div>
                  </Link>
                </AnimateItem>
              ))}
            </AnimateList>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
