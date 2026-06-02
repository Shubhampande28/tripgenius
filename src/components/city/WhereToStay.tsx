'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Hotel, BedDouble } from 'lucide-react';
import { hotelNeighbourhoodUrl, hotelUrl } from '@/lib/affiliateLinks';
import { City } from '@/lib/types';

const priceColors: Record<string, string> = {
  '$':    'text-teal bg-teal/10 border-teal/25',
  '$$':   'text-blue-500 bg-blue-500/10 border-blue-400/25',
  '$$$':  'text-accent bg-accent/10 border-accent/25',
  '$$$$': 'text-gold bg-gold/10 border-gold/25',
};
const priceLabel: Record<string, string> = {
  '$': 'Budget', '$$': 'Mid-range', '$$$': 'Upscale', '$$$$': 'Luxury',
};

/** Fuzzy area match (reuse same logic as cheatsheet) */
function findAreaImage(city: City, name: string): string | undefined {
  const nName = name.toLowerCase().replace(/[()]/g, '').trim();
  const matched = city.areas?.find((a) => {
    const aName = a.name.toLowerCase().replace(/[()]/g, '').trim();
    if (aName === nName || aName.includes(nName) || nName.includes(aName)) return true;
    return aName.split(/[\s&,]+/).filter(p => p.length > 3).some(p => nName.includes(p));
  });
  return matched?.image;
}

export default function WhereToStay({ city }: { city: City }) {
  const areas = city.neighbourhoods ?? [];
  if (!areas.length && !city.hotels?.length) return null;

  return (
    <section id="where-to-stay" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Accommodation</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            Where to Stay in {city.name}
          </h2>
          <p className="mt-2 text-sm text-muted max-w-2xl">
            Pick your area first — each neighbourhood has a completely different price point and vibe.
          </p>
        </motion.div>

        {areas.length > 0 ? (
          <>
            {/* Area booking grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map((area, i) => {
                const areaImg = findAreaImage(city, area.name);
                const price = priceColors[area.priceRange] ?? priceColors['$$'];
                const pLabel = priceLabel[area.priceRange] ?? 'Mid-range';

                return (
                  <motion.a
                    key={area.name}
                    href={hotelNeighbourhoodUrl(city.name, area.name)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                    className="group relative rounded-2xl overflow-hidden border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    {/* Area image */}
                    <div className="relative h-44 overflow-hidden">
                      {areaImg ? (
                        <Image
                          src={areaImg}
                          alt={`${area.name}, ${city.name}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(135deg, ${city.accentColor}40, ${city.accentColor}20)`,
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Price badge over image */}
                      <div className="absolute top-3 right-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${price}`}>
                          {area.priceRange} · {pLabel}
                        </span>
                      </div>

                      {/* Area name over image */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="font-heading text-lg font-bold text-white leading-tight">{area.name}</p>
                        <p className="text-xs text-white/70 italic mt-0.5">{area.vibe}</p>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex flex-col gap-3 flex-1 bg-surface">
                      <p className="text-xs text-muted leading-relaxed line-clamp-2">{area.description}</p>

                      {/* Best for chips */}
                      <div className="flex flex-wrap gap-1">
                        {area.bestFor.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-elevated border border-border text-muted">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="mt-auto flex items-center justify-end pt-3 border-t border-border/50">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:underline">
                          <Hotel size={12} />
                          Find Hotels →
                        </span>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Generic city-wide hotel search CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 flex items-center justify-between gap-4 p-5 rounded-2xl border border-accent/20 bg-accent/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <BedDouble size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-text">Not sure which area?</p>
                  <p className="text-xs text-muted mt-0.5">Search all hotels in {city.name} and filter by neighbourhood</p>
                </div>
              </div>
              <a
                href={hotelUrl(city.name)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors flex-shrink-0"
              >
                <Hotel size={14} />
                All Hotels
              </a>
            </motion.div>
          </>
        ) : (
          /* Fallback: generic search banner */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden h-56 border border-border"
          >
            {city.heroImage && (
              <Image src={city.heroImage} alt={city.name} fill className="object-cover opacity-40" sizes="100vw" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="font-heading text-2xl font-semibold text-primary-text">
                Find Your Perfect Stay in {city.name}
              </p>
              <a
                href={hotelUrl(city.name)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center gap-2 px-6 py-3 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                <Hotel size={15} />
                Browse Hotels on Booking.com
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
