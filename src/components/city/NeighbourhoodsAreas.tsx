'use client';

import { hotelNeighbourhoodUrl } from '@/lib/affiliateLinks';
import { motion } from 'framer-motion';
import { MapPin, Check, X, Hotel } from 'lucide-react';
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
    <section className="py-14 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-accent" />
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Where to Base Yourself</p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            {city.name} by Neighbourhood
          </h2>
          <p className="mt-2 text-muted text-sm max-w-2xl">
            Each area has a completely different character — choose your base by how you travel.
          </p>
        </motion.div>

        {/* Cards grid — 1 col mobile, 2 col md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {city.neighbourhoods.map((n, i) => {
            const matchingArea = city.areas?.find(
              (a) => a.name.toLowerCase() === n.name.toLowerCase()
            );
            const price = priceLabel[n.priceRange] ?? priceLabel['$$'];
            const emoji = matchingArea?.emoji ?? '📍';

            return (
              <motion.div
                key={n.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col group hover:border-accent/25 transition-all duration-300"
              >
                {/* Card header — gradient strip */}
                <div
                  className="px-5 pt-5 pb-4 flex items-start justify-between gap-3"
                  style={{
                    background: `linear-gradient(135deg, ${city.accentColor}14 0%, transparent 100%)`,
                    borderBottom: `1px solid ${city.accentColor}20`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl leading-none">{emoji}</span>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-primary-text group-hover:text-accent transition-colors leading-tight">
                        {n.name}
                      </h3>
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full border mt-1 inline-block"
                        style={{
                          color: city.accentColor,
                          borderColor: `${city.accentColor}35`,
                          backgroundColor: `${city.accentColor}10`,
                        }}
                      >
                        {n.vibe}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold flex-shrink-0 ${price.color}`}>
                    {n.priceRange} · {price.label}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                  {/* Description */}
                  <p className="text-sm text-muted leading-relaxed">{n.description}</p>

                  {/* Best for chips */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-2">Best for</p>
                    <div className="flex flex-wrap gap-1.5">
                      {n.bestFor.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 text-xs bg-teal/8 text-teal border border-teal/20 px-2.5 py-1 rounded-full">
                          <Check size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Top spots — condensed */}
                  {matchingArea?.spots && matchingArea.spots.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2">Top spots</p>
                      <div className="space-y-1">
                        {matchingArea.spots.slice(0, 4).map((spot) => (
                          <div key={spot.name} className="flex items-center justify-between gap-2">
                            <span className="text-xs text-primary-text/80 truncate">{spot.name}</span>
                            {spot.tag && (
                              <span className="text-[10px] text-muted/60 italic flex-shrink-0">{spot.tag}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-1.5 flex-1 min-w-0">
                      <X size={10} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted leading-relaxed">
                        <span className="text-red-400 font-medium">Skip if: </span>
                        {n.notFor}
                      </p>
                    </div>
                    <a
                      href={hotelNeighbourhoodUrl(city.name, n.name)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors text-xs font-semibold text-accent whitespace-nowrap flex-shrink-0"
                    >
                      <Hotel size={12} />
                      Hotels in {n.name}
                    </a>
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
