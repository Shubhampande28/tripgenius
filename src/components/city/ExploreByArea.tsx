'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import { City } from '@/lib/types';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function ExploreByArea({ city }: { city: City }) {
  if (!city.areas || city.areas.length === 0) return null;

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
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Map size={15} className="text-gold" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">
              Explore by Area
            </p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            {city.name} by Neighbourhood
          </h2>
          <p className="mt-2 text-muted text-sm max-w-2xl leading-relaxed">
            Each area of {city.name} has a completely different personality.
            Here's exactly what to do — and where — in each one.
          </p>
        </motion.div>

        {/* Area cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {city.areas.map((area) => (
            <motion.div
              key={area.name}
              variants={cardVariants}
              className="group relative rounded-2xl overflow-hidden border border-border bg-surface hover:border-opacity-60 transition-all duration-300"
              style={{ '--area-accent': area.accentColor } as React.CSSProperties}
            >
              {/* Image strip */}
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={area.image}
                  alt={`${area.name}, ${city.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient over image */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

                {/* Emoji badge */}
                <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-dark/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-xl">
                  {area.emoji}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 pt-2">
                {/* Title + accent line */}
                <div
                  className="flex items-center gap-2 mb-1"
                >
                  <div
                    className="w-1 h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: area.accentColor }}
                  />
                  <h3
                    className="font-heading text-xl font-bold tracking-tight"
                    style={{ color: area.accentColor }}
                  >
                    {area.name.toUpperCase()}
                  </h3>
                </div>
                <p className="text-xs text-muted italic mb-4 ml-3">{area.tagline}</p>

                {/* Places list */}
                <ul className="space-y-2 ml-1">
                  {area.spots.map((spot) => (
                    <li key={spot.name} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: area.accentColor }}
                      />
                      <span className="text-sm text-primary-text/85 leading-snug flex-1">
                        {spot.name}
                      </span>
                      {spot.tag && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                          style={{
                            backgroundColor: `${area.accentColor}18`,
                            color: area.accentColor,
                            border: `1px solid ${area.accentColor}35`,
                          }}
                        >
                          {spot.tag}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom accent line on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ backgroundColor: area.accentColor }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
