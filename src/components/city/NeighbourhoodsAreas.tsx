'use client';

import SafeImage from '@/components/SafeImage';
import { getCityImageUrl } from '@/lib/cityImages';
import { motion } from 'framer-motion';
import { MapPin, Check, X, Hotel, ChevronRight } from 'lucide-react';
import { City } from '@/lib/types';

const priceLabel: Record<string, { label: string; color: string }> = {
  '$':    { label: 'Budget',    color: 'text-teal bg-teal/10 border-teal/25' },
  '$$':   { label: 'Mid-range', color: 'text-blue-400 bg-blue-500/10 border-blue-500/25' },
  '$$$':  { label: 'Upscale',   color: 'text-accent bg-accent/10 border-accent/25' },
  '$$$$': { label: 'Luxury',    color: 'text-gold bg-gold/10 border-gold/25' },
};

export default function NeighbourhoodsAreas({ city }: { city: City }) {
  if (!city.neighbourhoods?.length) return null;

  return (
    <section className="py-16 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <MapPin size={15} className="text-accent" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Where to Base Yourself
            </p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            {city.name} by Neighbourhood
          </h2>
          <p className="mt-2 text-muted text-sm max-w-2xl leading-relaxed">
            Each area has a completely different character. Choose your base based on
            how you travel — not just proximity to monuments.
          </p>
        </motion.div>

        {/* Neighbourhood cards — each with photo + detail + spots */}
        <div className="space-y-6">
          {city.neighbourhoods.map((n, i) => {
            const matchingArea = city.areas?.find(
              (a) => a.name.toLowerCase() === n.name.toLowerCase()
            );
            const price = priceLabel[n.priceRange] ?? priceLabel['$$'];

            return (
              <motion.div
                key={n.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-surface border border-border rounded-2xl overflow-hidden group hover:border-accent/20 transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">

                  {/* Left: photo */}
                  {matchingArea?.image && (
                    <div className="relative h-56 md:h-auto overflow-hidden">
                      <SafeImage
                        src={getCityImageUrl(city.slug, 'card') ?? matchingArea.image}
                        alt={n.name}
                        city={city.slug}
                        accentColor={city.accentColor}
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface/80 hidden md:block" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent md:hidden" />

                      {/* Vibe tag over image */}
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/90 font-medium">
                          {matchingArea.emoji} {n.vibe}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Right: content */}
                  <div className="p-5 flex flex-col gap-4">

                    {/* Top row: name + price badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-heading text-2xl font-bold text-primary-text group-hover:text-accent transition-colors">
                          {n.name}
                        </h3>
                        <p className="text-sm text-muted mt-1 leading-relaxed">{n.description}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 font-semibold ${price.color}`}>
                        {n.priceRange} · {price.label}
                      </span>
                    </div>

                    {/* Middle: best for + spots side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Best for */}
                      <div>
                        <p className="text-xs font-semibold text-teal uppercase tracking-wide mb-2">Best for</p>
                        <ul className="space-y-1.5">
                          {n.bestFor.map((tag) => (
                            <li key={tag} className="flex items-center gap-2 text-xs text-primary-text/80">
                              <Check size={11} className="text-teal flex-shrink-0" />
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Top spots from area data */}
                      {matchingArea?.spots && (
                        <div>
                          <p className="text-xs font-semibold text-gold uppercase tracking-wide mb-2">Top spots</p>
                          <ul className="space-y-1.5">
                            {matchingArea.spots.slice(0, 4).map((spot) => (
                              <li key={spot.name} className="flex items-start gap-2 text-xs text-primary-text/80">
                                <ChevronRight size={11} className="text-gold flex-shrink-0 mt-0.5" />
                                <span>{spot.name}</span>
                                {spot.tag && (
                                  <span className="text-muted/60 italic ml-auto flex-shrink-0">
                                    {spot.tag}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Bottom: not for + hotel CTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-border/50">
                      <div className="flex items-start gap-1.5">
                        <X size={11} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-muted italic leading-relaxed">
                          <span className="text-red-400 font-medium not-italic">Skip if: </span>
                          {n.notFor}
                        </p>
                      </div>
                      <a
                        href="#"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors text-xs font-semibold text-accent whitespace-nowrap flex-shrink-0"
                      >
                        <Hotel size={12} />
                        Hotels in {n.name}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
