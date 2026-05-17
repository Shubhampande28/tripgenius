'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Mehta',
    handle: '@priya.wanders',
    location: 'Mumbai, India',
    avatar: 'PM',
    avatarBg: 'bg-accent/20 text-accent',
    rating: 5,
    text: "The TripGenius Bali guide is the most detailed thing I've ever read about a destination. It told me to visit Tegallalang at dawn, recommended Locavore months ahead, and flagged the traffic nightmare between Kuta and Ubud. Felt like I had a local friend who'd lived there for years.",
    destination: '7 days in Bali',
  },
  {
    name: 'James Thornton',
    handle: '@james_exploring',
    location: 'London, UK',
    avatar: 'JT',
    avatarBg: 'bg-teal/20 text-teal',
    rating: 5,
    text: "I've read every Tokyo travel blog out there. TripGenius is the first guide that actually *gets* how I travel. The offbeat section alone — Yanaka, Shimokitazawa, Kagurazaka — gave me a Tokyo trip that felt genuinely mine, not a tourist checklist. Genuinely impressive.",
    destination: '10 days in Japan',
  },
  {
    name: 'Sofia Andersson',
    handle: '@sofia.latitude',
    location: 'Stockholm, Sweden',
    avatar: 'SA',
    avatarBg: 'bg-gold/20 text-gold',
    rating: 5,
    text: "Planning a romantic Paris anniversary felt overwhelming until I found TripGenius. The guide gave me things I'd never have found — the right time to visit the Louvre, a sunset picnic spot near Pont de l'Alma, and a hidden champagne bar in the 9th arrondissement. My partner cried. That's the bar.",
    destination: '5 days in Paris',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">
            Traveller Stories
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary-text">
            Trips That Became{' '}
            <span className="gradient-text-accent">Memories</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-elevated border border-border rounded-2xl p-6 flex flex-col hover:border-border/80 transition-colors card-glow"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center font-semibold text-sm flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-text">{t.name}</p>
                    <p className="text-xs text-muted">{t.location}</p>
                  </div>
                </div>
                <Quote size={18} className="text-border flex-shrink-0 mt-1" />
              </div>

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={12} className="text-gold fill-gold" />
                ))}
              </div>

              <p className="text-sm text-primary-text/80 leading-relaxed flex-1 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted">{t.handle}</span>
                <span className="text-xs font-medium text-accent">{t.destination}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
