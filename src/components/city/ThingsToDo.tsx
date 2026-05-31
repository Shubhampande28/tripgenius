'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { City } from '@/lib/types';
import { AnimateList, AnimateItem } from '@/components/AnimateList';
import SafeImage from '@/components/SafeImage';
import { getPlaceImageUrl } from '@/lib/placeImages';

const categoryColors: Record<string, string> = {
  Cultural:    'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Nature:      'bg-teal/10 text-teal border-teal/20',
  Adventure:   'bg-accent/10 text-accent border-accent/20',
  Culinary:    'bg-gold/10 text-gold border-gold/20',
  Relaxation:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Entertainment:'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Shopping:    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Scenic:      'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Iconic:      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Art & Culture': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Walking:     'bg-green-500/10 text-green-400 border-green-500/20',
  'Day Trip':  'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

export default function ThingsToDo({ city }: { city: City }) {
  if (!city.thingsToDo?.length) return null;
  return (
    <section id="things-to-do" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
            Experiences
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            Top {city.thingsToDo.length} Things to Do in {city.name} ({new Date().getFullYear()})
          </h2>
          <p className="mt-2 text-muted text-sm max-w-2xl">
            The best experiences in {city.name} — from iconic landmarks to local favourites, ranked by what travellers love most.
          </p>
        </motion.div>

        <AnimateList stagger={0.07} variant="row" className="space-y-4">
          {city.thingsToDo.map((item, i) => (
            <AnimateItem key={item.name} variant="row" hover>
              <div className="grid grid-cols-1 overflow-hidden bg-surface border border-border rounded-xl hover:border-accent/20 transition-colors group md:grid-cols-[180px_1fr]">
                {(() => {
                  const imgSrc = item.image ?? getPlaceImageUrl(city.slug, item.name, item.category);
                  return (
                    <div className="relative min-h-40 md:min-h-full md:w-[180px] flex-shrink-0 overflow-hidden">
                      {imgSrc ? (
                        <>
                          <SafeImage
                            src={imgSrc}
                            alt={`${item.name} in ${city.name}`}
                            city={city.slug}
                            accentColor={city.accentColor}
                            fill
                            sizes="(max-width: 768px) 100vw, 180px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-surface/25" />
                        </>
                      ) : (
                        /* No photo — show emoji on gradient */
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${city.accentColor}25 0%, ${city.accentColor}10 100%)`,
                          }}
                        >
                          <span className="text-6xl select-none">{item.icon}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="flex gap-5 p-5">
                  {/* Number */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center">
                    <span className="font-heading text-lg font-semibold text-muted group-hover:text-accent transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 text-2xl mt-0.5">{item.icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="font-semibold text-primary-text text-base">{item.name}</h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border ${
                          categoryColors[item.category] || 'bg-surface text-muted border-border'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock size={11} className="text-muted/60" />
                      <span className="text-xs text-muted/60">{item.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateItem>
          ))}
        </AnimateList>
      </div>
    </section>
  );
}
