'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { City } from '@/lib/types';
import { allCities } from '@/lib/cities';
import { fadeUp, stagger, cardHover, VIEWPORT } from '@/lib/animations';

export default function RelatedCities({ city }: { city: City }) {
  const related = allCities
    .filter((c) => c.slug !== city.slug && c.country === city.country)
    .slice(0, 4);

  if (related.length < 2) return null;

  return (
    <section id="related-cities" className="py-14 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mb-8"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Explore More</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary-text">
            More Places to Visit in {city.country}
          </h2>
        </motion.div>

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {related.map((c) => (
            <motion.div key={c.slug} variants={fadeUp}>
              <motion.div
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href={`/cities/${c.slug}`}
                  className="group flex flex-col gap-2 p-4 bg-surface border border-border rounded-2xl hover:border-accent/40 transition-colors duration-200 h-full"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{c.flag}</span>
                    <span className="text-xs text-muted font-medium truncate">{c.country}</span>
                  </div>
                  <p className="font-heading text-lg font-semibold text-primary-text group-hover:text-accent transition-colors leading-tight">
                    {c.name}
                  </p>
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">{c.tagline}</p>
                  <div className="mt-auto pt-2 flex flex-wrap gap-1">
                    {c.vibes.slice(0, 2).map((v) => (
                      <span key={v} className="text-[10px] px-2 py-0.5 rounded-full bg-elevated border border-border text-muted">
                        {v}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
