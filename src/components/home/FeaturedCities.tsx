'use client';

import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { getCityImageUrl } from '@/lib/cityImages';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import { cities } from '@/lib/cities';

const vibeColors: Record<string, string> = {
  Spiritual:   'bg-gold/20 text-gold border-gold/30',
  Romantic:    'bg-accent/20 text-accent border-accent/30',
  Adventure:   'bg-teal/20 text-teal border-teal/30',
  Cultural:    'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Foodie:      'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Luxury:      'bg-gold/20 text-gold border-gold/30',
  Beach:       'bg-teal/20 text-teal border-teal/30',
  Bohemian:    'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Spectacle:   'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function FeaturedCities() {
  return (
    <section id="cities" className="py-24 lg:py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            Destinations
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary-text">
            Cities That Define{' '}
            <span className="gradient-text-teal">Exploration</span>
          </h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">
            Each city guide is a deep dive into culture, cuisine, and hidden corners — crafted
            for travelers who want more than a tourist checklist.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cities.map((city) => (
            <motion.div key={city.slug} variants={cardVariants}>
              <Link href={`/cities/${city.slug}`}>
                <div className="group relative rounded-2xl overflow-hidden h-80 cursor-pointer transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">

                  {/* Real photo */}
                  <SafeImage
                    src={getCityImageUrl(city.slug, 'card') ?? city.image}
                    alt={`${city.name} travel guide — ${city.tagline}`}
                    city={city.slug}
                    accentColor={city.accentColor}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={false}
                  />

                  {/* Layered overlays: always-on dark base + stronger bottom gradient */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Colour tint on hover to keep the brand feel */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br"
                    style={{ background: `linear-gradient(135deg, ${city.accentColor}40, transparent)` }}
                  />

                  {/* Flag badge + arrow */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
                      <span className="text-lg">{city.flag}</span>
                      <span className="text-xs font-semibold text-white/90">{city.country}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                      <ArrowUpRight size={14} className="text-white" />
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3 className="font-heading text-3xl font-bold text-white drop-shadow-lg">
                      {city.name}
                    </h3>
                    <p className="text-xs text-white/60 mt-0.5 mb-3 italic">{city.tagline}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={11} className="text-white/50" />
                      <span className="text-xs text-white/50">Best: {city.stats.bestTime}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {city.vibes.map((vibe) => (
                        <span
                          key={vibe}
                          className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-sm ${
                            vibeColors[vibe] || 'bg-white/15 text-white/80 border-white/20'
                          }`}
                        >
                          {vibe}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ backgroundColor: city.accentColor }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
