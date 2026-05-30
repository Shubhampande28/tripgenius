'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { City } from '@/lib/types';

const typeColors: Record<string, string> = {
  'Hidden Nature':      'bg-teal/10 text-teal border-teal/25',
  'Off the Beaten Path':'bg-accent/10 text-accent border-accent/25',
  'Hidden Coastal Gem': 'bg-blue-500/10 text-blue-400 border-blue-500/25',
  'Spiritual Secret':   'bg-purple-500/10 text-purple-400 border-purple-500/25',
  'Cultural Hidden Gem':'bg-gold/10 text-gold border-gold/25',
  'Urban Escape':       'bg-teal/10 text-teal border-teal/25',
  'Local Neighbourhood':'bg-green-500/10 text-green-400 border-green-500/25',
  'Hidden Cultural Gem':'bg-gold/10 text-gold border-gold/25',
  'Early Morning Secret':'bg-orange-500/10 text-orange-400 border-orange-500/25',
  'Hidden Green Space': 'bg-teal/10 text-teal border-teal/25',
  'Overlooked Monument':'bg-purple-500/10 text-purple-400 border-purple-500/25',
  'Quirky Museum':      'bg-pink-500/10 text-pink-400 border-pink-500/25',
  "Local's Park":       'bg-green-500/10 text-green-400 border-green-500/25',
  'Historic Neighbourhood': 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  'Hidden Shrine':      'bg-red-500/10 text-red-400 border-red-500/25',
  'Bohemian Quarter':   'bg-pink-500/10 text-pink-400 border-pink-500/25',
  'Hidden Neighbourhood':'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
  'Arts & Culture':     'bg-rose-500/10 text-rose-400 border-rose-500/25',
  'Mountain Escape':    'bg-slate-500/10 text-slate-400 border-slate-500/25',
  'Historical Quarter': 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  'Desert Secret':      'bg-yellow-500/10 text-yellow-400 border-yellow-500/25',
  'Hidden Island':      'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
  'Heritage Quarter':   'bg-orange-500/10 text-orange-400 border-orange-500/25',
  'Secret Beach':       'bg-teal/10 text-teal border-teal/25',
  'Ruined Fort':        'bg-stone-500/10 text-stone-400 border-stone-500/25',
};

export default function OffbeatPlaces({ city }: { city: City }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!city.offbeatPlaces?.length) return null;

  return (
    <section id="hidden-gems" className="py-16">
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
            <div className="w-8 h-8 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center">
              <Compass size={15} className="text-teal" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">
              Go Beyond the Guidebook
            </p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            Hidden Gems in {city.name}: Offbeat Places Locals Love
          </h2>
          <p className="mt-2 text-muted max-w-2xl leading-relaxed">
            The places locals know and tourists miss. No queues, no crowds —
            just the side of {city.name} that makes you feel like you actually discovered something.
          </p>
        </motion.div>

        {/* Accordion cards */}
        <div className="space-y-3">
          {city.offbeatPlaces.map((place, i) => {
            const isOpen = openIndex === i;
            const colorClass = typeColors[place.type] || 'bg-surface text-muted border-border';

            return (
              <motion.div
                key={place.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-elevated border-teal/30 shadow-lg shadow-teal/5'
                      : 'bg-surface border-border hover:border-border/80'
                  }`}
                >
                  {/* Toggle header */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center gap-4 p-5 text-left group"
                  >
                    {/* Emoji icon */}
                    <div className="text-2xl flex-shrink-0 w-10 text-center">{place.icon}</div>

                    {/* Title + badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className={`font-semibold text-base transition-colors ${isOpen ? 'text-teal' : 'text-primary-text group-hover:text-teal'}`}>
                          {place.name}
                        </h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border flex-shrink-0 ${colorClass}`}>
                          {place.type}
                        </span>
                      </div>
                      {!isOpen && (
                        <p className="text-xs text-muted truncate max-w-lg">{place.description.slice(0, 90)}…</p>
                      )}
                    </div>

                    {/* Chevron */}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-teal/15 text-teal' : 'bg-elevated text-muted'}`}>
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border/50 mt-1">
                          {/* Description */}
                          <div className="md:col-span-2">
                            <p className="text-sm text-primary-text/80 leading-relaxed mb-4">
                              {place.description}
                            </p>

                            {/* Why it's special */}
                            <div className="p-3.5 bg-dark rounded-xl border border-border/50">
                              <p className="text-xs font-semibold text-teal mb-1.5 uppercase tracking-wide">
                                Why most people miss it
                              </p>
                              <p className="text-xs text-muted leading-relaxed">{place.why}</p>
                            </div>
                          </div>

                          {/* Tip card */}
                          <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <MapPin size={12} className="text-gold" />
                                <p className="text-xs font-semibold text-gold uppercase tracking-wide">
                                  Local Tip
                                </p>
                              </div>
                              <p className="text-xs text-primary-text/80 leading-relaxed">{place.tip}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
