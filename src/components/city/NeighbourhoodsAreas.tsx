'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { City } from '@/lib/types';

function findArea(city: City, neighbourhoodName: string) {
  const nName = neighbourhoodName.toLowerCase().replace(/[()]/g, '').trim();
  return city.areas?.find((a) => {
    const aName = a.name.toLowerCase().replace(/[()]/g, '').trim();
    if (aName === nName || aName.includes(nName) || nName.includes(aName)) return true;
    return aName.split(/[\s&,]+/).filter(p => p.length > 3).some(p => nName.includes(p));
  });
}

export default function NeighbourhoodsAreas({ city }: { city: City }) {
  if (!city.neighbourhoods?.length) return null;

  const areas = city.neighbourhoods.map((n) => {
    const matched = findArea(city, n.name);
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
                    <div className="flex items-center gap-2.5 mb-5">
                      <span className="text-2xl leading-none flex-shrink-0">{area.emoji}</span>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h3 className="font-heading text-sm sm:text-base font-bold text-primary-text uppercase tracking-widest whitespace-nowrap">
                          {area.name}
                        </h3>
                        <div className="flex-1 h-px bg-border/70" />
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: city.accentColor }}
                        />
                      </div>
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
