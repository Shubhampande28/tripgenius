'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { City } from '@/lib/types';

// Generic geography words that must NOT, on their own, link a neighbourhood to
// an area — otherwise "Assi Ghat" wrongly matches the "Dashashwamedh Ghat" area
// because both contain "Ghat".
const GENERIC_GEO = new Set([
  'ghat', 'ghats', 'city', 'old', 'new', 'north', 'south', 'east', 'west', 'central',
  'beach', 'beaches', 'town', 'area', 'district', 'road', 'market', 'markets', 'fort',
  'hill', 'hills', 'valley', 'river', 'lake', 'lakes', 'park', 'temple', 'temples',
  'quarter', 'bay', 'island', 'islands', 'downtown', 'centre', 'center', 'gali',
  'street', 'village', 'coast', 'national', 'main', 'upper', 'lower', 'inner', 'outer',
  'side', 'zone', 'region', 'greater',
]);

function norm(s: string) {
  return s.toLowerCase().replace(/[()&,/-]/g, ' ').replace(/\s+/g, ' ').trim();
}
function distinctiveTokens(s: string) {
  return new Set(norm(s).split(' ').filter((w) => w.length > 3 && !GENERIC_GEO.has(w)));
}

// Match a neighbourhood to an area to reuse its richer spot list. Strong
// (exact / whole-phrase substring) matches first, then a *distinctive* shared
// token. Each area is claimed at most once so two neighbourhoods can never show
// the same spots.
function findArea(city: City, neighbourhoodName: string, used: Set<string>) {
  const areas = city.areas ?? [];
  const nNorm = norm(neighbourhoodName);
  const nTok = distinctiveTokens(neighbourhoodName);

  let match = areas.find((a) => {
    if (used.has(a.name)) return false;
    const aNorm = norm(a.name);
    return aNorm === nNorm || nNorm.includes(aNorm) || aNorm.includes(nNorm);
  });
  if (!match) {
    match = areas.find((a) => {
      if (used.has(a.name)) return false;
      for (const tok of distinctiveTokens(a.name)) if (nTok.has(tok)) return true;
      return false;
    });
  }
  if (match) used.add(match.name);
  return match;
}

export default function NeighbourhoodsAreas({ city }: { city: City }) {
  if (!city.neighbourhoods?.length) return null;

  const used = new Set<string>();
  const areas = city.neighbourhoods.map((n) => {
    const matched = findArea(city, n.name, used);
    return {
      ...n,
      emoji: matched?.emoji ?? '📍',
      spots: matched?.spots ?? [],
      image: matched?.image,
    };
  });

  return (
    <section id="explore-areas" className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2 mb-6"
        >
          <MapPin size={14} className="text-accent" />
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Explore Areas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-3xl border border-border overflow-hidden shadow-lg"
        >
          {/* Header */}
          <div
            className="px-6 sm:px-8 py-5"
            style={{ background: `linear-gradient(135deg, ${city.accentColor} 0%, ${city.accentColor}CC 100%)` }}
          >
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-0.5">TripGenius Destination Guide</p>
            <h2 className="font-heading text-xl sm:text-3xl font-bold text-white">
              {city.name} — Where to Go &amp; What to Do
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-surface">
            {areas.map((area, i) => {
              const spots = area.spots.length > 0 ? area.spots : area.highlights.map(h => ({ name: h, tag: '' }));
              const borderRight = i % 3 !== 2 ? 'lg:border-r' : '';
              const borderBottom = i < areas.length - (areas.length % 3 === 0 ? 3 : areas.length % 3) ? 'lg:border-b' : '';
              const smBorderRight = i % 2 === 0 ? 'sm:border-r' : '';
              const smBorderBottom = i < areas.length - 2 ? 'sm:border-b' : '';

              return (
                <div
                  key={area.name}
                  className={`relative overflow-hidden border-b border-border last:border-b-0 sm:last:border-b-0 ${borderRight} ${borderBottom} ${smBorderRight} ${smBorderBottom} lg:border-b-0 border-border`}
                >
                  {/* Faded background image */}
                  {area.image && (
                    <>
                      <Image
                        src={area.image}
                        alt={area.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-surface/[0.80]" />
                    </>
                  )}

                  {/* Content */}
                  <div className="relative z-10 p-6 sm:p-7">
                    {/* Area heading */}
                    <div className="flex items-start gap-2.5 mb-5">
                      <span className="text-2xl leading-none flex-shrink-0">{area.emoji}</span>
                      <h3 className="flex-1 min-w-0 font-heading text-sm sm:text-base font-bold text-primary-text uppercase tracking-wide leading-tight break-words">
                        {area.name}
                      </h3>
                      <span
                        className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: city.accentColor }}
                      />
                    </div>

                    {/* Spot list — no tags, just names */}
                    <ul className="space-y-2">
                      {spots.map((spot) => (
                        <li key={spot.name} className="flex items-start gap-2.5">
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: `${city.accentColor}90` }}
                          />
                          <span className="text-sm text-primary-text leading-snug">{spot.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
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
