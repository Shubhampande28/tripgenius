'use client';

import { hotelNeighbourhoodUrl } from '@/lib/affiliateLinks';
import { motion } from 'framer-motion';
import { MapPin, Check, X, Hotel } from 'lucide-react';
import { City } from '@/lib/types';

const priceLabel: Record<string, { label: string; color: string }> = {
  '$':    { label: 'Budget',    color: 'text-teal border-teal/30 bg-teal/8' },
  '$$':   { label: 'Mid-range', color: 'text-blue-500 border-blue-400/30 bg-blue-500/8' },
  '$$$':  { label: 'Upscale',   color: 'text-accent border-accent/30 bg-accent/8' },
  '$$$$': { label: 'Luxury',    color: 'text-gold border-gold/30 bg-gold/8' },
};

export default function NeighbourhoodsAreas({ city }: { city: City }) {
  if (!city.neighbourhoods?.length) return null;

  return (
    <section className="py-14">
      <div className="max-w-full px-0">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-accent" />
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Where to Base Yourself</p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            Explore {city.name} — Area by Area
          </h2>
          <p className="mt-2 text-muted text-sm max-w-2xl">
            Each area has a completely different character. Pick yours based on how you travel.
          </p>
        </motion.div>

        {/* Horizontal scroll on mobile, 2-col grid on md+ */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {city.neighbourhoods.map((n, i) => {
              const matchingArea = city.areas?.find(
                (a) => a.name.toLowerCase() === n.name.toLowerCase()
              );
              const price = priceLabel[n.priceRange] ?? priceLabel['$$'];
              const emoji = matchingArea?.emoji ?? '📍';
              const spots = matchingArea?.spots ?? [];

              return (
                <motion.div
                  key={n.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col hover:border-accent/30 hover:shadow-lg transition-all duration-300"
                >
                  {/* Card top strip */}
                  <div
                    className="px-5 pt-5 pb-4"
                    style={{
                      background: `linear-gradient(135deg, ${city.accentColor}12 0%, transparent 70%)`,
                      borderBottom: `1px solid ${city.accentColor}18`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl leading-none">{emoji}</span>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-primary-text leading-tight">
                            {n.name}
                          </h3>
                          <span
                            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mt-1 inline-block"
                            style={{
                              color: city.accentColor,
                              borderColor: `${city.accentColor}30`,
                              backgroundColor: `${city.accentColor}10`,
                            }}
                          >
                            {n.vibe}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold flex-shrink-0 ${price.color}`}>
                        {n.priceRange} · {price.label}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col gap-4 flex-1">

                    <p className="text-sm text-muted leading-relaxed">{n.description}</p>

                    {/* Best For */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-2">Best For</p>
                      <div className="flex flex-wrap gap-1.5">
                        {n.bestFor.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 text-[11px] bg-teal/8 text-teal border border-teal/20 px-2.5 py-1 rounded-full font-medium">
                            <Check size={9} strokeWidth={3} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Top Spots */}
                    {spots.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2">Top Spots</p>
                        <div className="space-y-1.5">
                          {spots.map((spot) => (
                            <div key={spot.name} className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-1 h-1 rounded-full bg-muted/40 flex-shrink-0" />
                                <span className="text-sm text-primary-text truncate">{spot.name}</span>
                              </div>
                              {spot.tag && (
                                <span className="text-[10px] text-muted italic flex-shrink-0">{spot.tag}</span>
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
                          <span className="text-red-400 font-semibold">Skip if: </span>
                          {n.notFor}
                        </p>
                      </div>
                      <a
                        href={hotelNeighbourhoodUrl(city.name, n.name)}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors text-xs font-semibold whitespace-nowrap flex-shrink-0"
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
      </div>
    </section>
  );
}
