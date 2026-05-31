'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import Image from 'next/image';
import { City } from '@/lib/types';
import { AnimateList, AnimateItem } from '@/components/AnimateList';
import { getPlaceImageUrl } from '@/lib/placeImages';

// Category → color token (accent bar + badge tint)
const CATEGORY_COLOR: Record<string, { bar: string; badge: string; text: string }> = {
  Cultural:        { bar: 'bg-purple-500',  badge: 'bg-purple-500/12 border-purple-500/25', text: 'text-purple-500' },
  Nature:          { bar: 'bg-teal',        badge: 'bg-teal/12 border-teal/25',             text: 'text-teal' },
  Adventure:       { bar: 'bg-accent',      badge: 'bg-accent/12 border-accent/25',         text: 'text-accent' },
  Culinary:        { bar: 'bg-gold',        badge: 'bg-gold/12 border-gold/25',             text: 'text-gold' },
  Scenic:          { bar: 'bg-cyan-500',    badge: 'bg-cyan-500/12 border-cyan-500/25',     text: 'text-cyan-500' },
  Iconic:          { bar: 'bg-yellow-500',  badge: 'bg-yellow-500/12 border-yellow-500/25', text: 'text-yellow-500' },
  Shopping:        { bar: 'bg-indigo-500',  badge: 'bg-indigo-500/12 border-indigo-500/25', text: 'text-indigo-400' },
  Relaxation:      { bar: 'bg-blue-400',    badge: 'bg-blue-500/12 border-blue-500/25',     text: 'text-blue-400' },
  Entertainment:   { bar: 'bg-pink-500',    badge: 'bg-pink-500/12 border-pink-500/25',     text: 'text-pink-400' },
  Walking:         { bar: 'bg-green-500',   badge: 'bg-green-500/12 border-green-500/25',   text: 'text-green-500' },
  'Day Trip':      { bar: 'bg-orange-500',  badge: 'bg-orange-500/12 border-orange-500/25', text: 'text-orange-400' },
  'Art & Culture': { bar: 'bg-rose-500',    badge: 'bg-rose-500/12 border-rose-500/25',     text: 'text-rose-400' },
  Wellness:        { bar: 'bg-emerald-500', badge: 'bg-emerald-500/12 border-emerald-500/25', text: 'text-emerald-500' },
  Historical:      { bar: 'bg-amber-600',   badge: 'bg-amber-500/12 border-amber-500/25',   text: 'text-amber-500' },
  Spiritual:       { bar: 'bg-violet-500',  badge: 'bg-violet-500/12 border-violet-500/25', text: 'text-violet-400' },
  UNESCO:          { bar: 'bg-teal',        badge: 'bg-teal/12 border-teal/25',             text: 'text-teal' },
  Festival:        { bar: 'bg-pink-500',    badge: 'bg-pink-500/12 border-pink-500/25',     text: 'text-pink-400' },
  Nightlife:       { bar: 'bg-purple-600',  badge: 'bg-purple-500/12 border-purple-500/25', text: 'text-purple-400' },
  Photography:     { bar: 'bg-blue-500',    badge: 'bg-blue-500/12 border-blue-500/25',     text: 'text-blue-400' },
  Wildlife:        { bar: 'bg-green-600',   badge: 'bg-green-500/12 border-green-500/25',   text: 'text-green-500' },
  Trekking:        { bar: 'bg-accent',      badge: 'bg-accent/12 border-accent/25',         text: 'text-accent' },
  Unique:          { bar: 'bg-accent',      badge: 'bg-accent/12 border-accent/25',         text: 'text-accent' },
  Landmark:        { bar: 'bg-yellow-500',  badge: 'bg-yellow-500/12 border-yellow-500/25', text: 'text-yellow-500' },
  Essential:       { bar: 'bg-teal',        badge: 'bg-teal/12 border-teal/25',             text: 'text-teal' },
  'Hidden gem':    { bar: 'bg-cyan-500',    badge: 'bg-cyan-500/12 border-cyan-500/25',     text: 'text-cyan-500' },
  'UNESCO Experience': { bar: 'bg-teal',   badge: 'bg-teal/12 border-teal/25',              text: 'text-teal' },
};

const DEFAULT_COLOR = { bar: 'bg-accent', badge: 'bg-accent/12 border-accent/25', text: 'text-accent' };

export default function ThingsToDo({ city }: { city: City }) {
  if (!city.thingsToDo?.length) return null;

  return (
    <section id="things-to-do" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Experiences</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            Top {city.thingsToDo.length} Things to Do in {city.name} ({new Date().getFullYear()})
          </h2>
          <p className="mt-2 text-sm text-muted max-w-2xl">
            The best experiences in {city.name} — from iconic landmarks to local favourites.
          </p>
        </motion.div>

        <AnimateList stagger={0.06} className="space-y-3">
          {city.thingsToDo.map((item, i) => {
            const col = CATEGORY_COLOR[item.category] ?? DEFAULT_COLOR;
            const specificImg = item.image ?? getPlaceImageUrl(city.slug, item.name, item.category);

            return (
              <AnimateItem key={item.name}>
                <div className="group flex overflow-hidden bg-surface border border-border rounded-2xl hover:border-accent/25 hover:shadow-md transition-all duration-200">

                  {/* Left accent bar */}
                  <div className={`w-1 flex-shrink-0 ${col.bar} rounded-l-2xl`} />

                  {/* If we have a specific place photo, show it */}
                  {specificImg && (
                    <div className="relative w-[140px] sm:w-[180px] flex-shrink-0 overflow-hidden hidden sm:block">
                      <Image
                        src={specificImg}
                        alt={`${item.name} — ${city.name}`}
                        fill
                        sizes="180px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/20" />
                    </div>
                  )}

                  {/* Main content */}
                  <div className="flex items-start gap-4 p-4 sm:p-5 flex-1 min-w-0">

                    {/* Number + Emoji block */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-1">
                      <span className={`text-[11px] font-bold tabular-nums ${col.text}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-2xl leading-none">{item.icon}</span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="font-semibold text-primary-text text-base leading-snug">
                          {item.name}
                        </h3>
                        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${col.badge} ${col.text}`}>
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock size={11} className="text-muted/50" />
                        <span className="text-xs text-muted/60">{item.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateItem>
            );
          })}
        </AnimateList>
      </div>
    </section>
  );
}
