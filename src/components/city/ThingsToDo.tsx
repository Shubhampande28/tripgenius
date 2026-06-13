'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { City } from '@/lib/types';
import { AnimateList, AnimateItem } from '@/components/AnimateList';

const CATEGORY_STYLE: Record<string, { icon: string; text: string; bg: string; border: string }> = {
  Cultural:        { icon: 'text-purple-500', text: 'text-purple-500', bg: 'bg-purple-500/12',  border: 'border-purple-500/25' },
  Nature:          { icon: 'text-teal',       text: 'text-teal',       bg: 'bg-teal/12',        border: 'border-teal/25' },
  Adventure:       { icon: 'text-accent',     text: 'text-accent',     bg: 'bg-accent/12',      border: 'border-accent/25' },
  Culinary:        { icon: 'text-gold',       text: 'text-gold',       bg: 'bg-gold/15',        border: 'border-gold/30' },
  Beach:           { icon: 'text-sky-400',    text: 'text-sky-400',    bg: 'bg-sky-500/12',     border: 'border-sky-500/25' },
  Scenic:          { icon: 'text-cyan-500',   text: 'text-cyan-500',   bg: 'bg-cyan-500/12',    border: 'border-cyan-500/25' },
  Iconic:          { icon: 'text-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/12',  border: 'border-yellow-500/25' },
  Shopping:        { icon: 'text-indigo-400', text: 'text-indigo-400', bg: 'bg-indigo-500/12',  border: 'border-indigo-500/25' },
  Relaxation:      { icon: 'text-blue-400',   text: 'text-blue-400',   bg: 'bg-blue-500/12',    border: 'border-blue-500/25' },
  Entertainment:   { icon: 'text-pink-400',   text: 'text-pink-400',   bg: 'bg-pink-500/12',    border: 'border-pink-500/25' },
  Walking:         { icon: 'text-green-500',  text: 'text-green-500',  bg: 'bg-green-500/12',   border: 'border-green-500/25' },
  'Day Trip':      { icon: 'text-orange-400', text: 'text-orange-400', bg: 'bg-orange-500/12',  border: 'border-orange-500/25' },
  'Art & Culture': { icon: 'text-rose-400',   text: 'text-rose-400',   bg: 'bg-rose-500/12',    border: 'border-rose-500/25' },
  Wellness:        { icon: 'text-emerald-500',text: 'text-emerald-500',bg: 'bg-emerald-500/12', border: 'border-emerald-500/25' },
  Historical:      { icon: 'text-amber-500',  text: 'text-amber-500',  bg: 'bg-amber-500/12',   border: 'border-amber-500/25' },
  Spiritual:       { icon: 'text-violet-400', text: 'text-violet-400', bg: 'bg-violet-500/12',  border: 'border-violet-500/25' },
  Nightlife:       { icon: 'text-purple-400', text: 'text-purple-400', bg: 'bg-purple-500/12',  border: 'border-purple-500/25' },
  Wildlife:        { icon: 'text-green-500',  text: 'text-green-500',  bg: 'bg-green-600/12',   border: 'border-green-600/25' },
  Trekking:        { icon: 'text-accent',     text: 'text-accent',     bg: 'bg-accent/12',      border: 'border-accent/25' },
  Festival:        { icon: 'text-pink-400',   text: 'text-pink-400',   bg: 'bg-pink-500/12',    border: 'border-pink-500/25' },
  UNESCO:          { icon: 'text-teal',       text: 'text-teal',       bg: 'bg-teal/12',        border: 'border-teal/25' },
  Photography:     { icon: 'text-blue-400',   text: 'text-blue-400',   bg: 'bg-blue-500/12',    border: 'border-blue-500/25' },
  Unique:          { icon: 'text-accent',     text: 'text-accent',     bg: 'bg-accent/12',      border: 'border-accent/25' },
  Landmark:        { icon: 'text-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/12',  border: 'border-yellow-500/25' },
  'Hidden gem':    { icon: 'text-cyan-500',   text: 'text-cyan-500',   bg: 'bg-cyan-500/12',    border: 'border-cyan-500/25' },
  'UNESCO Experience': { icon: 'text-teal',   text: 'text-teal',       bg: 'bg-teal/12',        border: 'border-teal/25' },
};

const DEFAULT_STYLE = { icon: 'text-accent', text: 'text-accent', bg: 'bg-accent/12', border: 'border-accent/25' };

export default function ThingsToDo({ city }: { city: City }) {
  if (!city.thingsToDo?.length) return null;

  return (
    <section id="things-to-do" className="py-10">
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
            The best experiences in {city.name} — from iconic landmarks to local favourites, ranked by what travellers love most.
          </p>
        </motion.div>

        <AnimateList stagger={0.06} className="space-y-3">
          {city.thingsToDo.map((item, i) => {
            const s = CATEGORY_STYLE[item.category] ?? DEFAULT_STYLE;
            const num = String(i + 1).padStart(2, '0');

            return (
              <AnimateItem key={item.name}>
                <div className="relative overflow-hidden bg-surface border border-border rounded-2xl hover:border-accent/25 hover:shadow-md transition-all duration-200 group">

                  {/* Watermark number — faded giant in background */}
                  <span
                    aria-hidden
                    className="pointer-events-none select-none absolute right-3 bottom-0 font-heading font-bold leading-none text-[7rem] text-primary-text/[0.04]"
                  >
                    {num}
                  </span>

                  <div className="relative z-10 flex items-start gap-4 p-5">

                    {/* Icon box */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center`}>
                      <span className="text-2xl leading-none">{item.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                        {/* Small rank */}
                        <span className={`text-[11px] font-bold tabular-nums ${s.text}`}>{num}</span>
                        <h3 className="font-semibold text-primary-text text-base leading-snug">
                          {item.name}
                        </h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.bg} ${s.border} ${s.text}`}>
                          {item.category}
                        </span>
                      </div>

                      <p className="text-sm text-muted leading-relaxed">{item.description}</p>

                      <div className="flex items-center gap-1.5 mt-2.5">
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
