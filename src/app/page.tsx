'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import { allCities } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import { AnimateList, AnimateItem } from '@/components/AnimateList';

// ── Mosaic hero cities ──────────────────────────────────────────
const MOSAIC = [
  { slug: 'bali',    name: 'Bali',    country: 'Indonesia', tagline: 'Island of the Gods',    accent: '#FF6B35' },
  { slug: 'paris',   name: 'Paris',   country: 'France',    tagline: 'City of Light',          accent: '#E8C97E' },
  { slug: 'tokyo',   name: 'Tokyo',   country: 'Japan',     tagline: 'Neon meets tradition',   accent: '#FF6B9D' },
  { slug: 'dubai',   name: 'Dubai',   country: 'UAE',       tagline: 'City of superlatives',   accent: '#C2A04C' },
  { slug: 'bangkok', name: 'Bangkok', country: 'Thailand',  tagline: 'Street food paradise',   accent: '#10B981' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return allCities;
    const q = query.toLowerCase();
    return allCities.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      <Navbar />
      <main className="bg-dark min-h-screen">

        {/* ═══════════════════════════════════════════════
            HERO — headline + photo mosaic
        ════════════════════════════════════════════════ */}
        <section className="relative bg-[#07090f] pt-24 pb-0 overflow-hidden">

          {/* Ambient glow behind headline */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-accent/6 rounded-full blur-[140px]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Headline block */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-10 lg:mb-12"
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted/70 mb-5">
                160+ destinations · Honest travel guides
              </p>
              <h1 className="font-heading font-bold text-accent leading-none tracking-tight"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
                Explore the World
              </h1>
              <p className="mt-4 text-muted text-lg max-w-xs mx-auto">
                Honest guides for every destination.
              </p>
            </motion.div>

            {/* ── Photo mosaic ── */}
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* DESKTOP: bento grid — Bali tall left, 2×2 right */}
              <div className="hidden md:grid gap-3 h-[500px]"
                style={{ gridTemplateColumns: '2fr 1.3fr 1.3fr', gridTemplateRows: '1fr 1fr' }}>

                {/* Bali — spans both rows */}
                <Link href="/cities/bali"
                  className="group relative rounded-2xl overflow-hidden"
                  style={{ gridRow: '1 / 3' }}>
                  <SafeImage src={getCityImageUrl('bali', 'card')!} alt="Bali travel guide"
                    city="bali" accentColor="#FF6B35" fill sizes="40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">Indonesia</p>
                    <h2 className="font-heading text-4xl font-bold text-white group-hover:text-accent transition-colors duration-200">Bali</h2>
                    <p className="text-white/55 text-sm mt-1 italic">Island of the Gods</p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 translate-y-[-4px] group-hover:translate-y-0 transition-all duration-300">
                    <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      Explore <ArrowRight size={9} />
                    </span>
                  </div>
                </Link>

                {/* Paris — top middle */}
                <MosaicCell city={MOSAIC[1]} sizes="30vw" />
                {/* Tokyo — top right */}
                <MosaicCell city={MOSAIC[2]} sizes="30vw" />
                {/* Dubai — bottom middle */}
                <MosaicCell city={MOSAIC[3]} sizes="30vw" />
                {/* Bangkok — bottom right */}
                <MosaicCell city={MOSAIC[4]} sizes="30vw" />
              </div>

              {/* MOBILE: 2 photos side by side */}
              <div className="grid md:hidden grid-cols-2 gap-3 h-56">
                {MOSAIC.slice(0, 2).map((c) => (
                  <Link key={c.slug} href={`/cities/${c.slug}`}
                    className="group relative rounded-2xl overflow-hidden">
                    <SafeImage src={getCityImageUrl(c.slug, 'card')!} alt={`${c.name} travel guide`}
                      city={c.slug} accentColor={c.accent} fill sizes="50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3.5 left-3.5">
                      <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-0.5">{c.country}</p>
                      <h3 className="font-heading text-lg font-bold text-white group-hover:text-accent transition-colors">{c.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            CITIES GRID — search + all destinations
        ════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">

          {/* Search + divider */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted whitespace-nowrap">
              All Destinations
            </p>
            <div className="hidden sm:block flex-1 h-px bg-border" />
            <div className="relative w-full sm:w-72">
              <Search size={13} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a city or country…"
                className="w-full pl-9 pr-4 py-2.5 bg-elevated border border-border rounded-xl text-sm text-primary-text placeholder:text-muted/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🌍</p>
              <p className="text-muted text-sm">No cities found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <AnimateList stagger={0.04}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((city) => (
                <AnimateItem key={city.slug} hover>
                  <Link href={`/cities/${city.slug}`}
                    className="group relative block rounded-2xl overflow-hidden h-56 sm:h-64">
                    <SafeImage
                      src={getCityImageUrl(city.slug, 'card') ?? city.image}
                      alt={`${city.name} travel guide`}
                      city={city.slug} accentColor={city.accentColor} fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 text-xl drop-shadow-lg">{city.flag}</div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      Explore <ArrowRight size={9} />
                    </div>
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
        </section>
      </main>
      <Footer />
    </>
  );
}

// ── Small reusable mosaic cell ───────────────────────────────────
function MosaicCell({ city, sizes }: { city: typeof MOSAIC[number]; sizes: string }) {
  return (
    <Link href={`/cities/${city.slug}`} className="group relative rounded-2xl overflow-hidden">
      <SafeImage
        src={getCityImageUrl(city.slug, 'card')!}
        alt={`${city.name} travel guide`}
        city={city.slug} accentColor={city.accent} fill sizes={sizes}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest mb-0.5">{city.country}</p>
        <h3 className="font-heading text-xl font-bold text-white group-hover:text-accent transition-colors duration-200">{city.name}</h3>
        <p className="text-white/50 text-[11px] mt-0.5 italic line-clamp-1">{city.tagline}</p>
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 translate-y-[-4px] group-hover:translate-y-0 transition-all duration-300">
        <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
          Explore <ArrowRight size={9} />
        </span>
      </div>
    </Link>
  );
}
