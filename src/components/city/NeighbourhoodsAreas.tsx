'use client';

import { hotelNeighbourhoodUrl } from '@/lib/affiliateLinks';
import { motion } from 'framer-motion';
import { Hotel, MapPin } from 'lucide-react';
import { City } from '@/lib/types';

/** Fuzzy match — handles "Rattanakosin (Old City)" ↔ "Old City" etc. */
function findArea(city: City, neighbourhoodName: string) {
  const nName = neighbourhoodName.toLowerCase().replace(/[()]/g, '').trim();
  return city.areas?.find((a) => {
    const aName = a.name.toLowerCase().replace(/[()]/g, '').trim();
    if (aName === nName) return true;
    if (aName.includes(nName) || nName.includes(aName)) return true;
    const aParts = aName.split(/[\s&,]+/).filter((p) => p.length > 3);
    return aParts.some((p) => nName.includes(p));
  });
}

export default function NeighbourhoodsAreas({ city }: { city: City }) {
  if (!city.neighbourhoods?.length) return null;

  const areas = city.neighbourhoods.map((n) => {
    const matched = findArea(city, n.name);
    return { ...n, emoji: matched?.emoji ?? '📍', spots: matched?.spots ?? [] };
  });

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2 mb-6"
        >
          <MapPin size={14} className="text-accent" />
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Area by Area</p>
        </motion.div>

        {/* Single cheatsheet card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-3xl border border-border overflow-hidden shadow-lg"
        >
          {/* Header */}
          <div
            className="px-6 sm:px-8 py-5 flex items-center justify-between"
            style={{ background: `linear-gradient(135deg, ${city.accentColor} 0%, ${city.accentColor}CC 100%)` }}
          >
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-0.5">TripGenius Travel Guide</p>
              <h2 className="font-heading text-xl sm:text-3xl font-bold text-white">
                {city.name} — Travel Cheatsheet
              </h2>
            </div>
            <span className="text-4xl sm:text-6xl leading-none opacity-80 hidden sm:block">{city.flag}</span>
          </div>

          {/* Area grid — responsive, clean borders */}
          <div className="bg-surface">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((area, i) => {
                const isLastRow = i >= areas.length - (areas.length % 3 || 3);
                const isRightCol = (i + 1) % 3 === 0;
                const isMiddleRow = i % 2 === 1;
                return (
                  <div
                    key={area.name}
                    className={[
                      'p-6 sm:p-7',
                      /* bottom border on all except bottom row */
                      i < areas.length - 1 ? 'border-b border-border' : '',
                      /* right border on lg: all except last-in-row */
                      !isRightCol ? 'lg:border-r border-border' : '',
                      /* sm: remove right border from col 2 */
                      isMiddleRow ? 'sm:border-r-0' : 'sm:border-r border-border',
                    ].filter(Boolean).join(' ')}
                  >
                    {/* Area heading + arrow line */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl leading-none flex-shrink-0">{area.emoji}</span>
                      <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                        <h3 className="font-heading text-base sm:text-lg font-bold text-primary-text uppercase tracking-wide whitespace-nowrap">
                          {area.name}
                        </h3>
                        <div className="flex-1 h-px bg-border min-w-0" />
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: city.accentColor }}
                        />
                      </div>
                    </div>

                    {/* Spots */}
                    {area.spots.length > 0 ? (
                      <ul className="space-y-2 mb-5">
                        {area.spots.map((spot) => (
                          <li key={spot.name} className="flex items-start gap-2.5 text-sm">
                            <span
                              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: `${city.accentColor}90` }}
                            />
                            <span className="text-primary-text leading-snug flex-1">{spot.name}</span>
                            {spot.tag && (
                              <span className="text-[10px] text-muted italic flex-shrink-0 mt-0.5">{spot.tag}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-2 mb-5">
                        {area.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2.5 text-sm">
                            <span
                              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: `${city.accentColor}90` }}
                            />
                            <span className="text-primary-text leading-snug">{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/50">
                      <span
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0"
                        style={{
                          color: city.accentColor,
                          borderColor: `${city.accentColor}30`,
                          backgroundColor: `${city.accentColor}10`,
                        }}
                      >
                        {area.vibe}
                      </span>
                      <a
                        href={hotelNeighbourhoodUrl(city.name, area.name)}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline flex-shrink-0"
                      >
                        <Hotel size={11} />
                        Hotels in {area.name}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick facts footer */}
          <div className="bg-elevated border-t border-border px-6 sm:px-8 py-4 flex flex-wrap gap-x-6 gap-y-1.5">
            {[
              { label: 'Best Time', value: city.stats.bestTime },
              { label: 'Daily Budget', value: city.stats.budget },
              { label: 'Currency', value: city.stats.currency },
              { label: 'Language', value: city.stats.language },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs">
                <span className="text-muted">{label}:</span>
                <span className="font-semibold text-primary-text">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
