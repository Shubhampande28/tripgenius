'use client';

import { motion } from 'framer-motion';
import { Search, BookOpen, Plane } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Search your destination',
    description:
      'Type any of our featured cities. Each guide covers everything from under-the-radar restaurants to the best time of year to visit — all in one place.',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
  },
  {
    icon: BookOpen,
    number: '02',
    title: 'Read the insider guide',
    description:
      'Explore top experiences, hand-picked hotels, local dining gems, transport tips, and pro advice — written like a letter from a friend who lives there.',
    color: 'text-teal',
    bg: 'bg-teal/10',
    border: 'border-teal/20',
  },
  {
    icon: Plane,
    number: '03',
    title: 'Book and travel with confidence',
    description:
      'Use our curated affiliate links to book hotels and flights at the best rates. Then go — knowing every recommendation has been thoughtfully chosen.',
    color: 'text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/20',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-teal mb-3">
            How It Works
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary-text">
            Planning Made{' '}
            <span className="gradient-text-accent">Effortless</span>
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto">
            No overwhelm, no 50-tab rabbit holes. Just beautiful, comprehensive guides that
            tell you exactly where to go and what to do.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          <div className="hidden lg:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-accent/50 via-teal/50 to-gold/50" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative text-center lg:text-left"
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                  <div className={`relative w-16 h-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={24} className={step.color} />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-dark border border-border flex items-center justify-center">
                      <span className="text-xs font-bold text-muted">{i + 1}</span>
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${step.color} mb-1`}>{step.number}</p>
                    <h3 className="font-heading text-2xl font-semibold text-primary-text mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
