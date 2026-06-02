'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { City } from '@/lib/types';
import { allCities } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import SafeImage from '@/components/SafeImage';
import { ArrowRight } from 'lucide-react';

export default function RelatedCities({ city }: { city: City }) {
  const related = allCities
    .filter((c) => c.slug !== city.slug && c.country === city.country && !c.stub)
    .slice(0, 4);

  if (related.length < 2) return null;

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-6"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Explore More</p>
            <h2 className="font-heading text-2xl font-semibold text-primary-text">
              More Places in {city.country}
            </h2>
          </div>
          <Link href="/destinations" className="text-sm font-medium text-accent hover:underline flex items-center gap-1">
            All destinations <ArrowRight size={12} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {related.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link
                href={`/cities/${c.slug}`}
                className="group relative block overflow-hidden rounded-2xl"
                style={{ aspectRatio: '4/5' }}
              >
                <SafeImage
                  src={getCityImageUrl(c.slug, 'card') ?? c.image}
                  alt={`${c.name} travel guide`}
                  city={c.slug}
                  accentColor={c.accentColor}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-[9px] font-semibold text-white/55 uppercase tracking-wider mb-0.5">{c.flag} {c.country}</p>
                  <p className="font-heading text-base font-bold text-white group-hover:text-accent transition-colors leading-tight">{c.name}</p>
                  {c.stats?.bestTime && (
                    <p className="text-[10px] text-white/55 mt-0.5">Best: <span className="text-accent">{c.stats.bestTime}</span></p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
