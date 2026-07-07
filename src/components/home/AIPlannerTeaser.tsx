'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Sun, Sunset } from 'lucide-react';

const sampleOutput = {
  destination: 'Bali, Indonesia',
  day: 'Day 1 - Arrival & Ubud Immersion',
  activities: [
    {
      icon: Sun,
      time: 'Morning',
      title: 'Tegallalang Rice Terraces',
      desc: 'Arrive at dawn to catch the first light over the stepped emerald terraces. Walk the trails and stop at a local warung for fresh coconut coffee.',
      label: '07:00 – 10:00',
    },
    {
      icon: Sunset,
      time: 'Afternoon',
      title: 'Sacred Monkey Forest & Ubud Palace',
      desc: "Wander through the ancient forest sanctuary, then explore Ubud's royal palace and artisan market streets.",
      label: '13:00 – 17:00',
    },
  ],
};

export default function AIPlannerTeaser() {
  const [visible, setVisible] = useState(false);

  return (
    <section className="py-24 lg:py-32 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(255,107,53,0.08),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              Self-Serve Trip Planner
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl font-semibold text-primary-text leading-tight">
              Plan your own trip in minutes
            </h2>
            <p className="mt-5 text-muted leading-relaxed">
              Choose a destination, dates, travel style and interests. TripGenius builds a
              flexible plan you can adjust around real days, not a forced checklist.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                'Flexible day plans with no repeated activities',
                'Budget guidance for stays, food, transport and experiences',
                'Local tips woven into the itinerary',
                'Free and instant, with no sign-up',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-4">
              <Link href="/plan" className="btn btn-primary px-6 py-3">
                <Sparkles size={16} />
                Plan a Trip
              </Link>
              <Link
                href="/#cities"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary-text transition-colors group"
              >
                Or browse cities
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Demo card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs font-medium text-muted">Generating itinerary…</span>
                </div>
                <Sparkles size={14} className="text-gold" />
              </div>

              {/* Destination badge */}
              <div className="px-5 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                  <span className="text-xs font-semibold text-accent">{sampleOutput.destination}</span>
                </div>
                <h3 className="mt-3 font-heading text-xl font-semibold text-primary-text">
                  {sampleOutput.day}
                </h3>
              </div>

              {/* Activities */}
              <div className="px-5 pb-5 mt-4 space-y-3">
                {sampleOutput.activities.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <motion.div
                      key={act.time}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex gap-3 p-3 rounded-xl bg-elevated border border-border/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={14} className="text-accent" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-primary-text">{act.title}</span>
                          <span className="text-xs text-muted/60">{act.label}</span>
                        </div>
                        <p className="text-xs text-muted leading-relaxed line-clamp-2">{act.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer CTA */}
              <div className="px-5 py-4 bg-dark/50 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted">3 days • 2 people • Adventure style</span>
                <span className="text-xs font-semibold text-teal">View full plan →</span>
              </div>
            </div>

            {/* Floating card effect */}
            <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border border-accent/20 bg-transparent -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
